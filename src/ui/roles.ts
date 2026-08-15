export const ROLES = [
  { id: "admissions", label: "Admissions nurse" },
  { id: "case_manager", label: "Case manager" },
  { id: "don", label: "Director of nursing" },
] as const;

export type RoleId = (typeof ROLES)[number]["id"];

export function parseRole(raw: string | null | undefined): RoleId {
  if (raw === "case_manager" || raw === "don") return raw;
  return "admissions";
}
