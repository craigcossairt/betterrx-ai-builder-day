"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { resetDemoAction } from "@/app/actions";
import { boardHref, parseSurface, type SurfaceId } from "@/ui/nav";
import { parseRole, ROLES, type RoleId } from "@/ui/roles";

const SURFACES: { id: SurfaceId; label: string }[] = [
  { id: "phone", label: "Phone" },
  { id: "split", label: "Side-by-side" },
  { id: "desktop", label: "Desktop" },
];

export function DemoChrome() {
  const router = useRouter();
  const params = useSearchParams();
  const role = parseRole(params.get("role"));
  const surface = parseSurface(params.get("surface"));
  const panel = params.get("panel");
  const patient = params.get("patient");
  const tab = params.get("tab");

  function go(next: { role?: RoleId; surface?: SurfaceId }) {
    const nextRole = next.role ?? role;
    router.push(
      boardHref({
        role: nextRole,
        surface: next.surface ?? surface,
        panel:
          nextRole === "vendor"
            ? "inbox"
            : panel === "order" || panel === "inbox"
              ? panel
              : null,
        patient: nextRole === "vendor" ? null : patient,
        tab: tab === "medication" || tab === "supplies" || tab === "dme" ? tab : null,
      }),
    );
  }

  return (
    <div className="demo-chrome">
      <span className="demo-chrome-mark">DME prototype</span>
      <div className="seg" role="group" aria-label="Persona">
        {ROLES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={role === item.id ? "seg-btn seg-btn--on" : "seg-btn"}
            onClick={() => go({ role: item.id })}
          >
            {item.id === "admissions"
              ? "Admissions RN"
              : item.id === "case_manager"
                ? "Case Mgr"
                : item.id === "don"
                  ? "DON"
                  : "Vendor"}
          </button>
        ))}
      </div>
      <div className="seg" role="group" aria-label="Surface">
        {SURFACES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={surface === item.id ? "seg-btn seg-btn--on" : "seg-btn"}
            onClick={() => go({ surface: item.id })}
          >
            {item.label}
          </button>
        ))}
      </div>
      <form action={resetDemoAction} className="demo-chrome-reset">
        <button type="submit">Reset</button>
      </form>
    </div>
  );
}
