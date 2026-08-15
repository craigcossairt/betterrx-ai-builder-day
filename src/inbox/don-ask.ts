import type { Instant } from "@/domain/clock";
import type { OrderId } from "@/domain/order";

export type DonAsk = {
  orderId: OrderId;
  question: string;
  askedAt: Instant;
  answer?: { text: string; at: Instant };
};

const asks = new Map<OrderId, DonAsk>();

export function listDonAsks(): readonly DonAsk[] {
  return [...asks.values()];
}

export function getDonAsk(orderId: OrderId): DonAsk | undefined {
  return asks.get(orderId);
}

export function askDonWhy(
  orderId: OrderId,
  question: string,
  now: Instant,
): DonAsk {
  const next = { orderId, question, askedAt: now };
  asks.set(orderId, next);
  return next;
}

export function answerDonAsk(
  orderId: OrderId,
  text: string,
  now: Instant,
): DonAsk | undefined {
  const current = asks.get(orderId);
  if (!current) return undefined;
  const next = { ...current, answer: { text, at: now } };
  asks.set(orderId, next);
  return next;
}

export function resetDonAsks(): void {
  asks.clear();
}
