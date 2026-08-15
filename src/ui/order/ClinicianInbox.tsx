import type { ClinicianAlert } from "@/project/clinician-inbox";
import { formatStamp } from "@/ui/format";
import { boardHref, type SurfaceId } from "@/ui/nav";
import { PhoneBack } from "@/ui/order/PhoneBack";
import type { RoleId } from "@/ui/roles";

function hrefFor(role: RoleId, surface: SurfaceId, row: ClinicianAlert): string {
  if (row.kind === "hold") {
    return boardHref({ role, surface, panel: "oversight" });
  }
  if (row.kind === "don_answer") {
    return boardHref({
      role,
      surface,
      panel: "ask",
      order: row.orderId,
    });
  }
  return boardHref({
    role,
    surface,
    patient: row.patientId,
    tab: "dme",
  });
}

export function ClinicianInbox({
  role,
  surface,
  rows,
}: {
  role: RoleId;
  surface: SurfaceId;
  rows: readonly ClinicianAlert[];
}) {
  return (
    <section className="oversight-screen">
      {surface === "phone" ? <PhoneBack role={role} surface={surface} /> : null}
      <div className="order-body">
        <h1 className="patient-title">
          {role === "don" ? "Waiting on R. Ortiz" : "Waiting on you"}
        </h1>
        <p className="order-sub">
          {rows.length === 0
            ? "Nothing waiting on you. This list is built from the orders themselves. There is no separate message store."
            : `${rows.length} ${rows.length === 1 ? "item" : "items"}, pulled off the orders themselves.`}
        </p>
        {rows.map((row) => (
          <a
            key={row.key}
            className={
              row.kind === "at_risk" || row.kind === "don_ask"
                ? "alert-card alert-card--hot"
                : row.kind === "pickup"
                  ? "alert-card alert-card--pickup"
                  : "alert-card"
            }
            href={hrefFor(role, surface, row)}
          >
            <span className="alert-card-top">
              <span className="chart-label">{row.tag}</span>
              <span className="order-sub">
                {row.at ? formatStamp(row.at) : ""}
              </span>
            </span>
            <b>{row.title}</b>
            <span className="order-sub">{row.sub}</span>
          </a>
        ))}
        <p className="ssn-note">
          Every row opens the order it came from. Nothing here is a message you
          have to file or dismiss.
        </p>
      </div>
    </section>
  );
}
