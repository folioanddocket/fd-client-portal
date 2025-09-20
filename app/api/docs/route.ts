export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { select } from "../../../lib/airtable";

function esc(s: string) { return String(s ?? "").replace(/'/g, "''"); }

async function getClientIdByEmail(email: string): Promise<string | null> {
  try {
    const c = await select("Clients", {
      filterByFormula: `LOWER({Primary Contact Email}) = '${esc(email)}'`,
      maxRecords: 1,
      fields: ["Client Record ID"]
    });
    const id = c.records[0]?.fields?.["Client Record ID"] as string | undefined;
    if (id) return id;
  } catch {}
  try {
    const c2 = await select("Clients", {
      filterByFormula: `FIND('${esc(email)}', LOWER(SUBSTITUTE({Portal Login Emails}," ",""))) > 0`,
      maxRecords: 1,
      fields: ["Client Record ID"]
    });
    const id2 = c2.records[0]?.fields?.["Client Record ID"] as string | undefined;
    if (id2) return id2;
  } catch {}
  return null;
}

export async function GET(_req: NextRequest) {
  try {
    const user = await currentUser();
    const email =
      user?.primaryEmailAddress?.emailAddress?.toLowerCase().trim() ||
      user?.emailAddresses?.[0]?.emailAddress?.toLowerCase().trim() ||
      "";
    if (!email) return NextResponse.json([], { status: 401 });

    const clientId = await getClientIdByEmail(email);
    if (!clientId) return NextResponse.json([]);

    const docs = await select("Vendor Docs", {
      filterByFormula: `FIND('${clientId}', ARRAYJOIN({Client Record ID (lkp)})) > 0`,
      maxRecords: 500,
      cellFormat: "json", // keep attachment urls
      fields: ["Vendor","Doc Type","File","Expiration Date","Status (auto)"],
      sort: [{ field: "Expiration Date", direction: "asc" }]
    });

    // Resolve Vendor IDs -> names
    const vendorIds = new Set<string>();
    for (const r of docs.records) {
      const v = r.fields?.["Vendor"];
      if (Array.isArray(v)) for (const id of v) if (typeof id === "string") vendorIds.add(id);
    }
    const idToName = new Map<string, string>();
    if (vendorIds.size) {
      const ids = Array.from(vendorIds);
      const or = ids.length === 1
        ? `RECORD_ID() = '${esc(ids[0])}'`
        : `OR(${ids.map(id => `RECORD_ID() = '${esc(id)}'`).join(",")})`;
      const vendors = await select("Vendors", {
        filterByFormula: or,
        maxRecords: ids.length,
        fields: ["Vendor Name"]
      });
      for (const v of vendors.records) {
        const name = v.fields?.["Vendor Name"] as string | undefined;
        if (name) idToName.set(v.id, name);
      }
    }

    const out = docs.records.map(r => {
      const v = r.fields?.["Vendor"];
      let vendorName = "—";
      if (Array.isArray(v) && v.length) {
        const firstId = v[0];
        vendorName = typeof firstId === "string" ? (idToName.get(firstId) || firstId) : "—";
      }
      return { id: r.id, ...r.fields, Vendor: vendorName };
    });

    return NextResponse.json(out);
  } catch (e) {
    console.error("docs api error", e);
    return NextResponse.json([]);
  }
}
