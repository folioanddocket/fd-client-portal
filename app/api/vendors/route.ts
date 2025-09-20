export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { select } from "../../../lib/airtable";

export async function GET(_req: NextRequest) {
  try {
    const user = await currentUser();
    const email =
      user?.primaryEmailAddress?.emailAddress?.toLowerCase().trim() ||
      user?.emailAddresses?.[0]?.emailAddress?.toLowerCase().trim() ||
      "";
    if (!email) return NextResponse.json([], { status: 401 });

    // 1) Find client by email
    const c = await select("Clients", {
      filterByFormula: `LOWER({Primary Contact Email}) = '${email}'`,
      maxRecords: 1,
      fields: ["Client Record ID"],
    });
    const clientId = c.records[0]?.fields?.["Client Record ID"] as string | undefined;
    if (!clientId) return NextResponse.json([]);

    // 2) Vendors for this client
    const v = await select("Vendors", {
      filterByFormula: `FIND('${clientId}', ARRAYJOIN({Client Record ID (lkp)})) > 0`,
      maxRecords: 200,
      fields: [
        "Vendor Name",
        "Status (auto)",
        "Docs - Missing Count",
        "Docs - Flagged Count",
        "Docs - Expiring Count",
        "Severity Score",
      ],
      sort: [{ field: "Severity Score", direction: "desc" }],
    });

    return NextResponse.json(v.records.map(r => ({ id: r.id, ...r.fields })));
  } catch (e) {
    console.error("vendors api error", e);
    return NextResponse.json([]);
  }
}
