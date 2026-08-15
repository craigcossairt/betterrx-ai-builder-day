import { describe, expect, it } from "vitest";
import { formatProposedWindow } from "@/project/pickup-window";

describe("formatProposedWindow", () => {
  it("names a custom pickup window the nurse and family can read", () => {
    expect(formatProposedWindow(0, 16, 18)).toBe("Today, 4 PM–6 PM");
    expect(formatProposedWindow(1, 8, 12)).toBe("Tomorrow, 8 AM–12 PM");
    expect(formatProposedWindow(0, 16, 16)).toBeNull();
  });
});
