"use client";

import { useRouter, useSearchParams } from "next/navigation";

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

export function RoleSwitcher({ role }: { role: RoleId }) {
  const router = useRouter();
  const params = useSearchParams();
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        color: "var(--ink-700)",
      }}
    >
      <span style={{ fontWeight: 600 }}>Role</span>
      <select
        aria-label="Role"
        value={role}
        onChange={(event) => {
          const next = new URLSearchParams(params.toString());
          next.set("role", event.target.value);
          router.push(`/?${next.toString()}`);
        }}
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 13,
          padding: "6px 10px",
          border: "1px solid var(--line-200)",
          borderRadius: "var(--radius-sm)",
          background: "#fff",
          color: "var(--ink-900)",
        }}
      >
        {ROLES.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
