import { describe, expect, it } from "vitest";
import { asInstant } from "@/domain/clock";
import { asOrderId } from "@/domain/order";
import {
  answerDonAsk,
  askDonWhy,
  getDonAsk,
  resetDonAsks,
} from "@/inbox/don-ask";

describe("don-ask", () => {
  it("keeps the line held while a question waits for the nurse", () => {
    resetDonAsks();
    const id = asOrderId("DME-10322");
    const now = asInstant("2026-08-15T12:00:00.000Z");
    askDonWhy(id, "Is the oxygen still the plan after today's visit?", now);
    expect(getDonAsk(id)?.answer).toBeUndefined();
    answerDonAsk(id, "Yes. Keep the concentrator.", asInstant("2026-08-15T12:10:00.000Z"));
    expect(getDonAsk(id)?.answer?.text).toBe("Yes. Keep the concentrator.");
  });
});
