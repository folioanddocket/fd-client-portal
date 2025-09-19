import { currentUser } from "@clerk/nextjs/server";
import { select } from "../lib/airtable";

/**
 * Return the Airtable Clients record ID for the logged-in user (or null).
 * Uses Clerk.currentUser() (no middleware required) and matches by email:
 * Clients → Primary Contact Email (case-insensitive).
 */
export async function getClientRecordId(): Promise<string | null> {
  try {
    const user = await currentUser();
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
