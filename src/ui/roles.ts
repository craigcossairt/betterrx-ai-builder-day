export const ROLES = [
  { id: "admissions", label: "Admissions RN" },
  { id: "case_manager", label: "Case manager" },
  { id: "don", label: "Director of nursing" },
  { id: "vendor", label: "Vendor dispatcher" },
] as const;

export type RoleId = (typeof ROLES)[number]["id"];

export function parseRole(raw: string | null | undefined): RoleId {
  if (raw === "case_manager" || raw === "don" || raw === "vendor") return raw;
  return "admissions";
}

export function canOrder(role: RoleId): boolean {
  return role === "admissions" || role === "case_manager";
}

export function canSeeCensus(role: RoleId): boolean {
  return role !== "vendor";
}

export function canSeeInbox(role: RoleId): boolean {
  return true;
}
