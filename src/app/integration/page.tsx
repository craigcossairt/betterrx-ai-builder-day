import Link from "next/link";

export default function IntegrationPage() {
  return (
    <main className="integration-page">
      <p className="order-sub">
        <Link href="/?role=admissions&surface=desktop">Back to the app</Link>
      </p>
      <h1 className="patient-title">Integration sketch</h1>
      <p>
        No live EMR this weekend. BetterRX already receives ADT. DME sits
        beside the same patient identifiers.
      </p>
      <ol className="trail">
        <li className="trail-step trail-step--done">
          <span>In. newOrUpdatePatient</span>
          <span>Demographics, ICD-10, allergies</span>
        </li>
        <li className="trail-step trail-step--done">
          <span>In. newMedications</span>
          <span>NDC, SIG, prescriber NPI</span>
        </li>
        <li className="trail-step trail-step--done">
          <span>Out. DME status events</span>
          <span>Keyed by patient.identifiers</span>
        </li>
      </ol>
      <p>
        HCHB is the partner-layer story. Existing DME vendors already plug in
        that way. WellSky bought DME software in 2024, so some agencies may
        already have bundled tooling.
      </p>
      <p className="order-sub">
        Axxess is a partner connection, not an assumed open API. MatrixCare has
        a bi-directional DME interface in the EHR. Paperwork does not block a
        STAT bed.
      </p>
    </main>
  );
}
