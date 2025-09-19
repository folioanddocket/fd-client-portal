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

    const v = await select("Vendors", {
      filterByFormula: `FIND('${clientId}', ARRAYJOIN({Client Record ID (lkp)})) > 0`,
      maxRecords: 200,
      fields: [
        "Vendor Name","Status (auto)",
        "Docs - Missing Count","Docs - Flagged Count","Docs - Expiring Count",
        "Severity Score"
      ],
      sort: [{ field: "Severity Score", direction: "desc" }]
    });

    return NextResponse.json(v.records.map(r => ({ id: r.id, ...r.fields })));
  } catch (e) {
    console.error("vendors api error", e);
    return NextResponse.json([]);
  }
}
