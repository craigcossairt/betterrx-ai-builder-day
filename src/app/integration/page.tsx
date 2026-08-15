import Link from "next/link";
import { pitchPacket } from "@/project/pitch";

export default function IntegrationPage() {
  const { ai, differentiation, integration } = pitchPacket;
  return (
    <main className="integration-page">
      <p className="order-sub">
        <Link href="/?role=admissions&surface=desktop">Back to the app</Link>
      </p>
      <h1 className="patient-title">Pitch packet</h1>
      <p className="order-sub">
        Three brief deliverables. The board is the product. This page is the
        paper.
      </p>

      <h2 className="patient-title">AI skip</h2>
      <p>
        Cost ${ai.costUsdPerOrder.toFixed(2)} per order. No model runs.
      </p>
      <p>Baseline. {ai.baseline}</p>
      <p>{ai.whySkip}</p>
      <p>{ai.safety}</p>

      <h2 className="patient-title">Differentiation</h2>
      <p>Today. {differentiation.today}</p>
      <p>This board. {differentiation.us}</p>

      <h2 className="patient-title">Integration sketch</h2>
      <p>
        No live EMR this weekend. BetterRX already receives ADT. DME sits
        beside the same patient identifiers. Primary EMR story is{" "}
        {integration.emr}.
      </p>
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
        Axxess is a partner connection, not an assumed open API. MatrixCare has
        a bi-directional DME interface in the EHR. Paperwork does not block a
        STAT bed.
      </p>
    </main>
  );
}
