const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AT_KEY  = process.env.AIRTABLE_PAT!;
const API = `https://api.airtable.com/v0/${BASE_ID}`;

export async function select(table: string, params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/${encodeURIComponent(table)}?${qs}`, {
    headers: { Authorization: `Bearer ${AT_KEY}` },
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Airtable ${table} ${res.status}`);
  return res.json() as Promise<{ records: Array<{id:string; fields:any}> }>;
}
