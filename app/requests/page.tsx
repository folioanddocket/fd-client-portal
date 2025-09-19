export const dynamic = "force-dynamic";

import { select } from "../../lib/airtable";
import { getClientRecordId } from "../../lib/auth";

export default async function Requests() {
  const clientId = await getClientRecordId();

  let rows: any[] = [];
  if (clientId) {
    try {
      // ✅ FIND over ARRAYJOIN of the Lookup
      const r = await select("Requests", {
        filterByFormula: `FIND('${clientId}', ARRAYJOIN({Client Record ID (lkp)})) > 0`,
        maxRecords: 300,
        cellFormat: "string",
        fields: ["Sent At","Vendor","Template Used","Outcome","Resolved At"],
        sort: [{ field: "Sent At", direction: "desc" }]
      });
      rows = r.records.map(x => ({ id: x.id, ...x.fields }));
    } catch (e) {
      console.error("requests data error", e);
    }
  }

  return (
    <div>
      <h2>Client Requests</h2>
      <table>
        <thead>
          <tr><th>Sent At</th><th>Vendor</th><th>Template</th><th>Outcome</th><th>Resolved</th></tr>
        </thead>
        <tbody>
          {rows.map((r:any)=>(
            <tr key={r.id}>
              <td>{r["Sent At"] ?? "—"}</td>
              <td>{Array.isArray(r["Vendor"]) ? r["Vendor"][0] : (r["Vendor"] ?? "—")}</td>
              <td>{r["Template Used"] ?? "—"}</td>
              <td>{r["Outcome"] ?? "—"}</td>
              <td>{r["Resolved At"] ?? "—"}</td>
            </tr>
          ))}
          {(!rows || rows.length === 0) && (
            <tr><td colSpan={5}>No requests to display.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
