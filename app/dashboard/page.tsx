async function fetchJSON(path: string) {
  const r = await fetch(path, { cache: "no-store" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function AddVendorButton() {
  const r = await fetch("/api/client", { cache: "no-store" });
  if (!r.ok) return null;
  const { uploadLink } = await r.json();
  if (!uploadLink) return null;
  return <a href={uploadLink} className="badge">Add Vendor</a>;
}

export default async function Dashboard() {
  const vendors = await fetchJSON("/api/vendors");
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{margin:0}}>Top vendors to address</h2>
        {await AddVendorButton()}
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
        </tbody>
      </table>
    </div>
  );
}
