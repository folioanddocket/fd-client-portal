export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { select } from "../../../lib/airtable";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
    if (!email) return NextResponse.json({ uploadLink: null });

    const r = await select("Clients", {
      filterByFormula: `LOWER({Primary Contact Email}) = '${email}'`,
      maxRecords: 1,
      fields: ["Upload Link (URL)"]
    });

    const url = r.records[0]?.fields?.["Upload Link (URL)"] as string | undefined;
    return NextResponse.json({ uploadLink: url ?? null });
  } catch (e) {
    console.error("client api error", e);
    return NextResponse.json({ uploadLink: null });
  }
}
