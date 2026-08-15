import type { Instant } from "@/domain/clock";
import { dischargeReady } from "@/domain/discharge";
import { asPatientId, type Order } from "@/domain/order";
import { lookupChart } from "@/parse/erx-payloads";
import { projectCensus } from "@/project/census";
import { projectChartView } from "@/project/chart-view";
import { projectMedFills } from "@/project/med-fill";
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
  const view = projectChartView(chart);
  const fills = projectMedFills(chart.medications);
  const mine = orders.filter((order) => order.patientId === id);
  const census = projectCensus(mine, now);
  const dmeTotal = mine.reduce(
    (sum, order) => sum + (RATES[order.equipment[0].hcpcs] ?? 0),
    0,
  );
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
          <h1 className="patient-title">{view.displayName}</h1>
          <p className="order-sub">{view.subtitle}</p>
          <span
            className={
              view.source === "erx" ? "source-chip source-chip--erx" : "source-chip"
            }
          >
            {view.sourceLabel}
          </span>
        </div>
        {dmeTotal > 0 ? (
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
                  : "Supplies"}
          </a>
        ))}
      </div>
      {tab === "patient" ? (
        <div className="chart-card">
          <div
            className={
              "value" in view.allergy ? "allergy-row" : "allergy-row allergy-row--none"
            }
          >
            <span className="chart-label">Allergy</span>
            <span className="allergy-value">
              {"value" in view.allergy ? view.allergy.value : "None recorded"}
            </span>
          </div>
          <div className="chart-grid">
            <div>
              <span className="chart-label">Date of birth</span>
              <span className="chart-value">{view.dob || "Not on file"}</span>
            </div>
            <div>
              <span className="chart-label">Gender</span>
              <span className="chart-value">{view.gender || "Not on file"}</span>
            </div>
            <div className="chart-grid-wide">
              <span className="chart-label">Phone</span>
              <span className="chart-value chart-value--phone">
                {view.phone || "Not on file"}
              </span>
            </div>
            <div className="chart-grid-wide">
              <span className="chart-label">Address</span>
              <span className="chart-value">{view.address.line}</span>
              <span className="order-sub">{view.address.note}</span>
            </div>
            <div className="chart-grid-wide">
              <span className="chart-label">Primary ICD-10</span>
              <span className="chart-value">
                {view.primaryIcd
                  ? `${view.primaryIcd.code} · ${view.primaryIcd.title}`
                  : "None on file"}
              </span>
            </div>
          </div>
          {view.household ? (
            <div className="household-card">
              <div className="household-top">
                <span className="chart-label">Household contact</span>
                <span className="source-chip">Hospice fixture</span>
              </div>
              <span className="chart-value">{view.household.name}</span>
              <span className="order-sub">{view.household.note}</span>
            </div>
          ) : null}
          <p className="ssn-note">
            No SSN. It is not in the eRx event and this app never asks for one.
          </p>
        </div>
      ) : null}
      {tab === "medication" ? (
        fills.length === 0 ? (
          <div className="pic-card muted">
            No medication events on file. BetterRX pharmacy still owns eRx.
          </div>
        ) : (
          <div className="dme-rows">
            {fills.map((fill) => (
              <div key={fill.finePrint} className="fill-card">
                <div className="fill-bar">Filled by BetterRX pharmacy</div>
                <div className="fill-body">
                  <div className="fill-name">{fill.name}</div>
                  {fill.sigs.map((sig) => (
                    <div key={sig.text} className="sig-row">
                      <span
                        className={
                          sig.label === "Severe"
                            ? "sig-label sig-label--severe"
                            : "sig-label"
                        }
                      >
                        {sig.label}
                      </span>
                      <span className="sig-text">{sig.text}</span>
                    </div>
                  ))}
                  <p className="fill-fine">{fill.finePrint}</p>
                </div>
              </div>
            ))}
            {mine.length > 0 ? (
              <a
                className="equip-door"
                href={boardHref({
                  role,
                  surface,
                  patient: chart.patientId,
                  tab: "dme",
                })}
              >
                <span>
                  <span className="chart-label">Equipment</span>
                  <span className="chart-value">
                    {mine
                      .map((order) =>
                        order.equipment.map((item) => item.name).join(", "),
                      )
                      .join(" · ")}
                  </span>
                  <span className="order-sub">
                    Ordered here, delivered by a vendor. Medication stays in
                    BetterRX pharmacy.
                  </span>
                </span>
                <span aria-hidden="true">›</span>
              </a>
            ) : null}
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
        <div className="supply-empty">
          <p className="supply-lead">No supplies ordered.</p>
          <ul className="supply-cats">
            <li>Wound care</li>
            <li>Incontinence</li>
            <li>Gloves</li>
          </ul>
          <p className="order-sub">
            Supplies are consumables. They are delivered and confirmed like
            equipment, but they are never picked up, including after a death.
          </p>
          <a
            className="supply-order"
            href={boardHref({ role, surface, panel: "order" })}
          >
            Order supplies
          </a>
          <p className="ssn-note">
            Ordered by description. No HCPCS code is assigned in this build.
          </p>
        </div>
      ) : null}
    </section>
  );
}
