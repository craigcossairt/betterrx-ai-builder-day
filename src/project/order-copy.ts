import type { Instant } from "@/domain/clock";
import { costGate, type OfferCard } from "@/domain/offers";
import type { Hcpcs, OrderType } from "@/domain/order";
import { formatWhen } from "@/ui/format";

const GEAR: Record<Hcpcs, string> = {
  E0250: "bed",
  E1390: "oxygen",
  E1130: "wheelchair",
};

export function sendLabel(hcpcs: Hcpcs): string {
  return `Send order - ${GEAR[hcpcs]}`;
}

export function skuLabel(hcpcs: Hcpcs): string {
  const gear = GEAR[hcpcs];
  return gear.charAt(0).toUpperCase() + gear.slice(1);
}

export function orderTitle(who: string): string {
  return `Equipment for ${who}`;
}

export function bufferDaysCopy(bufferDays: number | null): string {
  if (bufferDays == null) {
    return "Not in this fixture. No stored discharge-to-delivery gap.";
  }
  return String(bufferDays);
}

export function costNote(input: {
  orderType: OrderType;
  dailyRateUsd: number;
  hcpcs: Hcpcs;
}): string | null {
  const gate = costGate({
    orderType: input.orderType,
    dailyRateUsd: input.dailyRateUsd,
  });
  if (gate.verdict !== "retro") return null;
  const gear = GEAR[input.hcpcs];
  const titled = gear.charAt(0).toUpperCase() + gear.slice(1);
  return `${titled} costs over $3 a day, so the director of nursing gets a note after. The order does not wait.`;
}

export type OfferStory = {
  mark: "BEST" | "OTHER OPTION";
  headline: string;
  detail: string;
};

function stockLabel(stock: OfferCard["stock"]): string {
  if (stock === "in") return "In stock";
  if (stock === "out") return "Out of stock";
  return "Stock unknown";
}

function lateBy(deadline: Instant, eta: Instant): string {
  const minutes = Math.round(
    (new Date(eta).getTime() - new Date(deadline).getTime()) / 60_000,
  );
  if (minutes < 60) return `${minutes} minutes late`;
  const hours = Math.round(minutes / 60);
  return hours === 1 ? "1 hour late" : `${hours} hours late`;
}

export function offerStory(card: OfferCard, deadline: Instant): OfferStory {
  const when = formatWhen(card.eta);
  const headline = card.beatsWindow
    ? `Arrives about ${when} - before discharge.`
    : `Arrives about ${when} - ${lateBy(deadline, card.eta)}.`;
  return {
    mark: card.preferred ? "BEST" : "OTHER OPTION",
    headline,
    detail: `${stockLabel(card.stock)} · $${card.dailyRateUsd.toFixed(2)} a day`,
  };
}

export function preferredLineStory(
  hcpcs: Hcpcs,
  cards: readonly OfferCard[],
  deadline: Instant,
): string {
  const preferred = cards.find((card) => card.preferred) ?? cards[0];
  if (!preferred) return skuLabel(hcpcs);
  return `${skuLabel(hcpcs)}: ${offerStory(preferred, deadline).headline}`;
}

