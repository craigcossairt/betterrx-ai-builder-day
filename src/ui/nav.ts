import type { RoleId } from "@/ui/roles";

export type BoardPanel = "order" | "inbox";

export function boardHref(role: RoleId, panel?: BoardPanel): string {
  const query = new URLSearchParams({ role });
  if (panel) query.set("panel", panel);
  return `/?${query.toString()}`;
}

export function parsePanel(raw: string | null | undefined): BoardPanel | null {
  if (raw === "order" || raw === "inbox") return raw;
  return null;
}
