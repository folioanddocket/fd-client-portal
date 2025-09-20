export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { select } from "../../../lib/airtable";

function esc(s: string) { return String(s ?? "").replace(/'/g, "''"); }

export async function GET(_req: NextRequest) {
  try {
    const user = await currentUser();
    const email =
      user?.primaryEmailAddress?.emailAddress?.toLowerCase().trim() ||
      user?.emailAddresses?.[0]?.emailAddress?.toLowerCase().trim() ||
      "";
    if (!email) return NextResponse.json({ uploadLink: null }, { status: 401 });

    const r = await select("Clients", {
      filterByFormula: `LOWER({Primary Contact Email}) = '${esc(email)}'`,
      maxRecords: 1,
      fields: ["Upload Link (URL)"],
    });
    const url = r.records[0]?.fields?.["Upload Link (URL)"] as string | undefined;
    return NextResponse.json({ uploadLink: url ?? null });
  } catch (e) {
    console.error("client api error", e);
    return NextResponse.json({ uploadLink: null });
  }
}
