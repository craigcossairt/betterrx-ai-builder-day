import { CATALOG, MEDS } from "@/domain/catalog";
import type { Instant } from "@/domain/clock";
import type { Order } from "@/domain/order";
import type { PpdReport } from "@/domain/ppd";
import { projectDonQueue } from "@/project/don-queue";
import { bufferDaysCopy } from "@/project/order-copy";
import {
  acknowledgeRetroAction,
  approveHoldAction,
} from "@/app/actions";
import { getDonAsk } from "@/inbox/don-ask";
import { Button } from "@/ui/Button";
import { boardHref, type SurfaceId } from "@/ui/nav";
import type { RoleId } from "@/ui/roles";

export function DonReport({
  ppd,
  orders = [],
  now,
  compact = false,
  role = "don",
  surface = "desktop",
}: {
  ppd: PpdReport;
  orders?: readonly Order[];
  now?: Instant;
  compact?: boolean;
  role?: RoleId;
  surface?: SurfaceId;
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
  const queue =
    now && orders.length > 0 ? projectDonQueue(orders, CATALOG, now) : null;
  const actualPct = Math.min(
    100,
    Math.round((ppd.actualUsd / ppd.targetUsd) * 100),
  );
  return (
    <section className="don-report" aria-label="DME cost PPD">
      <h1 className="patient-title">Equipment oversight</h1>
      <p className="order-sub">
        Hospice spend per patient per day. Not the BetterRX tech fee. Pickup
        the same day as death stops extra rental days.
      </p>
      {role !== "don" ? (
        <p className="ssn-note">
          Approvals belong to the director of nursing. You see the same
          numbers she does.
        </p>
      ) : null}
      {queue && queue.waiting.length > 0 ? (
        <div className="don-wait">
          <div className="chart-label">
            Waiting on you · {queue.waiting.length}
          </div>
          {queue.waiting.map((item) => (
            <div
              key={`${item.kind}-${item.orderId}`}
              className={
                item.kind === "retro" ? "don-item don-item--retro" : "don-item"
              }
            >
              {item.kind === "retro" ? (
                <div className="chart-label">Retro flag · already running</div>
              ) : null}
              <div className="don-item-copy">
                <b>
                  {item.name} · {item.hcpcs} · {item.who}
                </b>
                <span className="order-sub">
                  ${item.dailyRateUsd.toFixed(2)}/day
                  {item.kind === "hold"
                    ? " · held by the $3 gate"
                    : " · STAT never waits on the gate"}
                </span>
              </div>
              {role !== "don" ? null : item.kind === "hold" ? (
                <div className="don-item-actions">
                  <form action={approveHoldAction}>
                    <input type="hidden" name="orderId" value={item.orderId} />
                    <Button variant="app" size="sm" type="submit">
                      Approve
                    </Button>
                  </form>
                  <a
                    className="ask-why-link"
                    href={boardHref({
                      role,
                      surface,
                      panel: "ask",
                      order: item.orderId,
                    })}
                  >
                    {getDonAsk(item.orderId)
                      ? getDonAsk(item.orderId)?.answer
                        ? "Reopen"
                        : "Asked · waiting"
                      : "Ask why"}
                  </a>
                </div>
              ) : (
                <form action={acknowledgeRetroAction}>
                  <input type="hidden" name="orderId" value={item.orderId} />
                  <Button variant="navy" size="sm" type="submit">
                    Acknowledge
                  </Button>
                </form>
              )}
            </div>
          ))}
        </div>
      ) : null}
      {queue?.clock.orderId ? (
        <div className="don-clock">
          <div className="chart-label">
            {queue.clock.who} · idle pickup
          </div>
          <div className="idle-num">{queue.clock.idleDays}</div>
          <p className="order-sub">{queue.clock.sentence}</p>
        </div>
      ) : null}
      <div className="ppd-card">
        <div className="chart-label">DME cost PPD</div>
        <div className="ppd-num">
          ${ppd.actualUsd.toFixed(2)}
          <span> actual</span>
        </div>
        <div className="ppd-bar">
          <span>Actual</span>
          <div className="ppd-track">
            <i style={{ width: `${actualPct}%` }} />
          </div>
          <b>${ppd.actualUsd.toFixed(2)}</b>
        </div>
        <p className="order-sub">{bufferDaysCopy(null)}</p>
        <div className="ppd-bar">
          <span>Target</span>
          <div className="ppd-track">
            <i className="ppd-track-target" style={{ width: "100%" }} />
          </div>
          <b>${ppd.targetUsd.toFixed(2)}</b>
        </div>
        <p className="ssn-note">
          $1.85 is the fixture target. No savings percentage is claimed. The
          idle trail is the explanation.
        </p>
      </div>
      <p className="order-sub">
        E0250 and E1390: CMS DMEPOS-shaped daily rate (not a live PUF pull).
        E1130: synthetic. Morphine concentrate $
        {morphine.unitPriceUsd.toFixed(2)}/{morphine.unit} NADAC.
      </p>
    </section>
  );
}
