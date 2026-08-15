import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { asInstant, frozenClock } from "@/domain/clock";
import {
  VENDOR_CONFIRM_GRACE_HOURS,
  vendorConfirmWhy,
} from "@/domain/confirm-grace";
import { parseSampleOrders } from "@/parse/sample-orders";

const samplePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../docs/briefs/sample-orders.json",
);

function eleanorOrdered() {
  const orders = parseSampleOrders(
    JSON.parse(readFileSync(samplePath, "utf8")),
    frozenClock("2026-08-14T17:00:00.000Z"),
  );
  const row = orders.find((order) => order.id === "DME-10231");
  if (!row || row.status !== "ordered") {
    throw new Error("expected DME-10231 ordered");
  }
  return row;
}

describe("vendorConfirmWhy", () => {
  it("flags DME-10231 because 2026-08-03 is past the 24-hour confirm grace", () => {
    const order = eleanorOrdered();
    expect(VENDOR_CONFIRM_GRACE_HOURS).toBe(24);
    expect(order.orderedAt).toBe("2026-08-03T14:14:00.000Z");
    expect(vendorConfirmWhy(order, asInstant("2026-08-14T17:00:00.000Z"))).toBe(
      "The vendor has not confirmed. Grace is 24 hours.",
    );
  });

  it("stays quiet when the vendor still has time inside the 24-hour grace", () => {
    const order = eleanorOrdered();
    const now = asInstant("2026-08-14T17:00:00.000Z");
    const inside = {
      ...order,
      orderedAt: asInstant("2026-08-14T00:00:00.000Z"),
    };
    expect(vendorConfirmWhy(inside, now)).toBeNull();
  });
});
