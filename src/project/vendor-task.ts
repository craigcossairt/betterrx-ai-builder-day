import type { Order, OrderId } from "@/domain/order";
import { lookupChart } from "@/parse/erx-payloads";
import { lookupPatient } from "@/domain/patients";
import { formatWhen } from "@/ui/format";

type TaskBase = {
  orderId: OrderId;
  patient: string;
  gear: string;
  address: string;
  contact: string | null;
};

export type VendorTask =
  | (TaskBase & {
      kind: "confirm";
      question: string;
      neededBy: string | null;
    })
  | (TaskBase & { kind: "deliver" })
  | (TaskBase & { kind: "pickup_window"; why: string })
  | (TaskBase & { kind: "picked_up"; stopsClock: true })
  | { kind: "idle" };

function gearName(order: Order): string {
  return order.equipment.map((item) => item.name).join(" · ");
}

function addressLine(patientId: Order["patientId"]): string {
  const chart = lookupChart(patientId);
  return chart.address.street1 || "Address not on file";
}

function base(order: Order): TaskBase {
  return {
    orderId: order.id,
    patient: lookupPatient(order.patientId).displayName,
    gear: gearName(order),
    address: addressLine(order.patientId),
    contact: lookupChart(order.patientId).householdContact,
  };
}

export function projectVendorTask(
  orders: readonly Order[],
  orderId?: OrderId,
): VendorTask {
  const order = orderId
    ? orders.find((row) => row.id === orderId)
    : orders.find((row) => row.status === "pickup_delayed") ??
      orders.find((row) => row.status === "pickup_triggered") ??
      orders.find(
        (row) =>
          row.status === "in_transit_at_risk" || row.status === "dispatched",
      ) ??
      orders.find((row) => row.status === "ordered");
  if (!order) return { kind: "idle" };
  if (order.status === "ordered") {
    const neededBy = order.targetAt ? formatWhen(order.targetAt) : null;
    return {
      ...base(order),
      kind: "confirm",
      neededBy,
      question: neededBy
        ? `Can you be there by ${neededBy}?`
        : "Can you take this order?",
    };
  }
  if (order.status === "dispatched" || order.status === "in_transit_at_risk") {
    return { ...base(order), kind: "deliver" };
  }
  if (order.status === "pickup_triggered") {
    return {
      ...base(order),
      kind: "pickup_window",
      why: "The patient has died. The family is waiting for the equipment to leave.",
    };
  }
  if (order.status === "pickup_delayed") {
    return { ...base(order), kind: "picked_up", stopsClock: true };
  }
  return { kind: "idle" };
}
