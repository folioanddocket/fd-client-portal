'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useMemo, useState } from 'react';

type Row = Record<string, any>;

export default function Dashboard() {
  const { isSignedIn } = useUser();
  const [vendors, setVendors] = useState<Row[]>([]);
  const [uploadLink, setUploadLink] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) { setVendors([]); setUploadLink(null); return; }
    (async () => {
      try {
        const [vRes, cRes] = await Promise.all([
          fetch('/api/vendors', { cache: 'no-store' }),
          fetch('/api/client',  { cache: 'no-store' }),
        ]);
        const v = await vRes.json();
        const c = await cRes.json();
        setVendors(Array.isArray(v) ? v : []);
        setUploadLink(c?.uploadLink ?? null);
      } catch { setVendors([]); setUploadLink(null); }
    })();
  }, [isSignedIn]);

  const stats = useMemo(() => {
    const red = vendors.filter(v => v['Status (auto)'] === 'Red - Missing').length;
    const flagged = vendors.filter(v => v['Status (auto)'] === 'Flagged').length;
    const exp = vendors.filter(v => v['Status (auto)'] === 'Yellow - Expiring').length;
    const green = vendors.filter(v => v['Status (auto)'] === 'Green').length;
    return { red, flagged, exp, green };
  }, [vendors]);

  if (!isSignedIn) {
    return (
      <>
        <h2 className="page-title">Top vendors to address</h2>
        <div className="card empty">Please sign in to view your vendors.</div>
      </>
    );
  }

  const statusChip = (s: string) => {
    if (s === 'Red - Missing') return <span className="chip red">{s}</span>;
    if (s === 'Yellow - Expiring') return <span className="chip amber">{s}</span>;
    if (s === 'Green') return <span className="chip green">{s}</span>;
    return <span className="chip gray">{s || '—'}</span>;
    };

  return (
    <>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h2 className="page-title">Client Summary</h2>
        {uploadLink ? <a className="btn btn-primary" href={uploadLink}>Add Vendor</a> : null}
      </div>

      <div className="stats">
        <div className="stat"><div className="stat-label">Red - Missing</div><div className="stat-value">{stats.red}</div></div>
        <div className="stat"><div className="stat-label">Flagged</div><div className="stat-value">{stats.flagged}</div></div>
        <div className="stat"><div className="stat-label">Yellow - Expiring</div><div className="stat-value">{stats.exp}</div></div>
        <div className="stat"><div className="stat-label">Green</div><div className="stat-value">{stats.green}</div></div>
      </div>

      <div className="card table-card">
        <div className="table-head">Top vendors to address</div>
        {vendors.length === 0 ? (
          <div className="empty">No vendors to display.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Vendor</th><th>Status</th><th>Missing</th><th>Flagged</th><th>Expiring</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v:any)=>(
                <tr key={v.id}>
                  <td>{v['Vendor Name']}</td>
                  <td>{statusChip(v['Status (auto)'])}</td>
                  <td>{v['Docs - Missing Count'] ?? 0}</td>
                  <td>{v['Docs - Flagged Count'] ?? 0}</td>
                  <td>{v['Docs - Expiring Count'] ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
