import { currentUser } from "@clerk/nextjs";

export async function getClientRecordId() {
  const user = await currentUser();
  const id = (user?.publicMetadata as any)?.clientRecordId as string | undefined;
  if (!id) throw new Error("clientRecordId missing in user publicMetadata");
  return id;
}
