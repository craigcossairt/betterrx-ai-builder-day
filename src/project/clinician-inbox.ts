import type { Instant } from "@/domain/clock";
import type { Order } from "@/domain/order";
import { lookupPatient } from "@/domain/patients";
import type { DonAsk } from "@/inbox/don-ask";
import type { RoleId } from "@/ui/roles";

export type ClinicianAlertKind =
  | "don_ask"
  | "don_answer"
  | "at_risk"
  | "declined"
  | "pickup"
  | "hold";

export type ClinicianAlert = {
  key: string;
  kind: ClinicianAlertKind;
  tag: string;
  title: string;
  sub: string;
  patientId: string;
  orderId: string;
  at: Instant | null;
};

export function projectClinicianInbox(input: {
  role: RoleId;
  orders: readonly Order[];
  asks: readonly DonAsk[];
}): ClinicianAlert[] {
  const rows: ClinicianAlert[] = [];
  const asks = new Map(input.asks.map((ask) => [ask.orderId, ask]));
  for (const order of input.orders) {
    const who = lookupPatient(order.patientId).displayName;
    const gear = order.equipment[0]?.name ?? "Equipment";
    const ask = asks.get(order.id);
    if (ask && !ask.answer && input.role !== "don") {
      rows.push({
        key: `ask-${order.id}`,
        kind: "don_ask",
        tag: "Answer R. Ortiz",
        title: `“${ask.question}”`,
        sub: `${gear} · ${who} — the line stays held until you answer.`,
        patientId: order.patientId,
        orderId: order.id,
        at: ask.askedAt,
      });
    }
    if (ask?.answer && input.role === "don") {
      rows.push({
        key: `ans-${order.id}`,
        kind: "don_answer",
        tag: "Answered",
        title: `“${ask.answer.text}”`,
        sub: `Your question on ${gear.toLowerCase()} · ${who}`,
        patientId: order.patientId,
        orderId: order.id,
        at: ask.answer.at,
      });
    }
    if (order.status === "in_transit_at_risk") {
      rows.push({
        key: `risk-${order.id}`,
        kind: "at_risk",
        tag: "At risk",
        title: `${gear} · ${who}`,
        sub: order.riskWhy,
        patientId: order.patientId,
        orderId: order.id,
        at: order.eta,
      });
    }
    if (
      order.status === "ordered" &&
      (order.notes ?? "").includes("Vendor declined")
    ) {
      rows.push({
        key: `decl-${order.id}`,
        kind: "declined",
        tag: "Vendor declined",
        title: `A vendor declined ${gear.toLowerCase()}`,
        sub: `${who} — waiting on a confirm.`,
        patientId: order.patientId,
        orderId: order.id,
        at: order.orderedAt ?? null,
      });
    }
    if (
      order.status === "pickup_triggered" ||
      order.status === "pickup_delayed"
    ) {
      rows.push({
        key: `pick-${order.id}`,
        kind: "pickup",
        tag: "No pickup time",
        title: `${gear} still in ${who}'s home`,
        sub:
          order.status === "pickup_delayed"
            ? "The vendor has not set a window. The family has called."
            : "The vendor has not set a window.",
        patientId: order.patientId,
        orderId: order.id,
        at: order.triggeredAt,
      });
    }
    if (
      input.role === "don" &&
      order.status === "ordered" &&
      (order.notes ?? "").includes("DON hold")
    ) {
      rows.push({
        key: `hold-${order.id}`,
        kind: "hold",
        tag: "Held · $3 gate",
        title: `${gear} · ${who}`,
        sub: "Routine. Waiting on you.",
        patientId: order.patientId,
        orderId: order.id,
        at: order.orderedAt ?? null,
      });
    }
  }
  return rows;
}
