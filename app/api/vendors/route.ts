import { NextResponse } from "next/server";
import { select } from "@/lib/airtable";
import { getClientRecordId } from "@/lib/auth";

export async function GET() {
  const clientId = await getClientRecordId();
  const filter = `{Client Record ID (lkp)} = '${clientId}'`;
  const r = await select("Vendors", {
    filterByFormula: filter,
    maxRecords: "200",
    fields: [
      "Vendor Name","Status (auto)",
      "Docs - Missing Count","Docs - Flagged Count","Docs - Expiring Count",
      "Severity Score"
    ].join(","),
    sort: "Severity Score"
  });
  return NextResponse.json(r.records.map(x => ({ id: x.id, ...x.fields })));
}
