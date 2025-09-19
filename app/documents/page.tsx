export const dynamic = "force-dynamic";

import { select } from "../../lib/airtable";
import { getClientRecordId } from "../../lib/auth";

export default async function Documents() {
  const clientId = await getClientRecordId();

  let rows: any[] = [];
  if (clientId) {
    try {
      // ✅ FIND over ARRAYJOIN of the Lookup
      const r = await select("Vendor Docs", {
        filterByFormula: `FIND('${clientId}', ARRAYJOIN({Client Record ID (lkp)})) > 0`,
        maxRecords: 500,
        cellFormat: "string",
        fields: ["Vendor","Doc Type","File","Expiration Date","Status (auto)"],
        sort: [{ field: "Expiration Date", direction: "asc" }]
      });
      rows = r.records.map(x => ({ id: x.id, ...x.fields }));
    } catch (e) {
      console.error("docs data error", e);
    }
  }

  return (
    <div>
      <h2>Client Documents</h2>
      <table>
        <thead>
          <tr><th>Vendor</th><th>Doc Type</th><th>File</th><th>Expiration</th><th>Status</th></tr>
        </thead>
        <tbody>
          {rows.map((r:any)=>(
            <tr key={r.id}>
              <td>{Array.isArray(r["Vendor"]) ? r["Vendor"][0] : (r["Vendor"] ?? "—")}</td>
              <td>{r["Doc Type"] ?? "—"}</td>
              <td>
                {Array.isArray(r["File"]) && r["File"].length
                  ? <a className="badge" href={r["File"][0].url} target="_blank">Download</a>
                  : "—"}
              </td>
              <td>{r["Expiration Date"] ?? "—"}</td>
              <td><span className="badge">{r["Status (auto)"] ?? ""}</span></td>
            </tr>
          ))}
          {(!rows || rows.length === 0) && (
            <tr><td colSpan={5}>No documents to display.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
