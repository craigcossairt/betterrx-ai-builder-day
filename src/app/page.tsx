import Image from "next/image";
import { Suspense } from "react";
import { CATALOG, MEDS } from "@/domain/catalog";
import { systemClock } from "@/domain/clock";
import { dischargeReady } from "@/domain/discharge";
import { escalate } from "@/domain/escalation";
import { demoOfferWindow, offersFor, presentOffers } from "@/domain/offers";
import { censusPpd } from "@/domain/ppd";
import { PICKUP_SLA_HOURS, pickupElapsedDays } from "@/domain/pickup";
import { listSms } from "@/inbox/sms-inbox";
import { getHospiceStore } from "@/store/hospice-store";
import { getDischargeOverride } from "@/store/discharge-overrides";
import { projectBoard } from "@/project/board";
import { Badge, Button, Card } from "@/ui";
import { formatLaneLabel, formatStamp } from "@/ui/format";
import { OrderActions } from "@/ui/OrderActions";
import { PlaceOrderForm } from "@/ui/PlaceOrderForm";
import { RoleSwitcher } from "@/ui/RoleSwitcher";
import { parseRole, ROLES } from "@/ui/roles";
import type { Order } from "@/domain/order";
import {
  confirmOrderAction,
  declineOrderAction,
  markDeliveredAction,
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
  return `Escalation: ${handoff.name}, ${role}.`;
}

function dischargeLine(order: Order, snapshot: readonly Order[]) {
  const decision = dischargeReady(
    snapshot.filter((row) => row.patientId === order.patientId),
  );
  const override = getDischargeOverride(order.patientId);
  if (override) return `Discharge override: ${override}`;
  if (decision.ready) return "Discharge-ready: required equipment is delivered.";
  return `Not discharge-ready. Waiting on ${decision.blocking.join(", ")}.`;
}

function toneFor(status: Order["status"]) {
  if (status === "in_transit_at_risk" || status === "pickup_delayed") {
    return "red" as const;
  }
  if (status === "delivered") return "green" as const;
  if (status === "pickup_triggered") return "gold" as const;
  if (status === "ordered") return "peach" as const;
  return "blue" as const;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const role = parseRole((await searchParams).role);
  const snapshot = getHospiceStore().snapshot();
  const board = projectBoard(snapshot);
  const roleLabel = ROLES.find((item) => item.id === role)?.label;
  const ppd = censusPpd(snapshot, CATALOG, 7);
  const inbox = listSms();
  const now = systemClock.now();
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

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--surface-100)",
        fontFamily: "var(--font-ui)",
      }}
    >
      <header
        style={{
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--line-200)",
          gap: 12,
        }}
      >
        <Image
          src="/brand/logo-pill.png"
          alt="BetterRX"
          width={120}
          height={34}
          priority
        />
        <Suspense>
          <RoleSwitcher role={role} />
        </Suspense>
      </header>
      <div style={{ padding: 16, display: "grid", gap: 14, maxWidth: 560 }}>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "var(--coral-600)",
              textTransform: "uppercase",
            }}
          >
            Hospice DME
          </div>
          <div
            style={{ fontSize: 21, fontWeight: 700, color: "var(--ink-900)" }}
          >
            Census board.
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 2 }}>
            Viewing as {roleLabel}. Shared status is stored state. Vendor
            confirm is the inbox below, not a login.
          </div>
        </div>
        {role === "don" ? (
          <Card variant="app" topBar title="DME cost PPD">
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--ink-900)" }}>
              ${ppd.actualUsd.toFixed(2)}
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-500)" }}>
                {" "}
                / patient-day vs ${ppd.targetUsd.toFixed(2)} target
              </span>
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 8 }}>
              Drivers: {ppd.idlePickupDays} idle pickup days after death,{" "}
              {ppd.bufferDays} buffer days before discharge,{" "}
              {ppd.preferredOverrides} preferred-option overrides. Patient-days:{" "}
              {ppd.patientDays}. Morphine concentrate $
              {MEDS[0].unitPriceUsd.toFixed(2)}/{MEDS[0].unit} NADAC next to DME
              lines. Numbers are fixture math, not a savings claim.
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: "var(--ink-700)" }}>
              At-risk:{" "}
              {board.inTransitAtRisk.map((order) => order.id).join(", ") || "none"}.
              Delayed pickup:{" "}
              {board.pickupDelayed.map((order) => order.id).join(", ") || "none"}.
            </div>
          </Card>
        ) : null}
        {role !== "don" ? (
          <Card variant="app" title="Place an order">
            <PlaceOrderForm offerSets={offerSets} />
          </Card>
        ) : null}
        <Card variant="app" title="Vendor SMS inbox">
          <div style={{ fontSize: 13, color: "var(--ink-500)", marginBottom: 10 }}>
            Simulated text. No vendor account.
          </div>
          {inbox.map((message) => (
            <div
              key={message.id}
              style={{
                border: "1px solid var(--line-200)",
                borderRadius: 8,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <div style={{ fontSize: 13, color: "var(--ink-700)" }}>{message.body}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
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
        </Card>
        {board.lanes.map((lane) =>
          lane.orders.map((order) => (
            <Card
              key={order.id}
              variant="app"
              topBar={
                order.status === "in_transit_at_risk" ||
                order.status === "pickup_delayed"
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--ink-900)",
                    }}
                  >
                    {order.id}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink-500)" }}>
                    {order.patientId} · {order.hospice}
                  </div>
                </div>
                <Badge tone={toneFor(order.status)}>
                  {formatLaneLabel(order.status)}
                </Badge>
              </div>
              <ul
                style={{
                  margin: "12px 0 0",
                  padding: 0,
                  listStyle: "none",
                  display: "grid",
                  gap: 4,
                }}
              >
                {order.equipment.map((line) => (
                  <li
                    key={`${order.id}-${line.hcpcs}`}
                    style={{ fontSize: 14, color: "var(--ink-700)" }}
                  >
                    <strong>{line.hcpcs}</strong> {line.name}
                  </li>
                ))}
              </ul>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: "var(--ink-500)",
                }}
              >
                {stampFor(order)}
              </div>
              {"riskWhy" in order && order.riskWhy ? (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    color: "var(--red-500)",
                  }}
                >
                  {order.riskWhy}
                </div>
              ) : null}
              {escalationLine(order) ? (
                <div style={{ marginTop: 8, fontSize: 13, color: "var(--ink-700)" }}>
                  {escalationLine(order)}
                </div>
              ) : null}
              {order.status === "pickup_triggered" ||
              order.status === "pickup_delayed" ? (
                <div style={{ marginTop: 8, fontSize: 13, color: "var(--ink-500)" }}>
                  {pickupElapsedDays(order.triggeredAt, now)} days since trigger.
                  Pickup expected within {PICKUP_SLA_HOURS} hours of trigger
                  (labeled assumption).
                </div>
              ) : null}
              <div style={{ marginTop: 8, fontSize: 13, color: "var(--ink-500)" }}>
                {dischargeLine(order, snapshot)}
              </div>
              <OrderActions order={order} role={role} />
            </Card>
          )),
        )}
      </div>
    </main>
  );
}
