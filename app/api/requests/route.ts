import { NextResponse } from "next/server";
import { select } from "../../../lib/airtable";
import { getClientRecordId } from "../../../lib/auth";

export async function GET() {
  try {
    const clientId = await getClientRecordId();
    if (!clientId) return NextResponse.json([]);

    const r = await select("Requests", {
      filterByFormula: `{Client Record ID (lkp)} = '${clientId}'`,
      maxRecords: 300,
      cellFormat: "string",
      fields: ["Sent At", "Vendor", "Template Used", "Outcome", "Resolved At"],
      sort: [{ field: "Sent At", direction: "desc" }]
    });

    return NextResponse.json(r.records.map(x => ({ id: x.id, ...x.fields })));
  } catch (err) {
    console.error("requests route error", err);
    return NextResponse.json([]);
  }
}
