import type { Instant } from "@/domain/clock";
import type { Hcpcs, Order, OrderStatus } from "@/domain/order";
import { formatElapsed } from "@/domain/pickup";
import { lookupPatient } from "@/domain/patients";
import { formatWhen } from "@/ui/format";

export type CensusLine = {
  order: Order;
  sentence: string;
  kind: "loud" | "quiet";
  tone: "coral" | "plain" | null;
};

export type Census = {
  lines: readonly CensusLine[];
  atRisk: number;
  delayedPickup: number;
  awaitingVendor: number;
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
  return GEAR[order.equipment[0].hcpcs];
}

type Speaker<S extends OrderStatus> = (
  order: Extract<Order, { status: S }>,
  who: string,
  gear: string,
  now: Instant,
) => string;

const SPEAK: { [S in OrderStatus]: Speaker<S> } = {
  ordered: (_order, who, gear) => `${who}'s ${gear} is waiting on a vendor.`,
  dispatched: (_order, who, gear) => `${who}'s ${gear} is on the way.`,
  delivered: (_order, who, gear) => `${who}'s ${gear} is delivered.`,
  pickup_triggered: (_order, who, gear) =>
    `${who}'s ${gear} pickup is in motion.`,
  in_transit_at_risk: (order, who, gear) => {
    const miss = Math.round(
      (new Date(order.eta).getTime() - new Date(order.dischargeAt).getTime()) /
        60_000,
    );
    return `${who}'s ${gear} misses the ${clockShort(order.dischargeAt)} discharge by about ${miss} minutes.`;
  },
  pickup_delayed: (order, who, gear, now) => {
    const wait = formatElapsed(order.triggeredAt, now);
    const family =
      /family/i.test(order.riskWhy) || /family/i.test(order.notes ?? "");
    return family
      ? `${who}'s ${gear} has been waiting ${wait} for pickup. The family has called.`
      : `${who}'s ${gear} has been waiting ${wait} for pickup.`;
  },
};

export function censusSentence(order: Order, now: Instant): string {
  const who = lookupPatient(order.patientId).displayName;
  const gear = gearWord(order);
  switch (order.status) {
    case "ordered":
      return SPEAK.ordered(order, who, gear, now);
    case "dispatched":
      return SPEAK.dispatched(order, who, gear, now);
    case "delivered":
      return SPEAK.delivered(order, who, gear, now);
    case "pickup_triggered":
      return SPEAK.pickup_triggered(order, who, gear, now);
    case "in_transit_at_risk":
      return SPEAK.in_transit_at_risk(order, who, gear, now);
    case "pickup_delayed":
      return SPEAK.pickup_delayed(order, who, gear, now);
  }
}

function asLine(order: Order, now: Instant): CensusLine {
  const loud = ATTENTION.has(order.status);
  return {
    order,
    sentence: censusSentence(order, now),
    kind: loud ? "loud" : "quiet",
    tone: order.status === "in_transit_at_risk" ? "coral" : loud ? "plain" : null,
  };
}

export function projectCensus(orders: readonly Order[], now: Instant): Census {
  const attention = orders.filter((order) => ATTENTION.has(order.status));
  const rest = REST_ORDER.flatMap((status) =>
    orders.filter((order) => order.status === status),
  );
  return {
    lines: [...attention, ...rest].map((order) => asLine(order, now)),
    atRisk: orders.filter((order) => order.status === "in_transit_at_risk")
      .length,
    delayedPickup: orders.filter((order) => order.status === "pickup_delayed")
      .length,
    awaitingVendor: orders.filter((order) => order.status === "ordered").length,
  };
}
