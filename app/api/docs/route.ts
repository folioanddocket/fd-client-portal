export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { select } from "../../../lib/airtable";

function esc(str: string) {
  return String(str ?? "").replace(/'/g, "''");
}

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
    if (!email) return NextResponse.json([]);

    // 1) Find client by email
    const c = await select("Clients", {
      filterByFormula: `LOWER({Primary Contact Email}) = '${esc(email)}'`,
      maxRecords: 1,
      fields: ["Client Record ID"]
    });
    const clientId = c.records[0]?.fields?.["Client Record ID"] as string | undefined;
    if (!clientId) return NextResponse.json([]);

    // 2) Get Vendor Docs for this client — use JSON so attachments include URLs
    const docs = await select("Vendor Docs", {
      filterByFormula: `FIND('${clientId}', ARRAYJOIN({Client Record ID (lkp)})) > 0`,
      maxRecords: 500,
      cellFormat: "json", // <-- important for attachments
      fields: ["Vendor","Doc Type","File","Expiration Date","Status (auto)"],
      sort: [{ field: "Expiration Date", direction: "asc" }]
    });

    // 3) Collect vendor record IDs to resolve names
    const vendorIds = new Set<string>();
    for (const r of docs.records) {
      const v = r.fields?.["Vendor"];
      if (Array.isArray(v)) {
        for (const id of v) if (typeof id === "string") vendorIds.add(id);
      }
    }

    // 4) Fetch vendor names and build id->name map
    const idList = Array.from(vendorIds);
    let idToName = new Map<string, string>();
    if (idList.length) {
      const or = idList.map(id => `RECORD_ID() = '${esc(id)}'`).join(",");
      const vendors = await select("Vendors", {
        filterByFormula: idList.length === 1 ? or : `OR(${or})`,
        maxRecords: idList.length,
        fields: ["Vendor Name"]
      });
      for (const v of vendors.records) {
        const name = v.fields?.["Vendor Name"] as string | undefined;
        if (name) idToName.set(v.id, name);
      }
    }

    // 5) Shape response: keep attachments with urls; replace Vendor with display name
    const out = docs.records.map(r => {
      const fieldVendor = r.fields?.["Vendor"];
      let vendorName = "—";
      if (Array.isArray(fieldVendor) && fieldVendor.length) {
        const firstId = fieldVendor[0];
        vendorName = (typeof firstId === "string" ? (idToName.get(firstId) || firstId) : "—");
      }
      return {
        id: r.id,
        ...r.fields,
        Vendor: vendorName  // UI expects a simple string here
      };
    });

    return NextResponse.json(out);
  } catch (e) {
    console.error("docs api error", e);
    return NextResponse.json([]);
  }
}
