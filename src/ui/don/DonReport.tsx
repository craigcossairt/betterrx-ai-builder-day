import { MEDS } from "@/domain/catalog";
import type { PpdReport } from "@/domain/ppd";

export function DonReport({ ppd }: { ppd: PpdReport }) {
  return (
    <section className="don-report" aria-label="DME cost PPD">
      <h1 className="patient-title">DME cost PPD</h1>
      <p className="order-sub">
        Hospice spend per patient per day. Not the BetterRX tech fee. Pickup
        the same day as death stops extra rental days.
      </p>
      <dl className="chart-list">
        <div>
          <dt>Actual</dt>
          <dd>${ppd.actualUsd.toFixed(2)}</dd>
        </div>
        <div>
          <dt>Target</dt>
          <dd>${ppd.targetUsd.toFixed(2)} · fixture</dd>
        </div>
        <div>
          <dt>Idle pickup days</dt>
          <dd>{ppd.idlePickupDays} · Ray Delgado bed</dd>
        </div>
        <div>
          <dt>Buffer days</dt>
          <dd>{ppd.bufferDays} · not in this fixture</dd>
        </div>
        <div>
          <dt>Preferred overrides</dt>
          <dd>{ppd.preferredOverrides}</dd>
        </div>
        <div>
          <dt>Morphine concentrate</dt>
          <dd>
            ${MEDS[0].unitPriceUsd.toFixed(2)}/{MEDS[0].unit} · NADAC
          </dd>
        </div>
      </dl>
      <p className="order-sub">
        E0250 and E1390 daily rates are CMS DMEPOS-shaped (fee schedule / 30).
        Not a live PUF pull. E1130 is synthetic. PUF national volume is a pitch
        fact, not an order source.
      </p>
    </section>
  );
}
