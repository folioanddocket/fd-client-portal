export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { select } from "../../../lib/airtable";

function esc(s: string) { return String(s ?? "").replace(/'/g, "''"); }

async function getClientIdByEmail(email: string): Promise<string | null> {
  try {
    const c = await select("Clients", {
      filterByFormula: `LOWER({Primary Contact Email}) = '${esc(email)}'`,
      maxRecords: 1,
      fields: ["Client Record ID"]
    });
    const id = c.records[0]?.fields?.["Client Record ID"] as string | undefined;
    if (id) return id;
  } catch {}
  try {
    const c2 = await select("Clients", {
      filterByFormula: `FIND('${esc(email)}', LOWER(SUBSTITUTE({Portal Login Emails}," ",""))) > 0`,
      maxRecords: 1,
      fields: ["Client Record ID"]
    });
    const id2 = c2.records[0]?.fields?.["Client Record ID"] as string | undefined;
    if (id2) return id2;
  } catch {}
  return null;
}

export async function GET(_req: NextRequest) {
  try {
    const user = await currentUser();
    const email =
      user?.primaryEmailAddress?.emailAddress?.toLowerCase().trim() ||
      user?.emailAddresses?.[0]?.emailAddress?.toLowerCase().trim() ||
      "";
    if (!email) return NextResponse.json([], { status: 401 });

    const clientId = await getClientIdByEmail(email);
    if (!clientId) return NextResponse.json([]);

    const v = await select("Vendors", {
      filterByFormula: `FIND('${clientId}', ARRAYJOIN({Client Record ID (lkp)})) > 0`,
      maxRecords: 200,
      fields: [
        "Vendor Name","Status (auto)",
        "Docs - Missing Count","Docs - Flagged Count","Docs - Expiring Count",
        "Severity Score"
      ],
      sort: [{ field: "Severity Score", direction: "desc" }]
    });

    return NextResponse.json(v.records.map(r => ({ id: r.id, ...r.fields })));
  } catch (e) {
    console.error("vendors api error", e);
    return NextResponse.json([]);
  }
}
