import Link from "next/link";

export default function IntegrationPage() {
  return (
    <main className="integration-page">
      <p className="order-sub">
        <Link href="/?role=admissions&surface=desktop">Back to the app</Link>
      </p>
      <h1 className="patient-title">How DME sits beside BetterRX</h1>
      <p>
        This page is a weekend note for judges. It is not a product screen and
        there is no live EMR in this build.
      </p>
      <p>
        BetterRX already receives hospice ADT. Eleanor Bishop&apos;s Patient
        and Medication tabs are the FAQ eRx payload. This app adds equipment
        beside those same patient identifiers. It does not write back to
        pharmacy.
      </p>
      <ol className="trail">
        <li className="trail-step trail-step--done">
          <span>In. newOrUpdatePatient</span>
          <span>Demographics, ICD-10, allergies. No SSN.</span>
        </li>
        <li className="trail-step trail-step--done">
          <span>In. newMedications</span>
          <span>NDC, SIG, prescriber NPI. Already filled by BetterRX.</span>
        </li>
        <li className="trail-step trail-step--done">
          <span>Out. DME status</span>
          <span>Keyed by the same patient id. Confirm, deliver, pickup.</span>
        </li>
      </ol>
      <p>
        HCHB is the named partner-layer story. Axxess and MatrixCare are
        advertised BetterRX pharmacy connections, not open APIs we call this
        weekend. Paperwork does not block a STAT bed.
      </p>
    </main>
  );
}
