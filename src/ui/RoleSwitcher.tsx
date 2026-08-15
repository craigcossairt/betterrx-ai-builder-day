"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ROLES, type RoleId } from "@/ui/roles";

export function RoleSwitcher({ role }: { role: RoleId }) {
  const router = useRouter();
  const params = useSearchParams();
  return (
    <label className="role-pill">
      <span className="sr-only">Role</span>
      <select
        aria-label="Role"
        value={role}
        onChange={(event) => {
          const next = new URLSearchParams(params.toString());
          next.set("role", event.target.value);
          router.push(`/?${next.toString()}`);
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
