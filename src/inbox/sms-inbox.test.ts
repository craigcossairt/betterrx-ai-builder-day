import { describe, expect, it } from "vitest";
import { asInstant } from "@/domain/clock";
import { asOrderId } from "@/domain/order";
import {
  listSms,
  queueConfirmSms,
  resetSms,
  seedSmsIfEmpty,
} from "@/inbox/sms-inbox";

describe("sms inbox", () => {
  it("queues a confirm text that names the equipment, even when a seed already exists", () => {
    resetSms();
    seedSmsIfEmpty(asInstant("2026-08-14T14:00:00.000Z"), asOrderId("DME-10231"));
    queueConfirmSms({
      now: asInstant("2026-08-14T15:00:00.000Z"),
      orderId: asOrderId("DME-NEW01"),
      equipmentName: "Oxygen Concentrator",
    });
    const bodies = listSms().map((message) => message.body);
    expect(bodies.some((body) => body.includes("Oxygen Concentrator"))).toBe(
      true,
    );
    expect(bodies.some((body) => body.includes("DME-NEW01"))).toBe(true);
  });
});
