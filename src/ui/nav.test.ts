import { describe, expect, it } from "vitest";
import { boardHref, chromeQuery, parsePanel, parseSurface } from "@/ui/nav";
import { parseRole } from "@/ui/roles";

describe("boardHref", () => {
  it("keeps role and opens a named panel", () => {
    expect(boardHref({ role: "case_manager", panel: "inbox" })).toBe(
      "/?role=case_manager&panel=inbox",
    );
    expect(parsePanel("order")).toBe("order");
    expect(parsePanel("nope")).toBeNull();
  });

  it("keeps the demo surface and a patient on the query", () => {
    expect(
      boardHref({
        role: "admissions",
        surface: "desktop",
        patient: "PT-88502",
        tab: "dme",
      }),
    ).toBe("/?role=admissions&surface=desktop&patient=PT-88502&tab=dme");
    expect(parseSurface("desktop")).toBe("desktop");
    expect(parseSurface("wide")).toBe("phone");
  });
});

describe("parseRole", () => {
  it("accepts the vendor dispatcher persona", () => {
    expect(parseRole("vendor")).toBe("vendor");
  });
});

describe("chromeQuery", () => {
  it("drops inbox when leaving the vendor persona", () => {
    expect(
      chromeQuery({
        role: "vendor",
        nextRole: "admissions",
        surface: "desktop",
        panel: "inbox",
        patient: null,
        tab: null,
      }),
    ).toEqual({
      role: "admissions",
      surface: "desktop",
      panel: null,
      patient: null,
      tab: null,
    });
  });
});
