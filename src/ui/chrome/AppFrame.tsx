import Image from "next/image";
import type { ReactNode } from "react";
import type { SurfaceId } from "@/ui/nav";
import { ROLES, type RoleId } from "@/ui/roles";

export function AppFrame({
  role,
  surface,
  children,
}: {
  role: RoleId;
  surface: SurfaceId;
  children: ReactNode;
}) {
  const label = ROLES.find((item) => item.id === role)?.label;
  return (
    <div className={`app-stage app-stage--${surface}`}>
      <div className="app-shell">
        <header className="app-shell-head">
          <Image
            src="/brand/logo-black.svg"
            alt="BetterRX"
            width={63}
            height={16}
            priority
          />
          <span className="role-badge">{label}</span>
        </header>
        {children}
      </div>
    </div>
  );
}
