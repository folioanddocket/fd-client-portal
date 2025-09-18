import { NextResponse } from "next/server";
import { select } from "@/lib/airtable";
import { getClientRecordId } from "@/lib/auth";

export async function GET() {
  const clientId = await getClientRecordId();
  const filter = `{Client Record ID (lkp)} = '${clientId}'`;
  const r = await select("Requests", {
    filterByFormula: filter,
    maxRecords: "300",
    cellFormat: "string",
    fields: ["Sent At","Vendor","Template Used","Outcome","Resolved At"].join(","),
    sort: "Sent At"
  });
  return NextResponse.json(r.records.map(x => ({ id: x.id, ...x.fields })));
}
