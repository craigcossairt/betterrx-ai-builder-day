"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { emrDeathAction, resetDemoAction } from "@/app/actions";
import { boardHref, chromeQuery, parseSurface, type SurfaceId } from "@/ui/nav";
import { parseRole, ROLES, type RoleId } from "@/ui/roles";

const SURFACES: { id: SurfaceId; label: string }[] = [
  { id: "phone", label: "Phone" },
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
    router.push(
      boardHref(
        chromeQuery({
          role,
          nextRole: next.role ?? role,
          surface: next.surface ?? surface,
          panel,
          patient,
          tab,
        }),
      ),
    );
  }

  return (
    <div className="demo-chrome">
      <span className="demo-chrome-mark">Demo</span>
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
      <form action={emrDeathAction} className="demo-chrome-reset">
        {patient ? <input type="hidden" name="patientId" value={patient} /> : null}
        <button type="submit">EMR death fallback</button>
      </form>
      <form action={resetDemoAction} className="demo-chrome-reset">
        <button type="submit">Reset</button>
      </form>
      <a className="demo-chrome-link" href="/integration">
        How it connects
      </a>
    </div>
  );
}
