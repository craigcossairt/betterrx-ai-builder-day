import Link from "next/link";
import { pitchPacket } from "@/project/pitch";

export default function IntegrationPage() {
  const { ai, differentiation, integration } = pitchPacket;
  return (
    <main className="integration-page">
      <p className="order-sub">
        <Link href="/?role=admissions&surface=desktop">Back to the app</Link>
      </p>
      <h1 className="patient-title">How it connects</h1>
      <p>
        This page is a weekend note for judges. It is not a product screen and
        there is no live EMR in this build. The board is the product. This page
        is the paper.
      </p>
      <p>
        BetterRX already receives hospice ADT. Eleanor Bishop&apos;s Patient
        and Medication tabs are the FAQ eRx payload. This app adds equipment
        beside those same patient identifiers. It does not write back to
        pharmacy. Primary EMR story is {integration.emr}.
      </p>

      <h2 className="patient-title">AI skip</h2>
      <p>Cost ${ai.costUsdPerOrder.toFixed(2)} per order. No model runs.</p>
      <p>Baseline. {ai.baseline}</p>
      <p>{ai.whySkip}</p>
      <p>{ai.safety}</p>

      <h2 className="patient-title">Differentiation</h2>
      <p>Today. {differentiation.today}</p>
      <p>This board. {differentiation.us}</p>

      <h2 className="patient-title">Integration sketch</h2>
      <pre className="pitch-diagram">{integration.diagram}</pre>
      <ol className="trail">
        {integration.inn.map((line) => (
          <li key={line} className="trail-step trail-step--done">
            <span>In</span>
            <span>{line}</span>
          </li>
        ))}
        <li className="trail-step trail-step--done">
          <span>Out</span>
          <span>{integration.out}</span>
        </li>
      </ol>
      <p>{integration.wellsky}</p>
      <p className="order-sub">
        HCHB is the named partner-layer story. Axxess is a partner connection,
        not an assumed open API. MatrixCare has a bi-directional DME interface
        in the EHR. Paperwork does not block a STAT bed.
      </p>
    </main>
  );
}
