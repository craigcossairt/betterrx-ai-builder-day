import type { Instant } from "@/domain/clock";
import { dischargeReady } from "@/domain/discharge";
import { asPatientId, type Order } from "@/domain/order";
import { lookupChart } from "@/parse/erx-payloads";
import { projectCensus } from "@/project/census";
import { projectTrail } from "@/project/trail";
import { requestPickupAction } from "@/app/actions";
import { DischargeReadyForm } from "@/ui/DischargeReadyForm";
import { Button } from "@/ui/Button";
import { formatStamp } from "@/ui/format";
import { boardHref, type PatientTab, type SurfaceId } from "@/ui/nav";
import type { RoleId } from "@/ui/roles";

const RATES: Record<string, number> = {
  E0250: 2.57,
  E1390: 3.34,
  E1130: 2.0,
};

function formatAddress(address: {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
}): string {
  const line = [address.street1, address.street2].filter(Boolean).join(", ");
  const city = [address.city, address.state, address.zip]
    .filter(Boolean)
    .join(", ");
  return [line, city].filter(Boolean).join(". ");
}

export function PatientPicture({
  patientId,
  tab,
  orders,
  now,
  role,
  surface,
}: {
  patientId: string;
  tab: PatientTab;
  orders: readonly Order[];
  now: Instant;
  role: RoleId;
  surface: SurfaceId;
}) {
  const id = asPatientId(patientId);
  const chart = lookupChart(id);
  const mine = orders.filter((order) => order.patientId === id);
  const census = projectCensus(mine, now);
  const dmeTotal = mine.reduce(
    (sum, order) => sum + (RATES[order.equipment[0].hcpcs] ?? 0),
    0,
  );
  const medTotal = chart.medications.reduce(
    (sum, med) => sum + med.unitPriceUsd,
    0,
  );
  const total = medTotal + dmeTotal;
  const decision = dischargeReady(mine);
  const tabs: PatientTab[] = ["patient", "medication", "dme", "supplies"];
  const canPickup = role === "case_manager" || role === "don";

  return (
    <section className="patient-pic" aria-label={`${chart.displayName} chart`}>
      {surface === "phone" ? (
        <a className="phone-back" href={boardHref({ role, surface })}>
          All patients
        </a>
      ) : null}
      <div className="patient-pic-head">
        <div>
          <div className="patient-id">{chart.patientId}</div>
          <h1 className="patient-title">
            {chart.displayName}
            {chart.dob ? `, DOB ${chart.dob}` : ""}
          </h1>
          <p className="order-sub">
            {chart.source === "erx"
              ? "From BetterRX eRx event"
              : "Hospice fixture. Same fields as the eRx patient event."}
          </p>
        </div>
        {total > 0 ? (
          <div className="patient-total">
            <b>${dmeTotal.toFixed(2)}</b>
            <div>equipment / day</div>
          </div>
        ) : null}
      </div>
      <div className="pic-tabs" role="tablist">
        {tabs.map((item) => (
          <a
            key={item}
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? "pic-tab pic-tab--on" : "pic-tab"}
            href={boardHref({ role, surface, patient: chart.patientId, tab: item })}
          >
            {item === "patient"
              ? "Patient"
              : item === "medication"
                ? "Medication"
                : item === "dme"
                  ? `DME (${mine.length})`
                  : "Supplies (0)"}
          </a>
        ))}
      </div>
      {tab === "patient" ? (
        <dl className="chart-list">
          <div>
            <dt>Date of birth</dt>
            <dd>{chart.dob || "Not on file"}</dd>
          </div>
          <div>
            <dt>Gender</dt>
            <dd>{chart.gender || "Not on file"}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{chart.phone || "Not on file"}</dd>
          </div>
          <div>
            <dt>Medical record</dt>
            <dd>{chart.medRecNo || "Not on file"}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>{formatAddress(chart.address) || "Not on file"}</dd>
          </div>
          <div>
            <dt>Diagnoses</dt>
            <dd>
              {chart.diagnoses.length === 0
                ? "None on file"
                : chart.diagnoses
                    .map(
                      (row) =>
                        `${row.code}${row.isPrimary ? " (primary)" : ""}`,
                    )
                    .join(", ")}
            </dd>
          </div>
          <div>
            <dt>Allergies</dt>
            <dd>
              {chart.allergies.length === 0
                ? "None on file"
                : chart.allergies.join(", ")}
            </dd>
          </div>
          <div>
            <dt>Household contact</dt>
            <dd>
              {chart.householdContact ?? "None on file"}
              <span className="order-sub">
                Hospice fixture. Not on the eRx event.
              </span>
            </dd>
          </div>
        </dl>
      ) : null}
      {tab === "medication" ? (
        chart.medications.length === 0 ? (
          <div className="pic-card muted">
            No medication events on file. BetterRX pharmacy still owns eRx.
          </div>
        ) : (
          <div className="dme-rows">
            {chart.medications.map((med) => (
              <div key={med.externalId} className="pic-card">
                <div className="pic-card-top">
                  <b>{med.name}</b>
                  <b>
                    ${med.unitPriceUsd.toFixed(2)}/{med.unit}
                  </b>
                </div>
                <p className="order-sub">
                  NDC {med.ndc} · NPI {med.prescriberNpi} · {med.rateSource.toUpperCase()}
                </p>
                <p className="med-sig">{med.sig}</p>
              </div>
            ))}
          </div>
        )
      ) : null}
      {tab === "dme" ? (
        mine.length === 0 ? (
          <div className="pic-card muted">No equipment yet.</div>
        ) : (
          <div className="dme-rows">
            {census.lines.map((line) => {
              const trail = projectTrail(line.order);
              const rate = RATES[line.order.equipment[0].hcpcs];
              const delivered =
                line.order.status === "delivered" ? line.order : null;
              const pickupable =
                line.order.status === "delivered" ||
                line.order.status === "pickup_triggered" ||
                line.order.status === "pickup_delayed";
              return (
                <details key={line.order.id} className="dme-row">
                  <summary>
                    <span>
                      <b>
                        {line.order.equipment.map((item) => item.name).join(", ")}
                      </b>
                      <span className="order-sub">{line.sentence}</span>
                    </span>
                    <span className="dme-price">
                      {rate ? `$${rate.toFixed(2)}/day` : ""}
                    </span>
                  </summary>
                  {delivered?.proofOfDelivery ? (
                    <p className="order-sub">
                      Proof of delivery.
                      {delivered.proofOfDelivery.timestamp ? " Time captured." : ""}
                      {delivered.proofOfDelivery.signature
                        ? " Signature captured."
                        : ""}
                    </p>
                  ) : null}
                  <ol className="trail">
                    {trail.map((step) => (
                      <li
                        key={step.step}
                        className={
                          step.done ? "trail-step trail-step--done" : "trail-step"
                        }
                      >
                        <span>{step.label}</span>
                        <time>
                          {step.at
                            ? formatStamp(step.at)
                            : step.done
                              ? "Done"
                              : "Open"}
                        </time>
                      </li>
                    ))}
                  </ol>
                  {canPickup && pickupable ? (
                    <form action={requestPickupAction} className="loud-card-action">
                      <input type="hidden" name="orderId" value={line.order.id} />
                      <input type="hidden" name="trigger" value="nurse_request" />
                      <Button variant="app" size="sm" type="submit">
                        Request pickup
                      </Button>
                    </form>
                  ) : null}
                </details>
              );
            })}
          </div>
        )
      ) : null}
      {tab === "dme" && mine.length > 0 ? (
        <div className="discharge-banner">
          {decision.ready
            ? "Discharge-ready. Required equipment is delivered."
            : `Not discharge-ready yet. Waiting on: ${"blocking" in decision ? decision.blocking.join(", ") : ""}.`}
          <DischargeReadyForm patientId={id} />
        </div>
      ) : null}
      {tab === "supplies" ? (
        <div className="pic-card muted">
          No supplies yet. Wound care, incontinence, and gloves order like
          equipment. No pickup after a death.
        </div>
      ) : null}
    </section>
  );
}
