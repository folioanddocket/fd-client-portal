import { currentUser } from "@clerk/nextjs/server";

export async function getClientRecordId() {
  const user = await currentUser();
  const id = (user?.publicMetadata as any)?.clientRecordId as string | undefined;
  // Return null instead of throwing; APIs will handle this gracefully.
  return id ?? null;
}
