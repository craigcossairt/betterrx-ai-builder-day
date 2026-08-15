import { describe, expect, it } from "vitest";
import { boardHref, parsePanel } from "@/ui/nav";

describe("boardHref", () => {
  it("keeps role and opens a named panel", () => {
    expect(boardHref("case_manager", "inbox")).toBe(
      "/?role=case_manager&panel=inbox",
    );
    expect(parsePanel("order")).toBe("order");
    expect(parsePanel("nope")).toBeNull();
  });
});
