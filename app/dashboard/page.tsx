export const dynamic = "force-dynamic";

import { select } from "../../lib/airtable";
import { getClientRecordId } from "../../lib/auth";

export default async function Dashboard() {
  console.log("DBG: rendering /dashboard with direct Airtable (no /api calls)");

  const clientId = await getClientRecordId();

  let vendors: any[] = [];
  let uploadLink: string | null = null;

  if (clientId) {
    try {
      const v = await select("Vendors", {
        filterByFormula: `{Client Record ID (lkp)} = '${clientId}'`,
        maxRecords: 200,
        fields: [
          "Vendor Name",
          "Status (auto)",
          "Docs - Missing Count",
          "Docs - Flagged Count",
          "Docs - Expiring Count",
          "Severity Score"
        ],
        sort: [{ field: "Severity Score", direction: "desc" }]
      });
      vendors = v.records.map(r => ({ id: r.id, ...r.fields }));

      const c = await select("Clients", {
        filterByFormula: `RECORD_ID() = '${clientId}'`,
        maxRecords: 1,
        fields: ["Upload Link (URL)"]
      });
      uploadLink = (c.records[0]?.fields["Upload Link (URL)"] as string) ?? null;
    } catch (e) {
      console.error("dashboard data error", e);
    }
  }

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{margin:0}}>Top vendors to address</h2>
        {uploadLink ? <a href={uploadLink} className="badge">Add Vendor</a> : null}
      </div>

      <table>
        <thead>
          <tr>
            <th>Vendor</th><th>Status</th><th>Missing</th><th>Flagged</th><th>Expiring</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((v:any)=>(
            <tr key={v.id}>
              <td>{v["Vendor Name"]}</td>
              <td><span className="badge">{v["Status (auto)"]}</span></td>
              <td>{v["Docs - Missing Count"] ?? 0}</td>
              <td>{v["Docs - Flagged Count"] ?? 0}</td>
              <td>{v["Docs - Expiring Count"] ?? 0}</td>
            </tr>
          ))}
          {(!vendors || vendors.length === 0) && (
            <tr><td colSpan={5}>No vendors to display.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
