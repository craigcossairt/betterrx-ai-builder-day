import { askDonWhyAction } from "@/app/actions";
import type { Order } from "@/domain/order";
import { getDonAsk } from "@/inbox/don-ask";
import { lookupPatient } from "@/domain/patients";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { boardHref, type SurfaceId } from "@/ui/nav";
import { PhoneBack } from "@/ui/order/PhoneBack";
import type { RoleId } from "@/ui/roles";

const PRESETS = [
  "Is this still the plan after today's visit?",
  "Would a lower-rate option cover this?",
  "Can this wait for the next routine run?",
];

export function AskWhyScreen({
  role,
  surface,
  order,
}: {
  role: RoleId;
  surface: SurfaceId;
  order: Order | null;
}) {
  const back = boardHref({ role, surface, panel: "oversight" });
  if (!order) {
    return (
      <section className="oversight-screen">
        {surface === "phone" ? <PhoneBack role={role} surface={surface} /> : null}
        <p className="order-sub desk-empty">Pick a held line from oversight.</p>
        <a className="phone-back" href={back}>
          Waiting on you
        </a>
      </section>
    );
  }
  const who = lookupPatient(order.patientId).displayName;
  const asked = getDonAsk(order.id);
  return (
    <section className="oversight-screen ask-why">
      <a className="phone-back" href={back}>
        Waiting on you
      </a>
      <h1 className="patient-title">Ask why</h1>
      <p className="order-sub">
        The line stays held while you wait for an answer.
      </p>
      <div className="chart-card">
        <b>
          {order.equipment[0].name} · {order.equipment[0].hcpcs}
        </b>
        <p className="order-sub">
          {who} · held by the $3 gate
        </p>
      </div>
      {asked?.answer ? (
        <div className="ask-answer">
          <span className="chart-label">The nurse answered</span>
          <p>{asked.answer.text}</p>
        </div>
      ) : asked ? (
        <p className="order-sub">Asked. No answer yet. The line is still held.</p>
      ) : null}
      <form action={askDonWhyAction} className="ask-form">
        <input type="hidden" name="orderId" value={order.id} />
        <p className="chart-label">Pick one, or write your own</p>
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="submit"
            name="question"
            value={preset}
            className="ask-preset"
          >
            {preset}
          </button>
        ))}
        <Input name="customQuestion" label="Your question, one line" />
        <Button variant="app" type="submit">
          Send to the ordering nurse
        </Button>
        <p className="ssn-note">
          It lands on the order the nurse is already looking at, and in Waiting
          on you.
        </p>
      </form>
    </section>
  );
}
