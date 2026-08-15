import type { CatalogSku } from "./catalog";
import type { Instant } from "./clock";
import { isHcpcs, orderKind, type LineCode, type Order } from "./order";

export const PPD_TARGET_USD = 1.85;

export type PpdReport = {
  actualUsd: number;
  targetUsd: number;
  patientDays: number;
  idlePickupDays: number;
  bufferDays: number;
  preferredOverrides: number;
};

function rateFor(hcpcs: LineCode, catalog: readonly CatalogSku[]): number {
  if (!isHcpcs(hcpcs)) return 0;
  return catalog.find((sku) => sku.hcpcs === hcpcs)?.dailyRateUsd ?? 0;
}

function daysBetween(start: Instant, end: Instant): number {
  return Math.max(
    0,
    Math.round(
      (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000,
    ),
  );
}

function stillOnRent(order: Order): boolean {
  return (
    order.status === "delivered" ||
    order.status === "pickup_triggered" ||
    order.status === "pickup_delayed"
  );
}

export function censusPpd(
  orders: readonly Order[],
  catalog: readonly CatalogSku[],
  windowDays: number,
  now: Instant,
): PpdReport {
  const patients = new Set(orders.map((order) => order.patientId));
  const patientDays = patients.size * windowDays;
  let billable = 0;
  let idlePickupDays = 0;
  for (const order of orders) {
    if (orderKind(order) === "supply") continue;
    const daily = order.equipment.reduce(
      (sum, line) => sum + rateFor(line.hcpcs, catalog),
      0,
    );
    if (order.status === "picked_up") {
      continue;
    }
    if (order.status === "pickup_delayed") {
      const idle = daysBetween(order.triggeredAt, now);
      idlePickupDays += idle;
      billable += daily * idle;
    } else if (stillOnRent(order) && order.status === "delivered") {
      billable += daily * windowDays;
    }
  }
  const preferredOverrides = orders.filter((order) =>
    (order.notes ?? "").includes("Override:"),
  ).length;
  return {
    actualUsd: patientDays === 0 ? 0 : billable / patientDays,
    targetUsd: PPD_TARGET_USD,
    patientDays,
    idlePickupDays,
    bufferDays: 0,
    preferredOverrides,
  };
}
