export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { select } from "../../../lib/airtable";

function esc(s: string) { return String(s ?? "").replace(/'/g, "''"); }

async function getClientIdByEmail(email: string): Promise<string | null> {
  try {
    const c = await select("Clients", {
      filterByFormula: `LOWER({Primary Contact Email}) = '${esc(email)}'`,
      maxRecords: 1,
      fields: ["Client Record ID"],
    });
    const id = c.records[0]?.fields?.["Client Record ID"] as string | undefined;
    if (id) return id;
  } catch {}
  try {
    const c2 = await select("Clients", {
      filterByFormula: `FIND('${esc(email)}', LOWER(SUBSTITUTE({Portal Login Emails}," ",""))) > 0`,
      maxRecords: 1,
      fields: ["Client Record ID"],
    });
    const id2 = c2.records[0]?.fields?.["Client Record ID"] as string | undefined;
    if (id2) return id2;
  } catch {}
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const email =
      req.headers.get("x-client-email")?.toLowerCase().trim() ?? "";
    if (!email) return NextResponse.json({ uploadLink: null }, { status: 401 });

    // Prefer direct lookup by Primary Contact Email
    let r = await select("Clients", {
      filterByFormula: `LOWER({Primary Contact Email}) = '${esc(email)}'`,
      maxRecords: 1,
      fields: ["Upload Link (URL)"],
    });

    let url = r.records[0]?.fields?.["Upload Link (URL)"] as string | undefined;

    if (!url) {
      const cid = await getClientIdByEmail(email);
      if (cid) {
        const r2 = await select("Clients", {
          filterByFormula: `RECORD_ID() = '${esc(cid)}'`,
          maxRecords: 1,
          fields: ["Upload Link (URL)"],
        });
        url = r2.records[0]?.fields?.["Upload Link (URL)"] as string | undefined;
      }
    }

    return NextResponse.json({ uploadLink: url ?? null });
  } catch (e) {
    console.error("client api error", e);
    return NextResponse.json({ uploadLink: null });
  }
}
