export default function PrivacyPage() {
  return (
    <article style={{ lineHeight: 1.65, maxWidth: 900 }}>
      <h1>Privacy Policy</h1>
      <p><em>Effective date: September 20, 2025</em></p>
      <p>This Privacy Policy explains how Folio &amp; Docket (“we”, “us”, “our”) collects, uses, and shares information when you use our portal and services.</p>

      <h2>1) Scope</h2>
      <p>This Policy covers client &amp; vendor data processed to run the vendor-compliance desk (W-9, COI, Licenses) and portal usage data.</p>

      <h2>2) Data we collect</h2>
      <ul>
        <li><strong>Account &amp; contact:</strong> Client name, emails, sign-in identifiers (via Clerk).</li>
        <li><strong>Vendor data:</strong> Vendor names, emails, W-9, COI, Licenses, expiration dates, and related metadata you provide.</li>
        <li><strong>Requests log:</strong> Email stage (Initial/Nudge/Final/30/14/7), timestamps, outcomes.</li>
        <li><strong>Technical:</strong> Log and diagnostic data typical of hosted apps (IP, headers).</li>
      </ul>

      <h2>3) Sources</h2>
      <p>You and your vendors (via forms), your client records, and portal interactions.</p>

      <h2>4) How we use data</h2>
      <ul>
        <li>Provide and improve the service (store records, send emails, show portal data).</li>
        <li>Communicate about the service and support.</li>
        <li>Maintain security, prevent abuse, and meet legal obligations.</li>
      </ul>

      <h2>5) Sharing</h2>
      <p>We share data with processors needed to run the service: Airtable, Google Workspace (Gmail), Clerk, and Vercel. We do not sell personal information. We may disclose when required by law or to protect rights and safety.</p>

      <h2>6) Security</h2>
      <p>We apply reasonable safeguards and rely on the security controls of our providers. No method of transmission or storage is 100% secure.</p>

      <h2>7) Retention</h2>
      <p>Defaults: Intake “Filed” ≥30 days and Requests with Outcome ≠ “Awaiting” ≥180 days are deleted automatically; vendor documents persist until you remove them or ask us to delete them.</p>

      <h2>8) Your choices &amp; rights</h2>
      <ul>
        <li>Access, correct, or delete data by contacting us or using available product controls.</li>
        <li>Opt out of non-essential communications where offered.</li>
        <li>California (CPRA): we do not sell or share personal information in the ad-tech sense; you may request access or deletion via the contact below.</li>
      </ul>

      <h2>9) Children</h2>
      <p>The service is not for children under 16 and we do not knowingly collect their data.</p>

      <h2>10) International transfers</h2>
      <p>Data may be processed in the United States; by using the service you consent to such processing.</p>

      <h2>11) Changes</h2>
      <p>We may update this Policy; we will post the new effective date. Continued use means acceptance.</p>

      <h2>12) Contact</h2>
      <p>Questions or requests: <a href="mailto:privacy@folioanddocket.com">privacy@yourdomain.com</a>.</p>
    </article>
  );
}
