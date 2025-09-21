export default function TermsPage() {
  return (
    <article style={{ lineHeight: 1.65, maxWidth: 900 }}>
      <h1>Terms of Service</h1>
      <p><em>Effective date: September 20, 2025</em></p>

      <p><strong>Important:</strong> These Terms are a plain-English summary for convenience and are not legal advice. If you have questions, consult your attorney.</p>

      <h2>1) Who we are</h2>
      <p><strong>Folio &amp; Docket</strong> (“we”, “us”, “our”) provides a vendor-compliance desk and client portal that helps businesses collect and track W-9, Certificates of Insurance (COI), and Licenses from their vendors.</p>

      <h2>2) What the service does (and doesn’t)</h2>
      <ul>
        <li><strong>Does:</strong> Store client and vendor records in Airtable; send reminder emails via Gmail; provide a read-only client portal using Clerk for sign-in.</li>
        <li><strong>Does not:</strong> Provide legal, tax, or insurance advice; guarantee vendor compliance; function as a HIPAA service or sign BAAs; adjudicate document validity.</li>
      </ul>

      <h2>3) Accounts &amp; access</h2>
      <p>Portal access requires a Clerk account. You are responsible for safeguarding your credentials and for actions taken under your account.</p>

      <h2>4) Your responsibilities</h2>
      <ul>
        <li>Provide accurate contact details and only upload documents you are authorized to share.</li>
        <li>Avoid uploading protected health information (PHI) or other sensitive data not required for vendor compliance. <strong>W-9:</strong> encourage EIN over SSN where possible.</li>
        <li>Obey all applicable laws when using reminder emails and storing documents.</li>
      </ul>

      <h2>5) Email sending &amp; timing</h2>
      <p>Automated sends respect business-hour gates; manual <em>Send Now</em> buttons may send outside business hours at your direction.</p>

      <h2>6) Payments</h2>
      <p>If applicable, subscription terms (price, term) are described on your order form/invoice. Fees are non-refundable unless required by law.</p>

      <h2>7) Customer data ownership</h2>
      <p>You own your data. You grant us a limited right to process it to provide the service. We do not sell your data.</p>

      <h2>8) Third-party services</h2>
      <ul>
        <li><strong>Airtable</strong> (database storage)</li>
        <li><strong>Google Workspace (Gmail)</strong> (email)</li>
        <li><strong>Clerk</strong> (authentication)</li>
        <li><strong>Vercel</strong> (hosting)</li>
      </ul>
      <p>You consent to our use of these processors to run the service.</p>

      <h2>9) Security &amp; retention</h2>
      <p>We use reasonable safeguards and rely on the security of the providers named above. Current retention defaults: Intake “Filed” ≥30 days and Requests with Outcome ≠ “Awaiting” ≥180 days are deleted automatically; vendor documents persist until you remove them or request deletion.</p>

      <h2>10) Acceptable use</h2>
      <p>No unlawful, infringing, harassing, or abusive activity; no security testing; no reverse engineering of non-open components.</p>

      <h2>11) Warranty disclaimer</h2>
      <p>THE SERVICE IS PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND.</p>

      <h2>12) Limitation of liability</h2>
      <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, OR FOR MORE THAN THE FEES YOU PAID IN THE 3 MONTHS BEFORE THE EVENT GIVING RISE TO LIABILITY.</p>

      <h2>13) Indemnification</h2>
      <p>You will defend and hold us harmless from claims arising from your use of the service, including your emails to vendors and your uploaded content.</p>

      <h2>14) Changes</h2>
      <p>We may update these Terms; we will post the new effective date. Continued use means acceptance.</p>

      <h2>15) Governing law</h2>
      <p>California law governs. Venue: Orange County, California.</p>

      <h2>16) Contact</h2>
      <p>Questions? Email <a href="mailto:support@yourdomain.com">support@yourdomain.com</a>.</p>
    </article>
  );
}
