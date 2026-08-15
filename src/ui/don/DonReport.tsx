import { MEDS } from "@/domain/catalog";
import type { PpdReport } from "@/domain/ppd";

export function DonReport({
  ppd,
  compact = false,
}: {
  ppd: PpdReport;
  compact?: boolean;
}) {
  const morphine = MEDS[0];
  if (compact) {
    return (
      <aside className="don-report don-report--compact" aria-label="DME PPD">
        <p>
          DME PPD ${ppd.actualUsd.toFixed(2)} vs ${ppd.targetUsd.toFixed(2)}{" "}
          fixture target. Idle pickup {ppd.idlePickupDays} days (Ray). Morphine
          concentrate ${morphine.unitPriceUsd.toFixed(2)}/{morphine.unit} NADAC.
        </p>
      </aside>
    );
  }
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
          <dd>${ppd.targetUsd.toFixed(2)} fixture</dd>
        </div>
        <div>
          <dt>Idle pickup days</dt>
          <dd>{ppd.idlePickupDays} (Ray)</dd>
        </div>
        <div>
          <dt>Buffer days</dt>
          <dd>{ppd.bufferDays}. Not in this fixture.</dd>
        </div>
        <div>
          <dt>Preferred overrides</dt>
          <dd>{ppd.preferredOverrides}</dd>
        </div>
        <div>
          <dt>Morphine concentrate</dt>
          <dd>
            ${morphine.unitPriceUsd.toFixed(2)}/{morphine.unit} NADAC
          </dd>
        </div>
      </dl>
      <p className="order-sub">
        E0250 and E1390: CMS DMEPOS-shaped daily rate (not a live PUF pull).
        E1130: synthetic.
      </p>
    </section>
  );
}
