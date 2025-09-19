import { NextResponse } from "next/server";
import { select } from "../../../lib/airtable";
import { getClientRecordId } from "../../../lib/auth";

export async function GET() {
  try {
    const clientId = await getClientRecordId();
    if (!clientId) return NextResponse.json([]);

    const r = await select("Vendor Docs", {
      filterByFormula: `{Client Record ID (lkp)} = '${clientId}'`,
      maxRecords: 500,
      cellFormat: "string", // show linked names as strings
      fields: ["Vendor", "Doc Type", "File", "Expiration Date", "Status (auto)"],
      sort: [{ field: "Expiration Date", direction: "asc" }]
    });

    return NextResponse.json(r.records.map(x => ({ id: x.id, ...x.fields })));
  } catch (err) {
    console.error("docs route error", err);
    return NextResponse.json([]);
  }
}
