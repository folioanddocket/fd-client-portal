'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

type Row = Record<string, any>;

export default function Dashboard() {
  const { isSignedIn, user } = useUser();
  const [vendors, setVendors] = useState<Row[]>([]);
  const [uploadLink, setUploadLink] = useState<string | null>(null);
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    '';

  useEffect(() => {
    if (!isSignedIn || !email) {
      setVendors([]);
      setUploadLink(null);
      return;
    }
    const e = encodeURIComponent(email.toLowerCase().trim());
    (async () => {
      try {
        const [vRes, cRes] = await Promise.all([
          fetch(`/api/vendors?email=${e}`, { cache: 'no-store' }),
          fetch(`/api/client?email=${e}`, { cache: 'no-store' }),
        ]);
        const v = (await vRes.json()) as Row[];
        const c = (await cRes.json()) as { uploadLink: string | null };
        setVendors(Array.isArray(v) ? v : []);
        setUploadLink(c?.uploadLink ?? null);
      } catch {
        setVendors([]);
        setUploadLink(null);
      }
    })();
  }, [isSignedIn, email]);

  if (!isSignedIn) {
    return (
      <div>
        <h2>Top vendors to address</h2>
        <p>Please sign in to view your vendors.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
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
          {vendors.length === 0 ? (
            <tr><td colSpan={5}>No vendors to display.</td></tr>
          ) : vendors.map((v:any)=>(
            <tr key={v.id}>
              <td>{v["Vendor Name"]}</td>
              <td><span className="badge">{v["Status (auto)"]}</span></td>
              <td>{v["Docs - Missing Count"] ?? 0}</td>
              <td>{v["Docs - Flagged Count"] ?? 0}</td>
              <td>{v["Docs - Expiring Count"] ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
