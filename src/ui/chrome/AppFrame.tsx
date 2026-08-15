import Image from "next/image";
import type { ReactNode } from "react";
import { boardHref, type BoardPanel, type SurfaceId } from "@/ui/nav";
import { ROLES, type RoleId } from "@/ui/roles";

export function AppFrame({
  role,
  surface,
  homeHref,
  panel,
  patient,
  inboxCount = 0,
  children,
}: {
  role: RoleId;
  surface: SurfaceId;
  homeHref?: string;
  panel?: BoardPanel | null;
  patient?: string | null;
  inboxCount?: number;
  children: ReactNode;
}) {
  const label = ROLES.find((item) => item.id === role)?.label;
  const mark = (
    <Image
      src="/brand/logo-black.svg"
      alt="BetterRX"
      width={63}
      height={16}
      priority
    />
  );
  const tabs =
    role === "vendor"
      ? []
      : [
          { id: null as BoardPanel | null, label: "Census" },
          { id: "order" as const, label: "New order" },
          { id: "oversight" as const, label: "Oversight" },
        ];
  const tabOn = (id: BoardPanel | null) =>
    id === null
      ? !panel || panel === "inbox"
      : panel === id || (id === "oversight" && panel === "ask");
  const inboxHref = boardHref({ role, surface, panel: "inbox" });
  return (
    <div className={`app-stage app-stage--${surface}`}>
      <div className="app-shell">
        <header className="app-shell-head">
          {homeHref ? (
            <a className="app-shell-home" href={homeHref}>
              {mark}
            </a>
          ) : (
            mark
          )}
          {surface === "desktop" && tabs.length > 0 ? (
            <div className="seg product-tabs" role="navigation" aria-label="Product">
              {tabs.map((item) => (
                <a
                  key={item.label}
                  className={
                    tabOn(item.id) ? "seg-btn seg-btn--on" : "seg-btn"
                  }
                  href={boardHref({
                    role,
                    surface,
                    panel: item.id,
                    patient: item.id === "order" ? patient : null,
                  })}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ) : null}
          <div className="app-shell-end">
            {role !== "vendor" ? (
              <a
                className={
                  panel === "inbox" ? "inbox-bell inbox-bell--on" : "inbox-bell"
                }
                href={inboxHref}
                aria-label="Waiting on you"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {inboxCount > 0 ? (
                  <span className="inbox-badge">{inboxCount}</span>
                ) : null}
              </a>
            ) : null}
            <span className="role-badge">{label}</span>
          </div>
        </header>
        {children}
        {surface === "phone" && tabs.length > 0 ? (
          <nav className="phone-tabs" aria-label="Product">
            {tabs.map((item) => (
              <a
                key={item.label}
                className={tabOn(item.id) ? "phone-tab phone-tab--on" : "phone-tab"}
                href={boardHref({
                  role,
                  surface,
                  panel: item.id,
                  patient: item.id === "order" ? patient : null,
                })}
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
