'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

type Row = Record<string, any>;

export default function Requests() {
  const { isSignedIn } = useUser();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!isSignedIn) { setRows([]); return; }
    (async () => {
      try {
        const r = await fetch('/api/requests', { cache:'no-store' });
        const json = await r.json();
        setRows(Array.isArray(json) ? json : []);
      } catch { setRows([]); }
    })();
  }, [isSignedIn]);

  if (!isSignedIn) {
    return <>
      <h2 className="page-title">Client Requests</h2>
      <div className="card empty">Please sign in to view your requests.</div>
    </>;
  }

  return (
    <>
      <h2 className="page-title">Client Requests</h2>
      <div className="card table-card">
        <div className="table-head">Email history</div>
        {rows.length === 0 ? (
          <div className="empty">No requests to display.</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Sent At</th><th>Vendor</th><th>Template</th><th>Outcome</th><th>Resolved</th></tr>
            </thead>
            <tbody>
              {rows.map((r:any)=>(
                <tr key={r.id}>
                  <td>{r['Sent At'] ?? '—'}</td>
                  <td>{Array.isArray(r['Vendor']) ? r['Vendor'][0] : (r['Vendor'] ?? '—')}</td>
                  <td>{r['Template Used'] ?? '—'}</td>
                  <td>{r['Outcome'] ?? '—'}</td>
                  <td>{r['Resolved At'] ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
