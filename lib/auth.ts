import { currentUser } from "@clerk/nextjs/server";
import { select } from "../lib/airtable";

/**
 * Returns the Airtable Clients record ID for the logged-in user.
 * Strategy:
 *   - Read the signed-in user via Clerk server SDK (no middleware required)
 *   - Use their primary email to look up Clients by Primary Contact Email (case-insensitive)
 * If no user / no match, return null (pages will render with empty tables, not crash).
 */
export async function getClientRecordId(): Promise<string | null> {
  try {
    const user = await currentUser();         // <-- no middleware required
    if (!user) return null;

    const primary =
      (user as any)?.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      "";
    const email = primary.trim().toLowerCase();
    if (!email) return null;

    const r = await select("Clients", {
      filterByFormula: `LOWER({Primary Contact Email}) = '${email}'`,
      maxRecords: 1,
      fields: ["Client Record ID"]
    });

    const id = r.records[0]?.fields?.["Client Record ID"] as string | undefined;
    return id?.startsWith("rec") ? id : null;
  } catch (err) {
    console.error("getClientRecordId error", err);
    return null;
  }
}
