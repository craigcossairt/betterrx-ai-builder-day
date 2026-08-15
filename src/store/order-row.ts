import type { Order } from "@/domain/order";

export type OrderRow = {
  id: string;
  status: Order["status"];
  patient_id: string;
  body: Order;
};

export function orderToRow(order: Order): OrderRow {
  return {
    id: order.id,
    status: order.status,
    patient_id: order.patientId,
    body: order,
  };
}

export function rowToOrder(row: OrderRow): Order {
  if (row.body.id !== row.id) {
    throw new Error(`order row id mismatch: ${row.id}`);
  }
  return row.body;
}
