import { resetDemoAction } from "@/app/actions";
import { boardHref } from "@/ui/nav";
import type { RoleId } from "@/ui/roles";

export function CensusFooter({
  role,
  canOrder,
  note,
}: {
  role: RoleId;
  canOrder: boolean;
  note?: string;
}) {
  return (
    <footer className="census-foot">
      {canOrder ? (
        <a
          className="app-btn app-btn--primary app-btn--block"
          href={boardHref(role, "order")}
        >
          Order equipment
        </a>
      ) : null}
      {note ? <p className="census-foot-note">{note}</p> : null}
      <p className="census-footnote">
        <a href={boardHref(role, "inbox")}>Vendor inbox</a>
        <span aria-hidden="true"> · </span>
        <form action={resetDemoAction} className="census-footnote-form">
          <button type="submit">Reset demo</button>
        </form>
        <span aria-hidden="true"> · </span>
        Synthetic patients. ETAs are fixtures.
      </p>
    </footer>
  );
}
