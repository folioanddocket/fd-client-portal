'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

type Row = Record<string, any>;

export default function Documents() {
  const { isSignedIn, user } = useUser();
  const [rows, setRows] = useState<Row[]>([]);
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    '';

  useEffect(() => {
    if (!isSignedIn || !email) { setRows([]); return; }
    const e = encodeURIComponent(email.toLowerCase().trim());
    (async () => {
      try {
        const r = await fetch(`/api/docs?email=${e}`, { cache: 'no-store' });
        const json = await r.json();
        setRows(Array.isArray(json) ? json : []);
      } catch { setRows([]); }
    })();
  }, [isSignedIn, email]);

  if (!isSignedIn) return <div><h2>Client Documents</h2><p>Please sign in to view your documents.</p></div>;

  return (
    <div>
      <h2>Client Documents</h2>
      <table>
        <thead><tr><th>Vendor</th><th>Doc Type</th><th>File</th><th>Expiration</th><th>Status</th></tr></thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={5}>No documents to display.</td></tr>
          ) : rows.map((r:any)=>(
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
        </tbody>
      </table>
    </div>
  );
}
