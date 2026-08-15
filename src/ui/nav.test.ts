import { describe, expect, it } from "vitest";
import {
  boardHref,
  chromeQuery,
  parsePanel,
  parseSurface,
  parseTab,
  resolveBoardView,
} from "@/ui/nav";
import { parseRole } from "@/ui/roles";

describe("boardHref", () => {
  it("keeps role and opens a named panel", () => {
    expect(boardHref({ role: "case_manager", panel: "inbox" })).toBe(
      "/?role=case_manager&panel=inbox",
    );
    expect(parsePanel("order")).toBe("order");
    expect(parsePanel("oversight")).toBe("oversight");
    expect(parsePanel("ask")).toBe("ask");
    expect(parsePanel("nope")).toBeNull();
    expect(
      boardHref({
        role: "don",
        surface: "desktop",
        panel: "ask",
        order: "DME-10322",
      }),
    ).toBe("/?role=don&surface=desktop&panel=ask&order=DME-10322");
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
    expect(parseSurface("split")).toBe("desktop");
    expect(parseSurface("wide")).toBe("phone");
  });

  it("keeps the Patient chart tab on the query", () => {
    expect(
      boardHref({
        role: "admissions",
        surface: "desktop",
        patient: "PT-88421",
        tab: "patient",
      }),
    ).toBe("/?role=admissions&surface=desktop&patient=PT-88421&tab=patient");
    expect(parseTab("patient")).toBe("patient");
  });
});

describe("parseRole", () => {
  it("accepts the vendor dispatcher persona", () => {
    expect(parseRole("vendor")).toBe("vendor");
  });
});

describe("resolveBoardView", () => {
  it("opens equipment oversight on DON desktop when no patient is selected", () => {
    expect(
      resolveBoardView({
        role: "don",
        surface: "desktop",
        panel: null,
        hasPatient: false,
      }),
    ).toEqual({ kind: "desk", main: "oversight" });
  });

  it("keeps a DON chart open until oversight is requested", () => {
    expect(
      resolveBoardView({
        role: "don",
        surface: "desktop",
        panel: null,
        hasPatient: true,
      }),
    ).toEqual({ kind: "desk", main: "patient" });
    expect(
      resolveBoardView({
        role: "don",
        surface: "desktop",
        panel: "oversight",
        hasPatient: true,
      }),
    ).toEqual({ kind: "desk", main: "oversight" });
  });

  it("opens oversight for any clinician when the tab asks", () => {
    expect(
      resolveBoardView({
        role: "admissions",
        surface: "phone",
        panel: "oversight",
        hasPatient: false,
      }),
    ).toEqual({ kind: "oversight" });
  });

  it("opens full oversight on the DON phone only when asked", () => {
    expect(
      resolveBoardView({
        role: "don",
        surface: "phone",
        panel: null,
        hasPatient: false,
      }),
    ).toEqual({ kind: "census" });
    expect(
      resolveBoardView({
        role: "don",
        surface: "phone",
        panel: "oversight",
        hasPatient: false,
      }),
    ).toEqual({ kind: "oversight" });
  });

  it("opens Ask why on the DON phone and desktop", () => {
    expect(
      resolveBoardView({
        role: "don",
        surface: "phone",
        panel: "ask",
        hasPatient: false,
      }),
    ).toEqual({ kind: "ask" });
    expect(
      resolveBoardView({
        role: "don",
        surface: "desktop",
        panel: "ask",
        hasPatient: true,
      }),
    ).toEqual({ kind: "desk", main: "ask" });
  });

  it("keeps the vendor on the SMS task on every surface", () => {
    expect(
      resolveBoardView({
        role: "vendor",
        surface: "desktop",
        panel: "oversight",
        hasPatient: true,
      }),
    ).toEqual({ kind: "vendor_task" });
  });
});

describe("chromeQuery", () => {
  it("keeps the open chart when switching to DON", () => {
    expect(
      chromeQuery({
        role: "admissions",
        nextRole: "don",
        surface: "desktop",
        panel: null,
        patient: "PT-88421",
        tab: "patient",
      }),
    ).toEqual({
      role: "don",
      surface: "desktop",
      panel: null,
      patient: "PT-88421",
      tab: "patient",
    });
  });

  it("drops oversight when leaving the DON persona", () => {
    expect(
      chromeQuery({
        role: "don",
        nextRole: "admissions",
        surface: "desktop",
        panel: "oversight",
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

  it("drops Ask why when leaving the DON persona", () => {
    expect(
      chromeQuery({
        role: "don",
        nextRole: "admissions",
        surface: "desktop",
        panel: "ask",
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
