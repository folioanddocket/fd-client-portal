// server-only helper to read Airtable with correct query param shapes
const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AT_KEY  = process.env.AIRTABLE_PAT!;
const API     = `https://api.airtable.com/v0/${BASE_ID}`;

type SortSpec = { field: string; direction?: "asc" | "desc" };

export async function select(table: string, opts: {
  filterByFormula?: string;
  maxRecords?: number | string;
  pageSize?: number | string;
  cellFormat?: "json" | "string";
  fields?: string[];
  sort?: SortSpec[];
}) {
  const qs = new URLSearchParams();

  if (opts.filterByFormula) qs.set("filterByFormula", opts.filterByFormula);
  if (opts.maxRecords)      qs.set("maxRecords", String(opts.maxRecords));
  if (opts.pageSize)        qs.set("pageSize", String(opts.pageSize));
  if (opts.cellFormat)      qs.set("cellFormat", opts.cellFormat);

  if (opts.fields && opts.fields.length) {
    for (const f of opts.fields) qs.append("fields[]", f);
  }
  if (opts.sort && opts.sort.length) {
    opts.sort.forEach((s, i) => {
      qs.append(`sort[${i}][field]`, s.field);
      if (s.direction) qs.append(`sort[${i}][direction]`, s.direction);
    });
  }

  const res = await fetch(`${API}/${encodeURIComponent(table)}?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${AT_KEY}` },
    // No cache so client sees latest
    cache: "no-store"
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // Log details to Vercel function logs for debugging but don't expose publicly
    console.error("Airtable error", res.status, text);
    throw new Error(`Airtable ${table} ${res.status}`);
  }
  return res.json() as Promise<{ records: Array<{ id: string; fields: any }> }>;
}
