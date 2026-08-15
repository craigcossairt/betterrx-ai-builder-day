import type { RoleId } from "@/ui/roles";

export type BoardPanel = "order" | "inbox" | "oversight" | "ask";
export type SurfaceId = "phone" | "desktop";
export type PatientTab = "patient" | "medication" | "dme" | "supplies";
export type ShopKindParam = "dme" | "supplies";

export type BoardQuery = {
  role: RoleId;
  surface?: SurfaceId;
  panel?: BoardPanel | null;
  patient?: string | null;
  tab?: PatientTab | null;
  order?: string | null;
  kind?: ShopKindParam | null;
};

export function parseSurface(raw: string | null | undefined): SurfaceId {
  if (raw === "desktop" || raw === "split") return "desktop";
  return "phone";
}

export function parseTab(raw: string | null | undefined): PatientTab {
  if (raw === "patient" || raw === "medication" || raw === "supplies") {
    return raw;
  }
  return "dme";
}

export function boardHref(query: BoardQuery): string {
  const params = new URLSearchParams({ role: query.role });
  if (query.surface && query.surface !== "phone") {
    params.set("surface", query.surface);
  }
  if (query.panel) params.set("panel", query.panel);
  if (query.patient) params.set("patient", query.patient);
  if (query.tab) params.set("tab", query.tab);
  if (query.order) params.set("order", query.order);
  if (query.kind) params.set("kind", query.kind);
  return `/?${params.toString()}`;
}

export function parseKind(raw: string | null | undefined): ShopKindParam {
  return raw === "supplies" ? "supplies" : "dme";
}

export function parsePanel(raw: string | null | undefined): BoardPanel | null {
  if (raw === "order" || raw === "inbox" || raw === "oversight" || raw === "ask") {
    return raw;
  }
  return null;
}

export type BoardMain =
  | "order"
  | "inbox"
  | "oversight"
  | "ask"
  | "patient"
  | "empty";

export type BoardView =
  | { kind: "vendor_task" }
  | { kind: "order" }
  | { kind: "inbox" }
  | { kind: "oversight" }
  | { kind: "ask" }
  | { kind: "patient" }
  | { kind: "census" }
  | { kind: "desk"; main: BoardMain };

export function resolveBoardView(input: {
  role: RoleId;
  surface: SurfaceId;
  panel: BoardPanel | null;
  hasPatient: boolean;
}): BoardView {
  if (input.role === "vendor") return { kind: "vendor_task" };
  if (input.surface === "phone") {
    if (input.panel === "order") return { kind: "order" };
    if (input.panel === "inbox") return { kind: "inbox" };
    if (input.panel === "oversight") {
      return { kind: "oversight" };
    }
    if (input.panel === "ask" && input.role === "don") {
      return { kind: "ask" };
    }
    if (input.hasPatient) return { kind: "patient" };
    return { kind: "census" };
  }
  const main: BoardMain =
    input.panel === "order"
      ? "order"
      : input.panel === "inbox"
        ? "inbox"
        : input.panel === "ask" && input.role === "don"
          ? "ask"
          : input.panel === "oversight"
          ? "oversight"
          : input.hasPatient
            ? "patient"
            : input.role === "don"
              ? "oversight"
              : "empty";
  return { kind: "desk", main };
}

export function chromeQuery(input: {
  role: RoleId;
  nextRole: RoleId;
  surface: SurfaceId;
  panel: string | null;
  patient: string | null;
  tab: string | null;
}): BoardQuery {
  const leaveVendor = input.role === "vendor" && input.nextRole !== "vendor";
  const leaveDon = input.role === "don" && input.nextRole !== "don";
  const panel = parsePanel(input.panel);
  return {
    role: input.nextRole,
    surface: input.surface,
    panel:
      input.nextRole === "vendor"
        ? "inbox"
        : leaveVendor ||
            (leaveDon && (panel === "oversight" || panel === "ask"))
          ? null
          : panel,
    patient: input.nextRole === "vendor" ? null : input.patient,
    tab:
      input.tab === "patient" ||
      input.tab === "medication" ||
      input.tab === "supplies" ||
      input.tab === "dme"
        ? input.tab
        : null,
  };
}
