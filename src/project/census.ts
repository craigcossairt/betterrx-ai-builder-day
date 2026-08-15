import type { Instant } from "@/domain/clock";
import { vendorConfirmWhy } from "@/domain/confirm-grace";
import { escalate } from "@/domain/escalation";
import {
  isHcpcs,
  type Hcpcs,
  type Order,
  type OrderStatus,
} from "@/domain/order";
import { formatElapsed } from "@/domain/pickup";
import { lookupPatient } from "@/domain/patients";
import { formatWhen } from "@/ui/format";

export type TrackLabel =
  | "AT RISK"
  | "PICKUP LATE"
  | "WAITING"
  | "ON THE WAY"
  | "DONE"
  | "PICKUP";

export type CensusLine = {
  order: Order;
  who: string;
  sentence: string;
  aside: string | null;
  kind: "loud" | "quiet";
  tone: "coral" | "plain" | null;
  trackLabel: TrackLabel;
};

export type Census = {
  lines: readonly CensusLine[];
  atRisk: number;
  delayedPickup: number;
  awaitingVendor: number;
  lede: string;
};

const ATTENTION = new Set<OrderStatus>([
  "in_transit_at_risk",
  "pickup_delayed",
]);

const REST_ORDER: readonly OrderStatus[] = [
  "ordered",
  "dispatched",
  "delivered",
  "pickup_triggered",
  "picked_up",
];

const GEAR: Record<Hcpcs, string> = {
  E0250: "bed",
  E1390: "oxygen",
  E1130: "wheelchair",
};

function clockShort(at: Instant): string {
  return formatWhen(at).replace(/ [AP]M$/, "");
}

function gearWord(order: Order): string {
  const code = order.equipment[0].hcpcs;
  if (code === "SUP-WOUND") return "wound kit";
  if (code === "SUP-FOAM") return "foam dressing";
  if (code === "SUP-SALINE") return "wound wash";
  if (code === "SUP-BRIEFS") return "briefs";
  if (code === "SUP-PADS") return "underpads";
  if (code === "SUP-GLOVES") return "gloves";
  if (isHcpcs(code)) return GEAR[code];
  return "item";
}

type Speaker<S extends OrderStatus> = (
  order: Extract<Order, { status: S }>,
  gear: string,
  now: Instant,
) => string;

const SPEAK: { [S in OrderStatus]: Speaker<S> } = {
  ordered: (order, gear) =>
    (order.notes ?? "").includes("DON hold")
      ? `The ${gear} is held for the director of nursing.`
      : `The ${gear} is waiting on a vendor.`,
  dispatched: (_order, gear) => `The ${gear} is on the way.`,
  delivered: (_order, gear) => `The ${gear} is delivered.`,
  pickup_triggered: (_order, gear) => `The ${gear} pickup is in motion.`,
  in_transit_at_risk: (order, gear) => {
    const miss = Math.round(
      (new Date(order.eta).getTime() - new Date(order.dischargeAt).getTime()) /
        60_000,
    );
    return `The ${gear} misses the ${clockShort(order.dischargeAt)} discharge by about ${miss} minutes.`;
  },
  pickup_delayed: (order, gear, now) =>
    `The ${gear} has been waiting ${formatElapsed(order.triggeredAt, now)} for pickup.`,
  picked_up: (_order, gear) => `The ${gear} is picked up.`,
};

function confirmOverdue(order: Order, now: Instant): boolean {
  return order.status === "ordered" && vendorConfirmWhy(order, now) !== null;
}

export function censusSentence(order: Order, now: Instant): string {
  const gear = gearWord(order);
  switch (order.status) {
    case "ordered": {
      const base = SPEAK.ordered(order, gear, now);
      const why = vendorConfirmWhy(order, now);
      return why ? `${base} ${why}` : base;
    }
    case "dispatched":
      return SPEAK.dispatched(order, gear, now);
    case "delivered":
      return SPEAK.delivered(order, gear, now);
    case "pickup_triggered":
      return SPEAK.pickup_triggered(order, gear, now);
    case "in_transit_at_risk":
      return SPEAK.in_transit_at_risk(order, gear, now);
    case "pickup_delayed":
      return SPEAK.pickup_delayed(order, gear, now);
    case "picked_up":
      return SPEAK.picked_up(order, gear, now);
  }
}

function trackLabelFor(order: Order, now: Instant): TrackLabel {
  if (confirmOverdue(order, now)) return "AT RISK";
  switch (order.status) {
    case "in_transit_at_risk":
      return "AT RISK";
    case "pickup_delayed":
      return "PICKUP LATE";
    case "ordered":
      return "WAITING";
    case "dispatched":
      return "ON THE WAY";
    case "delivered":
      return "DONE";
    case "pickup_triggered":
      return "PICKUP";
    case "picked_up":
      return "DONE";
  }
}

function familyCalled(order: Order): boolean {
  if (order.status !== "pickup_delayed") return false;
  return /family/i.test(order.riskWhy) || /family/i.test(order.notes ?? "");
}

function asideFor(order: Order): string | null {
  if (order.status === "in_transit_at_risk") {
    const handoff = escalate(order);
    if (!handoff) return null;
    const role =
      handoff.role === "don" ? "director of nursing" : "case manager";
    return `${handoff.name}, ${role}.`;
  }
  if (familyCalled(order)) return "The family has called.";
  return null;
}

function asLine(order: Order, now: Instant): CensusLine {
  const overdue = confirmOverdue(order, now);
  const loud = ATTENTION.has(order.status) || overdue;
  return {
    order,
    who: lookupPatient(order.patientId).displayName,
    sentence: censusSentence(order, now),
    aside: loud ? asideFor(order) : null,
    kind: loud ? "loud" : "quiet",
    tone:
      order.status === "in_transit_at_risk" || overdue
        ? "coral"
        : loud
          ? "plain"
          : null,
    trackLabel: trackLabelFor(order, now),
  };
}

export function needsYouLine(count: number): string {
  if (count === 0) return "No one is waiting on you.";
  if (count === 1) return "One patient needs you.";
  if (count === 2) return "Two patients need you.";
  return `${count} patients need you.`;
}

export function projectCensus(orders: readonly Order[], now: Instant): Census {
  const attention = orders.filter(
    (order) => ATTENTION.has(order.status) || confirmOverdue(order, now),
  );
  const rest = REST_ORDER.flatMap((status) =>
    orders.filter(
      (order) => order.status === status && !confirmOverdue(order, now),
    ),
  );
  const atRisk = orders.filter(
    (order) =>
      order.status === "in_transit_at_risk" || confirmOverdue(order, now),
  ).length;
  const delayedPickup = orders.filter(
    (order) => order.status === "pickup_delayed",
  ).length;
  return {
    lines: [...attention, ...rest].map((order) => asLine(order, now)),
    atRisk,
    delayedPickup,
    awaitingVendor: orders.filter(
      (order) =>
        order.status === "ordered" &&
        !(order.notes ?? "").includes("DON hold"),
    ).length,
    lede: needsYouLine(atRisk + delayedPickup),
  };
}
