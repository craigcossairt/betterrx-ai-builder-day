import Image from "next/image";
import { Suspense } from "react";
import { CATALOG, MEDS } from "@/domain/catalog";
import { systemClock } from "@/domain/clock";
import { dischargeReady, showDischargeGate } from "@/domain/discharge";
import { escalate } from "@/domain/escalation";
import { demoOfferWindow, offersFor, presentOffers } from "@/domain/offers";
import { censusPpd } from "@/domain/ppd";
import { PICKUP_SLA_HOURS, formatElapsed } from "@/domain/pickup";
import { listSms } from "@/inbox/sms-inbox";
import { supabaseConfig } from "@/lib/supabase";
import { getHospiceStore } from "@/store/hospice-store";
import { getDischargeOverride } from "@/store/discharge-overrides";
import { lookupPatient } from "@/domain/patients";
import { projectCensus } from "@/project/census";
import { Badge, Button } from "@/ui";
import { formatLaneLabel, formatStamp } from "@/ui/format";
import { OrderActions } from "@/ui/OrderActions";
import { PlaceOrderForm } from "@/ui/PlaceOrderForm";
import { RoleSwitcher } from "@/ui/RoleSwitcher";
import { parseRole, ROLES } from "@/ui/roles";
import { boardHref, parsePanel } from "@/ui/nav";
import { PanelDialog } from "@/ui/PanelDialog";
import type { Order } from "@/domain/order";
import {
  confirmOrderAction,
  declineOrderAction,
  markDeliveredAction,
  resetDemoAction,
} from "@/app/actions";

function stampFor(order: Order): string | null {
  switch (order.status) {
    case "ordered":
      return `Ordered ${formatStamp(order.orderedAt)} · target ${formatStamp(order.targetAt)}`;
    case "dispatched":
      return `ETA ${formatStamp(order.eta)}`;
    case "in_transit_at_risk":
      return `ETA ${formatStamp(order.eta)} · discharge ${formatStamp(order.dischargeAt)}`;
    case "delivered":
      return `Delivered ${formatStamp(order.deliveredAt)}`;
    case "pickup_triggered":
    case "pickup_delayed":
      return `Triggered ${formatStamp(order.triggeredAt)}`;
  }
}

function escalationLine(order: Order): string | null {
  const handoff = escalate(order);
  if (!handoff) return null;
  const role =
    handoff.role === "don" ? "director of nursing" : "case manager";
  return `${handoff.name}, ${role}`;
}

function dischargeLine(order: Order, snapshot: readonly Order[]) {
  const decision = dischargeReady(
    snapshot.filter((row) => row.patientId === order.patientId),
  );
  const override = getDischargeOverride(order.patientId);
  if (override) return `Discharge override: ${override}`;
  if (decision.ready) return "Discharge-ready. Required equipment is delivered.";
  return `Waiting on ${decision.blocking.join(", ")}.`;
}

function censusPatients(orders: readonly Order[]) {
  const seen = new Map<
    string,
    { id: string; hospice: string; displayName: string }
  >();
  for (const order of orders) {
    if (!seen.has(order.patientId)) {
      seen.set(order.patientId, {
        id: order.patientId,
        hospice: order.hospice,
        displayName: lookupPatient(order.patientId).displayName,
      });
    }
  }
  return [...seen.values()];
}

