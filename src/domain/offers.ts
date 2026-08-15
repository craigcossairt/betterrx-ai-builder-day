import { asInstant, type Instant } from "./clock";
import { asVendorId, type Hcpcs } from "./order";
import type { VendorOption } from "./rank";

export const COST_THRESHOLD_USD = 3;

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
