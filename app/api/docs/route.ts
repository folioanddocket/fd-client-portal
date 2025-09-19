export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { select } from "../../../lib/airtable";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
    if (!email) return NextResponse.json([]);
    const c = await select("Clients", {
      filterByFormula: `LOWER({Primary Contact Email}) = '${email}'`,
      maxRecords: 1,
      fields: ["Client Record ID"]
    });
    const clientId = c.records[0]?.fields?.["Client Record ID"] as string | undefined;
    if (!clientId) return NextResponse.json([]);

    const r = await select("Vendor Docs", {
      filterByFormula: `FIND('${clientId}', ARRAYJOIN({Client Record ID (lkp)})) > 0`,
      maxRecords: 500,
      cellFormat: "string",
      fields: ["Vendor","Doc Type","File","Expiration Date","Status (auto)"],
      sort: [{ field: "Expiration Date", direction: "asc" }]
    });
    return NextResponse.json(r.records.map(x => ({ id: x.id, ...x.fields })));
  } catch (e) {
    console.error("docs api error", e);
    return NextResponse.json([]);
  }
}