function needsYouLine(count: number): string {
  if (count === 0) return "No one is waiting on you.";
  if (count === 1) return "One patient needs you.";
  if (count === 2) return "Two patients need you.";
  return `${count} patients need you.`;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; panel?: string }>;
}) {
  const params = await searchParams;
  const role = parseRole(params.role);
  const panel = parsePanel(params.panel);
  const snapshot = await (await getHospiceStore()).snapshot();
  const now = systemClock.now();
  const census = projectCensus(snapshot, now);
  const roleLabel = ROLES.find((item) => item.id === role)?.label;
  const ppd = censusPpd(snapshot, CATALOG, 7, now);
  const inbox = listSms();
  const window = demoOfferWindow(now);
  const offerSets = {
    E0250: presentOffers(
      offersFor("E0250", window.preferredEta, window.lateEta),
      window.deadline,
      CATALOG,
    ),
    E1390: presentOffers(
      offersFor("E1390", window.preferredEta, window.lateEta),
      window.deadline,
      CATALOG,
    ),
  };
  const shared = Boolean(supabaseConfig());

  return (
    <div className="app-frame">
      <header className="app-topbar">
        <div className="app-brand">
          <Image
            src="/brand/logo-pill.png"
            alt="BetterRX"
            width={120}
            height={34}
            priority
          />
          <div>
            <div className="app-eyebrow">Hospice DME</div>
            <div className="app-title">Census</div>
          </div>
        </div>
        <div className="app-topbar-meta">
          <div className="app-store-flag">
            {shared ? "Shared census" : "This device only"}
          </div>
          <Suspense>
            <RoleSwitcher role={role} />
          </Suspense>
        </div>
      </header>

      <div className="app-main">
        <section className="app-toolbar" aria-label="Census summary">
          <div className="app-chips">
            <div className="app-chip app-chip--alert">
              <strong>{census.atRisk}</strong>
              <span>At risk</span>
            </div>
            <div className="app-chip app-chip--alert">
              <strong>{census.delayedPickup}</strong>
              <span>Delayed pickup</span>
            </div>
            <div className="app-chip">
              <strong>{census.awaitingVendor}</strong>
              <span>Awaiting vendor</span>
            </div>
            <div className="app-chip">
              <strong>{inbox.length}</strong>
              <span>Inbox</span>
            </div>
            {role === "don" ? (
              <div className="app-chip app-chip--ppd">
                <strong>${ppd.actualUsd.toFixed(2)}</strong>
                <span>PPD vs ${ppd.targetUsd.toFixed(2)}</span>
              </div>
            ) : null}
          </div>
          <div className="app-toolbar-actions">
            {role !== "don" ? (
              <a className="app-btn app-btn--primary" href={boardHref(role, "order")}>
                New order
              </a>
            ) : null}
            <a className="app-btn app-btn--outline" href={boardHref(role, "inbox")}>
              Vendor inbox
            </a>
            <form action={resetDemoAction}>
              <button className="app-btn app-btn--outline" type="submit">
                Reset demo
              </button>
            </form>
          </div>
        </section>

        {role === "don" ? (
          <p className="app-ppd-note">
            Drivers: {ppd.idlePickupDays} idle pickup days after death,{" "}
            {ppd.bufferDays} buffer days before discharge,{" "}
            {ppd.preferredOverrides} preferred-option overrides. Patient-days:{" "}
            {ppd.patientDays}. Morphine concentrate $
            {MEDS[0].unitPriceUsd.toFixed(2)}/{MEDS[0].unit} NADAC sits next to
            DME lines. Fixture math, not a savings claim. Viewing as {roleLabel}.
          </p>
        ) : (
          <p className="app-ppd-note">
            Viewing as {roleLabel}. Status is stored state. Vendor confirm is
            the inbox, not a login.
          </p>
        )}

        <section className="census" aria-label="Patient census">
          <p className="census-lede">
            {needsYouLine(census.atRisk + census.delayedPickup)}
          </p>
          {census.lines.map((line) => {
            const order = line.order;
            const why =
              "riskWhy" in order && order.riskWhy ? order.riskWhy : null;
            const handoff = escalationLine(order);
            return (
              <details
                key={order.id}
                className={
                  line.kind === "loud"
                    ? "census-row census-row--attention"
                    : "census-row"
                }
                open={line.kind === "loud"}
              >
                <summary className="census-summary">
                  <div className="census-who">
                    <div className="census-patient">{line.sentence}</div>
                    <div className="census-sub">
                      {lookupPatient(order.patientId).displayName} ·{" "}
                      {order.patientId} · {order.id}
                    </div>
                  </div>
                  {line.kind === "loud" ? (
                    <Badge tone={line.tone === "coral" ? "red" : "gold"}>
                      {formatLaneLabel(order.status)}
                    </Badge>
                  ) : null}
                </summary>
                <div className="census-body">
                  <div className="census-line">{stampFor(order)}</div>
                  {why ? <div className="census-why">{why}</div> : null}
                  {handoff ? (
                    <div className="census-line">Escalation: {handoff}.</div>
                  ) : null}
                  {order.status === "pickup_triggered" ||
                  order.status === "pickup_delayed" ? (
                    <div className="census-line">
                      {formatElapsed(order.triggeredAt, now)} since trigger.
                      Pickup expected within {PICKUP_SLA_HOURS} hours of
                      trigger (labeled assumption).
                    </div>
                  ) : null}
                  {showDischargeGate(order.status) ? (
                    <div className="census-line">
                      {dischargeLine(order, snapshot)}
                    </div>
                  ) : null}
                  <OrderActions order={order} role={role} />
                </div>
              </details>
            );
          })}
        </section>
      </div>

      {panel === "order" ? (
        <PanelDialog title="Place an order" wide>
          <PlaceOrderForm
            offerSets={offerSets}
            patients={censusPatients(snapshot)}
          />
        </PanelDialog>
      ) : null}
      {panel === "inbox" ? (
        <PanelDialog title="Vendor SMS inbox">
          <p className="app-ppd-note" style={{ marginTop: 0 }}>
            Simulated text. No vendor account.
          </p>
          {inbox.map((message) => (
            <div key={message.id} className="inbox-item">
              <div className="census-line">{message.body}</div>
              <div className="inbox-actions">
                <form action={confirmOrderAction}>
                  <input type="hidden" name="orderId" value={message.orderId} />
                  <Button variant="app" size="sm" type="submit">
                    Confirm
                  </Button>
                </form>
                <form action={declineOrderAction}>
                  <input type="hidden" name="orderId" value={message.orderId} />
                  <Button variant="ghost" size="sm" type="submit">
                    Decline
                  </Button>
                </form>
                <form action={markDeliveredAction}>
                  <input type="hidden" name="orderId" value={message.orderId} />
                  <Button variant="outline" size="sm" type="submit">
                    Delivered
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </PanelDialog>
      ) : null}
    </div>
  );
}
