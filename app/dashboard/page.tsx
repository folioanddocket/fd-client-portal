import { headers } from "next/headers";

function getOrigin() {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function fetchJSON(path: string) {
  const r = await fetch(`${getOrigin()}${path}`, { cache: "no-store" });
  if (!r.ok) return path === "/api/client" ? { uploadLink: null } : [];
  return r.json();
}

export default async function Dashboard() {
  const vendors = await fetchJSON("/api/vendors");
  const { uploadLink } = await fetchJSON("/api/client");

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
