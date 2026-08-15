import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { frozenClock } from "@/domain/clock";
import { asOrderId } from "@/domain/order";
import { askDonWhy, resetDonAsks } from "@/inbox/don-ask";
import { parseSampleOrders } from "@/parse/sample-orders";
import { projectClinicianInbox } from "@/project/clinician-inbox";

const samplePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../docs/briefs/sample-orders.json",
);

function fixtures() {
  return parseSampleOrders(
    JSON.parse(readFileSync(samplePath, "utf8")),
    frozenClock("2026-08-14T17:00:00.000Z"),
  );
}

describe("projectClinicianInbox", () => {
  it("builds the nurse list from orders, not a message store", () => {
    resetDonAsks();
    const orders = fixtures();
    const rows = projectClinicianInbox({
      role: "admissions",
      orders,
      asks: [],
    });
    expect(rows.map((row) => [row.kind, row.tag])).toEqual([
      ["at_risk", "At risk"],
      ["pickup", "No pickup time"],
      ["pickup", "No pickup time"],
    ]);
    expect(rows[0]).toMatchObject({
      title: "Oxygen Concentrator · Margaret Holt",
    });
  });

  it("puts unanswered DON questions on the ordering nurse and holds on the DON", () => {
    resetDonAsks();
    const now = frozenClock("2026-08-15T12:00:00.000Z").now();
    askDonWhy(
      asOrderId("DME-10322"),
      "Is this still the plan after today's visit?",
      now,
    );
    const orders = fixtures();
    const nurse = projectClinicianInbox({
      role: "admissions",
      orders,
      asks: [
        {
          orderId: asOrderId("DME-10322"),
          question: "Is this still the plan after today's visit?",
          askedAt: now,
        },
      ],
    });
    expect(nurse.find((row) => row.kind === "don_ask")).toMatchObject({
      kind: "don_ask",
      tag: "Answer R. Ortiz",
      title: "“Is this still the plan after today's visit?”",
    });
    const don = projectClinicianInbox({
      role: "don",
      orders,
      asks: [],
    });
    expect(don.some((row) => row.kind === "hold" && row.tag === "Held · $3 gate")).toBe(
      true,
    );
    expect(don.some((row) => row.kind === "don_ask")).toBe(false);
  });
});
