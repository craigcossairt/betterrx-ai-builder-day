import type { CatalogSku } from "./catalog";
import { asInstant, type Instant } from "./clock";
import { asVendorId, type Hcpcs, type OrderType, type VendorId } from "./order";
import { rankOptions, type Stock, type VendorOption } from "./rank";

export const COST_THRESHOLD_USD = 3;

export type RateLabel = "CMS-shaped" | "synthetic";

export type OfferCard = {
  vendorId: VendorId;
  preferred: boolean;
  stock: Stock;
  eta: Instant;
  beatsWindow: boolean;
  dailyRateUsd: number;
  rateLabel: RateLabel;
};

export function offersFor(
  hcpcs: Hcpcs,
  preferredEta: Instant,
  lateEta: Instant,
): readonly [VendorOption, VendorOption] {
  const rates: Record<Hcpcs, number> = {
    E0250: 2.57,
    E1390: 3.34,
    E1130: 2.0,
  };
  return [
    {
      hcpcs,
      vendorId: asVendorId("vendor-1"),
      stock: "in",
      eta: preferredEta,
      dailyRateUsd: rates[hcpcs],
    },
    {
      hcpcs,
      vendorId: asVendorId("vendor-2"),
      stock: "unknown",
      eta: lateEta,
      dailyRateUsd: Number((rates[hcpcs] + 0.8).toFixed(2)),
    },
  ];
}

export function demoOfferWindow(now: Instant): {
  preferredEta: Instant;
  lateEta: Instant;
  deadline: Instant;
} {
  const start = new Date(now).getTime();
  return {
    preferredEta: asInstant(new Date(start + 2 * 3600_000).toISOString()),
    lateEta: asInstant(new Date(start + 8 * 3600_000).toISOString()),
    deadline: asInstant(new Date(start + 4 * 3600_000).toISOString()),
  };
}

export function presentOffers(
  options: readonly VendorOption[],
  deadline: Instant,
  catalog: readonly CatalogSku[],
): OfferCard[] {
  return rankOptions(options, deadline).map((option, index) => {
    const sku = catalog.find((row) => row.hcpcs === option.hcpcs);
    const catalogMatch = sku?.dailyRateUsd === option.dailyRateUsd;
    return {
      vendorId: option.vendorId,
      preferred: index === 0,
      stock: option.stock,
      eta: option.eta,
      beatsWindow: option.eta <= deadline,
      dailyRateUsd: option.dailyRateUsd,
      rateLabel:
        catalogMatch && sku?.rateSource === "cms" ? "CMS-shaped" : "synthetic",
    };
  });
}

export type CostDecision =
  | { verdict: "open" }
  | { verdict: "hold" }
  | { verdict: "retro"; note: string };

export function costGate(input: {
  orderType: OrderType;
  dailyRateUsd: number;
  thresholdUsd?: number;
}): CostDecision {
  const over = input.dailyRateUsd > (input.thresholdUsd ?? COST_THRESHOLD_USD);
  if (!over) return { verdict: "open" };
  if (input.orderType === "stat") {
    return { verdict: "retro", note: "STAT over $3. DON retro." };
  }
  return { verdict: "hold" };
}

export function chooseOffer(input: {
  ranked: readonly VendorOption[];
  vendorId: VendorId;
  overrideReason: string;
  donReason: string;
  orderType: OrderType;
  thresholdUsd?: number;
}): VendorOption {
  const chosen = input.ranked.find((option) => option.vendorId === input.vendorId);
  if (!chosen) throw new Error("unknown vendor option");
  if (chosen !== input.ranked[0] && input.overrideReason.length === 0) {
    throw new Error("override needs a reason");
  }
  const gate = costGate({
    orderType: input.orderType,
    dailyRateUsd: chosen.dailyRateUsd,
    thresholdUsd: input.thresholdUsd,
  });
  if (gate.verdict === "hold" && input.donReason.length === 0) {
    throw new Error("director of nursing approval needed");
  }
  return chosen;
}
