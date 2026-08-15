import type { Instant } from "@/domain/clock";
import type { OfferCard } from "@/domain/offers";
import type { Hcpcs, VendorId } from "@/domain/order";
import { formatWhen } from "@/ui/format";

export type ReviewDraftLine = {
  code: string;
  name: string;
};

export type LineReview = {
  code: Hcpcs;
  name: string;
  vendorId: VendorId;
  eta: Instant;
  vsWindow: "early" | "late";
  whenLabel: string;
  deltaLabel: string;
};

function asHcpcs(code: string): code is Hcpcs {
  return code === "E0250" || code === "E1390" || code === "E1130";
}

function lateBy(deadline: Instant, eta: Instant): string {
  const minutes = Math.round(
    (new Date(eta).getTime() - new Date(deadline).getTime()) / 60_000,
  );
  if (minutes <= 0) {
    const early = Math.abs(minutes);
    if (early < 60) return `${early} min to spare`;
    const hours = Math.floor(early / 60);
    const rest = early % 60;
    if (rest === 0) return hours === 1 ? "1h to spare" : `${hours}h to spare`;
    return `${hours}h ${rest}m to spare`;
  }
  if (minutes < 60) return `${minutes} min late`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return hours === 1 ? "1h late" : `${hours}h late`;
  return `${hours}h ${rest}m late`;
}

export function reviewLines(
  lines: readonly ReviewDraftLine[],
  vendorId: VendorId,
  offerSets: Record<Hcpcs, OfferCard[]>,
  deadline: Instant,
  lineVendors: Readonly<Record<string, string>> = {},
): LineReview[] {
  return lines.flatMap((line) => {
    if (!asHcpcs(line.code)) return [];
    const chosen = lineVendors[line.code] ?? vendorId;
    const card =
      offerSets[line.code]?.find((row) => row.vendorId === chosen) ??
      offerSets[line.code]?.[0];
    if (!card) return [];
    return [
      {
        code: line.code,
        name: line.name,
        vendorId: card.vendorId,
        eta: card.eta,
        vsWindow: card.beatsWindow ? "early" : "late",
        whenLabel: formatWhen(card.eta),
        deltaLabel: lateBy(deadline, card.eta),
      },
    ];
  });
}
