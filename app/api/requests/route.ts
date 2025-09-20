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
    if (!email) return NextResponse.json([], { status: 401 });

    // 1) Find client
    const c = await select("Clients", {
      filterByFormula: `LOWER({Primary Contact Email}) = '${esc(email)}'`,
      maxRecords: 1,
      fields: ["Client Record ID"],
    });
    const clientId = c.records[0]?.fields?.["Client Record ID"] as string | undefined;
    if (!clientId) return NextResponse.json([]);

    // 2) Get this client's vendor names
    const v = await select("Vendors", {
      filterByFormula: `FIND('${clientId}', ARRAYJOIN({Client Record ID (lkp)})) > 0`,
      maxRecords: 200,
      fields: ["Vendor Name"],
    });
    const names = v.records
      .map(r => r.fields?.["Vendor Name"] as string | undefined)
      .filter(Boolean) as string[];
    if (!names.length) return NextResponse.json([]);

    // 3) Build OR(FIND(name, ARRAYJOIN({Vendor}))) formula for Requests
    const ors = names.map(n => `FIND('${esc(n)}', ARRAYJOIN({Vendor})) > 0`);
    const formula = ors.length === 1 ? ors[0] : `OR(${ors.join(",")})`;

    // 4) Fetch Requests
    const r = await select("Requests", {
      filterByFormula: formula,
      maxRecords: 300,
      cellFormat: "string", // lib/airtable adds timeZone/userLocale to satisfy Airtable requirements
      fields: ["Sent At", "Vendor", "Template Used", "Outcome", "Resolved At"],
      sort: [{ field: "Sent At", direction: "desc" }],
    });

    return NextResponse.json(r.records.map(x => ({ id: x.id, ...x.fields })));
  } catch (e) {
    console.error("requests api error", e);
    return NextResponse.json([]);
  }
}
