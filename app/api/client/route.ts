import { NextResponse } from "next/server";
import { select } from "../../../lib/airtable";
import { getClientRecordId } from "../../../lib/auth";

export async function GET() {
  try {
    const clientId = await getClientRecordId();
    if (!clientId) return NextResponse.json({ uploadLink: null });

    const r = await select("Clients", {
      filterByFormula: `RECORD_ID() = '${clientId}'`,
      maxRecords: 1,
      fields: ["Upload Link (URL)"]
    });

    const url = r.records[0]?.fields["Upload Link (URL)"] as string | undefined;
    return NextResponse.json({ uploadLink: url ?? null });
  } catch (err) {
    console.error("client route error", err);
    return NextResponse.json({ uploadLink: null });
  }
}
