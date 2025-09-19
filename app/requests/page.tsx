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

export default async function Requests() {
  const rows = await fetchJSON("/api/requests");
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
