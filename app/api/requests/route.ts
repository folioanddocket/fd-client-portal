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

    const r = await select("Requests", {
      filterByFormula: `FIND('${clientId}', ARRAYJOIN({Client Record ID (lkp)})) > 0`,
      maxRecords: 300,
      cellFormat: "string",
      fields: ["Sent At","Vendor","Template Used","Outcome","Resolved At"],
      sort: [{ field: "Sent At", direction: "desc" }]
    });

    return NextResponse.json(r.records.map(x => ({ id: x.id, ...x.fields })));
  } catch (e) {
    console.error("requests api error", e);
    return NextResponse.json([]);
  }
}
