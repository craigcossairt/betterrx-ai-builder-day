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

export function resetSms(): void {
  messages.length = 0;
}

export function queueConfirmSms(input: {
  now: Instant;
  orderId: OrderId;
  equipmentName: string;
}): void {
  messages.unshift({
    id: `sms-${input.orderId}`,
    orderId: input.orderId,
    body: `BetterRX: confirm ${input.equipmentName} (${input.orderId})? Reply CONFIRM or DECLINE.`,
    at: input.now,
    kind: "confirm",
  });
}

export function seedSmsIfEmpty(now: Instant, orderId: OrderId): void {
  if (messages.length > 0) return;
  queueConfirmSms({
    now,
    orderId,
    equipmentName: "Hospital Bed",
  });
}
