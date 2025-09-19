import { NextResponse } from "next/server";
import { select } from "../../../lib/airtable";
import { getClientRecordId } from "../../../lib/auth";

export async function GET() {
  const clientId = await getClientRecordId();
  if (!clientId) return NextResponse.json([]); // no crash
  const filter = `{Client Record ID (lkp)} = '${clientId}'`;
  const r = await select("Vendor Docs", {
    filterByFormula: filter,
    maxRecords: "500",
    cellFormat: "string",
    fields: ["Vendor","Doc Type","File","Expiration Date","Status (auto)"].join(","),
    sort: "Expiration Date"
  });
  return NextResponse.json(r.records.map(x => ({ id: x.id, ...x.fields })));
}
