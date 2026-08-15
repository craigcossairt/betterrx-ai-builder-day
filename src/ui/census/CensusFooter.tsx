import type { ReactNode } from "react";
import { boardHref, type SurfaceId } from "@/ui/nav";
import { canOrder as roleCanOrder } from "@/ui/roles";
import type { RoleId } from "@/ui/roles";

export function CensusFooter({
  role,
  surface,
  note,
  strip,
}: {
  role: RoleId;
  surface?: SurfaceId;
  note?: string;
  strip?: ReactNode;
}) {
  return (
    <footer className="census-foot">
      {roleCanOrder(role) ? (
        <a
          className="app-btn app-btn--primary app-btn--block"
          href={boardHref({ role, surface, panel: "order" })}
        >
          New order
        </a>
      ) : null}
      {strip ?? (note ? <p className="census-foot-note">{note}</p> : null)}
    </footer>
  );
}
