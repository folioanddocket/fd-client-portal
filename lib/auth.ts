import { currentUser } from "@clerk/nextjs/server";
import { select } from "../lib/airtable";

/**
 * Returns the Airtable Clients record ID for the logged-in user.
 * Priority:
 *   1) (optional) Clerk public metadata clientRecordId, if present
 *   2) Match by email: Clients → Primary Contact Email (case-insensitive)
 * If nothing matches, returns null (APIs will respond with empty data).
 */
export async function getClientRecordId(): Promise<string | null> {
  const user = await currentUser();
  if (!user) return null;

  // 1) If you ever set metadata later, we still respect it.
  const metaId =
    (user.publicMetadata as any)?.clientRecordId as string | undefined;
  if (metaId && metaId.startsWith("rec")) return metaId;

  // 2) Fallback: match by email against Clients.Primary Contact Email
  // Clerk can store multiple emails; use the primary, fallback to first.
  const primary =
    (user as any)?.primaryEmailAddress?.emailAddress as string | undefined;
  const fallback = user.emailAddresses?.[0]?.emailAddress as
    | string
    | undefined;
  const email = (primary || fallback || "").trim().toLowerCase();
  if (!email) return null;

  // Case-insensitive match in Airtable
  const filter = `LOWER({Primary Contact Email}) = '${email}'`;

  try {
    const r = await select("Clients", {
      filterByFormula: filter,
      maxRecords: 1,
      fields: ["Client Record ID"],
    });
    const rec = r.records[0];
    const id = rec?.fields?.["Client Record ID"] as string | undefined;
    return id?.startsWith("rec") ? id : null;
  } catch (e) {
    console.error("client email lookup failed", e);
    return null;
  }
}
