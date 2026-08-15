import type { Instant } from "./clock";
import type { Hcpcs, VendorId } from "./order";

export type Stock = "in" | "out" | "unknown";

export type VendorOption = {
  hcpcs: Hcpcs;
  vendorId: VendorId;
  stock: Stock;
  eta: Instant;
  dailyRateUsd: number;
};

function stockScore(stock: Stock): number {
  if (stock === "in") return 0;
  if (stock === "unknown") return 1;
  return 2;
}

export function rankOptions(
  options: readonly VendorOption[],
  deadline: Instant,
): readonly VendorOption[] {
  return [...options].sort((a, b) => {
    const aBeats = a.eta <= deadline ? 0 : 1;
    const bBeats = b.eta <= deadline ? 0 : 1;
    if (aBeats !== bBeats) return aBeats - bBeats;
    if (a.dailyRateUsd !== b.dailyRateUsd) return a.dailyRateUsd - b.dailyRateUsd;
    return stockScore(a.stock) - stockScore(b.stock);
  });
}
