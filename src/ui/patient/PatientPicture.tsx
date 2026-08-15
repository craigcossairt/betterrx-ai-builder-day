import { MEDS } from "@/domain/catalog";
import type { Instant } from "@/domain/clock";
import { dischargeReady } from "@/domain/discharge";
import { asPatientId, type Order } from "@/domain/order";
import { lookupPatient } from "@/domain/patients";
import { projectCensus } from "@/project/census";
import { projectTrail } from "@/project/trail";
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
  const who = lookupPatient(id);
  const mine = orders.filter((order) => order.patientId === id);
  const census = projectCensus(mine, now);
  const dmeTotal = mine.reduce(
    (sum, order) => sum + (RATES[order.equipment[0].hcpcs] ?? 0),
    0,
  );
  const medTotal = who.displayName === "Eleanor Bishop" ? MEDS[0].unitPriceUsd : 0;
  const total = medTotal + dmeTotal;
  const decision = dischargeReady(mine);
  const tabs: PatientTab[] = ["medication", "dme", "supplies"];

  return (
    <section className="patient-pic" aria-label={`${who.displayName} chart`}>
      {surface === "phone" ? (
        <a className="phone-back" href={boardHref({ role, surface })}>
          All patients
        </a>
      ) : null}
      <div className="patient-pic-head">
        <div>
          <div className="patient-id">{who.id}</div>
          <h1 className="patient-title">
            {who.displayName}
            {who.age ? `, ${who.age}` : ""}
          </h1>
          <p className="order-sub">{who.summary}</p>
        </div>
        {total > 0 ? (
          <div className="patient-total">
            <b>${total.toFixed(2)}</b>
            <div>meds + equipment</div>
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
            href={boardHref({ role, surface, patient: who.id, tab: item })}
          >
            {item === "medication"
              ? "Medication"
              : item === "dme"
                ? `DME (${mine.length})`
                : "Supplies (0)"}
          </a>
        ))}
      </div>
      {tab === "medication" ? (
        medTotal > 0 ? (
          <div className="pic-card">
            <div className="pic-card-top">
              <b>Morphine concentrate 100 mg / 5 mL</b>
              <b>
                ${MEDS[0].unitPriceUsd.toFixed(2)}/{MEDS[0].unit}
              </b>
            </div>
            <p className="order-sub">Already filled by BetterRX pharmacy.</p>
          </div>
        ) : (
          <div className="pic-card muted">
            No medications on file in this prototype.
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
                          {step.at ? formatStamp(step.at) : step.done ? "Done" : "Open"}
                        </time>
                      </li>
                    ))}
                  </ol>
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
