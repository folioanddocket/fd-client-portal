export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { select } from "../../../lib/airtable";

function esc(s: string) { return String(s ?? "").replace(/'/g, "''"); }

export async function GET(_req: NextRequest) {
  try {
    const user = await currentUser();
    const email =
      user?.primaryEmailAddress?.emailAddress?.toLowerCase().trim() ||
      user?.emailAddresses?.[0]?.emailAddress?.toLowerCase().trim() ||
      "";
    if (!email) return NextResponse.json([], { status: 401 });

    // 1) Find client
    const c = await select("Clients", {
      filterByFormula: `LOWER({Primary Contact Email}) = '${esc(email)}'`,
      maxRecords: 1,
      fields: ["Client Record ID"],
    });
    const clientId = c.records[0]?.fields?.["Client Record ID"] as string | undefined;
    if (!clientId) return NextResponse.json([]);

    // 2) Docs for client (JSON so attachments include urls)
    const docs = await select("Vendor Docs", {
      filterByFormula: `FIND('${clientId}', ARRAYJOIN({Client Record ID (lkp)})) > 0`,
      maxRecords: 500,
      cellFormat: "json",
      fields: ["Vendor", "Doc Type", "File", "Expiration Date", "Status (auto)"],
      sort: [{ field: "Expiration Date", direction: "asc" }],
    });

    // 3) Resolve Vendor record IDs to names
    const vendorIds = new Set<string>();
    for (const r of docs.records) {
      const v = r.fields?.["Vendor"];
      if (Array.isArray(v)) {
        for (const id of v) if (typeof id === "string") vendorIds.add(id);
      }
    }
    const idList = Array.from(vendorIds);
    const idToName = new Map<string, string>();
    if (idList.length) {
      const or = idList.length === 1
        ? `RECORD_ID() = '${esc(idList[0])}'`
        : `OR(${idList.map(id => `RECORD_ID() = '${esc(id)}'`).join(",")})`;
      const vendors = await select("Vendors", {
        filterByFormula: or,
        maxRecords: idList.length,
        fields: ["Vendor Name"],
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
