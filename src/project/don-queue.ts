import type { CatalogSku } from "@/domain/catalog";
import type { Instant } from "@/domain/clock";
import { costGate } from "@/domain/offers";
import {
  isHcpcs,
  orderKind,
  type Hcpcs,
  type LineCode,
  type Order,
  type OrderId,
} from "@/domain/order";
import { lookupPatient } from "@/domain/patients";
import { pickupElapsedDays } from "@/domain/pickup";

export type DonWaiting =
  | {
      kind: "hold";
      orderId: OrderId;
      who: string;
      hcpcs: Hcpcs;
      name: string;
      dailyRateUsd: number;
    }
  | {
      kind: "retro";
      orderId: OrderId;
      who: string;
      hcpcs: Hcpcs;
      name: string;
      dailyRateUsd: number;
    };

export type DonClock = {
  orderId: OrderId | null;
  who: string | null;
  idleDays: number;
  dailyRateUsd: number;
  stillBillingUsd: number;
  sentence: string;
};

export type DonQueue = {
  waiting: DonWaiting[];
  clock: DonClock;
};

function rateFor(hcpcs: LineCode, catalog: readonly CatalogSku[]): number {
  if (!isHcpcs(hcpcs)) return 0;
  return catalog.find((sku) => sku.hcpcs === hcpcs)?.dailyRateUsd ?? 0;
}

function acknowledged(order: Order): boolean {
  return (order.notes ?? "").includes("DON acknowledged retro");
}

function held(order: Order): boolean {
  return (order.notes ?? "").includes("DON hold");
}

export function projectDonQueue(
  orders: readonly Order[],
  catalog: readonly CatalogSku[],
  now: Instant,
): DonQueue {
  const waiting: DonWaiting[] = [];
  for (const order of orders) {
    if (orderKind(order) === "supply") continue;
    const hcpcs = order.equipment[0].hcpcs;
    if (!isHcpcs(hcpcs)) continue;
    const dailyRateUsd = rateFor(hcpcs, catalog);
    const who = lookupPatient(order.patientId).displayName;
    const name = order.equipment[0].name;
    if (held(order) && order.status === "ordered") {
      waiting.push({
        kind: "hold",
        orderId: order.id,
        who,
        hcpcs,
        name,
        dailyRateUsd,
      });
      continue;
    }
    if (acknowledged(order) || !("orderType" in order)) continue;
    const gate = costGate({
      orderType: order.orderType,
      dailyRateUsd,
    });
    if (gate.verdict === "retro") {
      waiting.push({
        kind: "retro",
        orderId: order.id,
        who,
        hcpcs,
        name,
        dailyRateUsd,
      });
    }
  }
  waiting.sort((a, b) => (a.kind === "hold" ? -1 : 1) - (b.kind === "hold" ? -1 : 1));

  const delayed = orders.find((order) => order.status === "pickup_delayed");
  if (!delayed || delayed.status !== "pickup_delayed") {
    return {
      waiting,
      clock: {
        orderId: null,
        who: null,
        idleDays: 0,
        dailyRateUsd: 0,
        stillBillingUsd: 0,
        sentence: "No idle pickup days on this census.",
      },
    };
  }
  const idleDays = pickupElapsedDays(delayed.triggeredAt, now);
  const dailyRateUsd = rateFor(delayed.equipment[0].hcpcs, catalog);
  const stillBillingUsd = Number((idleDays * dailyRateUsd).toFixed(2));
  return {
    waiting,
    clock: {
      orderId: delayed.id,
      who: lookupPatient(delayed.patientId).displayName,
      idleDays,
      dailyRateUsd,
      stillBillingUsd,
      sentence: `A pickup on the same day as the death stops the extra rental days. ${idleDays} idle days at $${dailyRateUsd.toFixed(2)}/day is $${stillBillingUsd.toFixed(2)} still on this bed.`,
    },
  };
}
