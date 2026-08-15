import type { Instant } from "@/domain/clock";
import type { Order } from "@/domain/order";
import { formatElapsed } from "@/domain/pickup";
import { lookupPatient } from "@/domain/patients";
import { formatWhen } from "@/ui/format";

export type CensusRow = {
  order: Order;
  attention: boolean;
};

export type Census = {
  rows: readonly CensusRow[];
  atRisk: number;
  delayedPickup: number;
  awaitingVendor: number;
};

const ATTENTION = new Set(["in_transit_at_risk", "pickup_delayed"]);

const REST_ORDER = [
  "ordered",
  "dispatched",
  "delivered",
  "pickup_triggered",
] as const;

function gearWord(order: Order): string {
  const name = order.equipment[0].name.toLowerCase();
  if (name.includes("oxygen")) return "oxygen";
  if (name.includes("bed")) return "bed";
  if (name.includes("wheelchair")) return "wheelchair";
  return name;
}

function clockShort(at: Instant): string {
  return formatWhen(at).replace(/ [AP]M$/, "");
}

export function censusSentence(order: Order, now: Instant): string {
  const who = lookupPatient(order.patientId).displayName;
  const gear = gearWord(order);
  if (order.status === "in_transit_at_risk") {
    const miss = Math.round(
      (new Date(order.eta).getTime() - new Date(order.dischargeAt).getTime()) /
        60_000,
    );
    return `${who}'s ${gear} misses the ${clockShort(order.dischargeAt)} discharge by about ${miss} minutes.`;
  }
  if (order.status === "pickup_delayed") {
    const wait = formatElapsed(order.triggeredAt, now);
    const family = /family/i.test(order.riskWhy) || /family/i.test(order.notes ?? "");
    return family
      ? `${who}'s ${gear} has been waiting ${wait} for pickup. The family has called.`
      : `${who}'s ${gear} has been waiting ${wait} for pickup.`;
  }
  if (order.status === "ordered") {
    return `${who}'s ${gear} is waiting on a vendor.`;
  }
  if (order.status === "dispatched") {
    return `${who}'s ${gear} is on the way.`;
  }
  if (order.status === "delivered") {
    return `${who}'s ${gear} is delivered.`;
  }
  return `${who}'s ${gear} pickup is in motion.`;
}

export function projectCensus(orders: readonly Order[]): Census {
  const attention = orders.filter((order) => ATTENTION.has(order.status));
  const rest = REST_ORDER.flatMap((status) =>
    orders.filter((order) => order.status === status),
  );
  return {
    rows: [
      ...attention.map((order) => ({ order, attention: true })),
      ...rest.map((order) => ({ order, attention: false })),
    ],
    atRisk: orders.filter((order) => order.status === "in_transit_at_risk")
      .length,
    delayedPickup: orders.filter((order) => order.status === "pickup_delayed")
      .length,
    awaitingVendor: orders.filter((order) => order.status === "ordered").length,
  };
}
