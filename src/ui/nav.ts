import type { RoleId } from "@/ui/roles";

export type BoardPanel = "order" | "inbox";
export type SurfaceId = "phone" | "split" | "desktop";
export type PatientTab = "patient" | "medication" | "dme" | "supplies";

export type BoardQuery = {
  role: RoleId;
  surface?: SurfaceId;
  panel?: BoardPanel | null;
  patient?: string | null;
  tab?: PatientTab | null;
  order?: string | null;
};

export function parseSurface(raw: string | null | undefined): SurfaceId {
  if (raw === "split" || raw === "desktop") return raw;
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
  return `/?${params.toString()}`;
}

export function parsePanel(raw: string | null | undefined): BoardPanel | null {
  if (raw === "order" || raw === "inbox") return raw;
  return null;
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
  return {
    role: input.nextRole,
    surface: input.surface,
    panel:
      input.nextRole === "vendor"
        ? "inbox"
        : leaveVendor
          ? null
          : parsePanel(input.panel),
    patient:
      input.nextRole === "vendor" || input.nextRole === "don"
        ? null
        : input.patient,
    tab:
      input.tab === "patient" ||
      input.tab === "medication" ||
      input.tab === "supplies" ||
      input.tab === "dme"
        ? input.tab
        : null,
  };
}
