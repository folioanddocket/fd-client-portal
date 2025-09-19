import { headers } from "next/headers";

function getOrigin() {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function fetchJSON(path: string) {
  const r = await fetch(`${getOrigin()}${path}`, { cache: "no-store" });
  if (!r.ok) return [];
  return r.json();
}

export default async function Documents() {
  const rows = await fetchJSON("/api/docs");
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
