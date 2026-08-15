import type { Instant } from "@/domain/clock";
import type { OrderId } from "@/domain/order";

export type SmsMessage = {
  id: string;
  orderId: OrderId;
  body: string;
  at: Instant;
  kind: "confirm" | "decline" | "delivered";
};

const messages: SmsMessage[] = [];

export function listSms(): readonly SmsMessage[] {
  return messages;
}

export function queueSms(message: SmsMessage): void {
  messages.push(message);
}

export function seedSmsIfEmpty(now: Instant, orderId: OrderId): void {
  if (messages.length > 0) return;
  messages.push({
    id: "sms-1",
    orderId,
    body: `BetterRX: confirm ${orderId} hospital bed? Reply CONFIRM or DECLINE.`,
    at: now,
    kind: "confirm",
  });
}
