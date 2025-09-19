import { NextResponse } from "next/server";
import { select } from "../../../lib/airtable";
import { getClientRecordId } from "../../../lib/auth";

export async function GET() {
  try {
    const clientId = await getClientRecordId();
    if (!clientId) return NextResponse.json([]); // not mapped yet → empty list, no crash

    const r = await select("Vendors", {
      filterByFormula: `{Client Record ID (lkp)} = '${clientId}'`,
      maxRecords: 200,
      fields: [
        "Vendor Name",
        "Status (auto)",
        "Docs - Missing Count",
        "Docs - Flagged Count",
        "Docs - Expiring Count",
        "Severity Score"
      ],
      sort: [{ field: "Severity Score", direction: "desc" }]
    });

    return NextResponse.json(r.records.map(x => ({ id: x.id, ...x.fields })));
  } catch (err) {
    console.error("vendors route error", err);
    return NextResponse.json([]); // degrade gracefully
  }
}
