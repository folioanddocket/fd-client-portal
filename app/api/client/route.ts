import { NextResponse } from "next/server";
import { select } from "@/lib/airtable";
import { getClientRecordId } from "@/lib/auth";

export async function GET() {
  const clientId = await getClientRecordId();
  const r = await select("Clients", {
    filterByFormula: `RECORD_ID() = '${clientId}'`,
    maxRecords: "1",
    fields: ["Upload Link (URL)"].join(",")
  });
  const url = r.records[0]?.fields["Upload Link (URL)"] as string | undefined;
  return NextResponse.json({ uploadLink: url ?? null });
}
