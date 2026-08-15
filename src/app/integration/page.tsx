import Link from "next/link";
import { pitchPacket } from "@/project/pitch";

export default function IntegrationPage() {
  const { ai, differentiation, integration, scenarios, flow, assumptions } =
    pitchPacket;
  return (
    <main className="integration-page">
      <p className="order-sub">
        <Link href="/?role=admissions">Back to the board</Link>
      </p>
      <h1 className="patient-title">How it connects</h1>
      <p>
        Five-minute paper for judges. The board is the product. This page is
        the three brief deliverables plus the three required taps.
      </p>

      <h2 className="patient-title">Three taps</h2>
      <ol className="pitch-scenarios">
        {scenarios.map((row) => (
          <li key={row.id}>
            <a href={row.href}>
              <b>{row.title}</b>
              <span className="order-sub">{row.who}</span>
              <span>{row.tap}</span>
            </a>
          </li>
        ))}
      </ol>

      <h2 className="patient-title">AI skip</h2>
      <p>Cost ${ai.costUsdPerOrder.toFixed(2)} per order. No model runs.</p>
      <p>Baseline. {ai.baseline}</p>
      <p>{ai.whySkip}</p>
      <p>{ai.safety}</p>

      <h2 className="patient-title">Differentiation</h2>
      <p>Today. {differentiation.today}</p>
      <p>This board. {differentiation.us}</p>
      <p>
        That matters to the hospice because the nurse sees the same status the
        vendor just confirmed, and pickup starts from the bedside instead of
        another phone tree.
      </p>

      <h2 className="patient-title">Integration sketch</h2>
      <p>
        No live EMR this weekend. BetterRX already receives hospice ADT.
        Eleanor Bishop&apos;s Patient and Medication tabs are the FAQ eRx
        payload. This app adds equipment beside those same patient identifiers.
        It does not write back to pharmacy. Primary EMR story is{" "}
        {integration.emr}.
      </p>
      <ol className="pitch-flow">
        {flow.map((step) => (
          <li key={step.title}>
            <b>{step.title}</b>
            <span>{step.detail}</span>
          </li>
        ))}
      </ol>
      <p>{integration.wellsky}</p>
      <p className="order-sub">
        HCHB is the named partner-layer story. Axxess is a partner connection,
        not an assumed open API. MatrixCare has a bi-directional DME interface
        in the EHR. Paperwork does not block a STAT bed.
      </p>

      <h2 className="patient-title">Labeled assumptions</h2>
      <ul className="pitch-assumptions">
        {assumptions.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </main>
  );
}
