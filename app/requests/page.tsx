export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { select } from "../../../lib/airtable";

function esc(str: string) {
  // Escape single quotes for Airtable formulas: O'Brien -> O''Brien
  return String(str ?? "").replace(/'/g, "''");
}

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
    if (!email) return NextResponse.json([]);

    // 1) Find the client by email
    const c = await select("Clients", {
      filterByFormula: `LOWER({Primary Contact Email}) = '${esc(email)}'`,
      maxRecords: 1,
      fields: ["Client Record ID"]
    });
    const clientId = c.records[0]?.fields?.["Client Record ID"] as string | undefined;
    if (!clientId) return NextResponse.json([]);

    // 2) Get this client's vendors (names)
    const v = await select("Vendors", {
      filterByFormula: `FIND('${clientId}', ARRAYJOIN({Client Record ID (lkp)})) > 0`,
      maxRecords: 200,
      fields: ["Vendor Name"]
    });
    const names = v.records
      .map(r => r.fields?.["Vendor Name"] as string | undefined)
      .filter(Boolean) as string[];

    if (names.length === 0) return NextResponse.json([]);

    // 3) Build a formula that matches Requests where Vendor contains any of those names
    //    (ARRAYJOIN({Vendor}) returns the linked display names; we use FIND() on each)
    const ors = names.map(n => `FIND('${esc(n)}', ARRAYJOIN({Vendor})) > 0`);
    const formula = ors.length === 1 ? ors[0] : `OR(${ors.join(",")})`;

    // 4) Fetch Requests
    const r = await select("Requests", {
      filterByFormula: formula,
      maxRecords: 300,
      cellFormat: "string",
      fields: ["Sent At", "Vendor", "Template Used", "Outcome", "Resolved At"],
      sort: [{ field: "Sent At", direction: "desc" }]
    });

    return NextResponse.json(r.records.map(x => ({ id: x.id, ...x.fields })));
  } catch (e) {
    console.error("requests api error", e);
    return NextResponse.json([]);
  }
}

