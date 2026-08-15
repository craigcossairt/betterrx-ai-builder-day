import {
  confirmOrderAction,
  declineOrderAction,
  markDeliveredAction,
  requestPickupAction,
} from "@/app/actions";
import { showDischargeGate } from "@/domain/discharge";
import type { Order } from "@/domain/order";
import { Button } from "@/ui/Button";
import { DischargeReadyForm } from "@/ui/DischargeReadyForm";
import type { RoleId } from "@/ui/roles";

export function OrderActions({
  order,
  role,
}: {
  order: Order;
  role: RoleId;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
      {order.status === "ordered" ? (
        <>
          <form action={confirmOrderAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <Button variant="app" size="sm" type="submit">
              Vendor confirm
            </Button>
          </form>
          <form action={declineOrderAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <Button variant="ghost" size="sm" type="submit">
              Decline
            </Button>
          </form>
        </>
      ) : null}
      {order.status === "dispatched" || order.status === "in_transit_at_risk" ? (
        <form action={markDeliveredAction}>
          <input type="hidden" name="orderId" value={order.id} />
          <Button variant="app" size="sm" type="submit">
            Proof of delivery
          </Button>
        </form>
      ) : null}
      {(order.status === "delivered" ||
        order.status === "pickup_triggered" ||
        order.status === "pickup_delayed") &&
      (role === "case_manager" || role === "don") ? (
        <>
          <form action={requestPickupAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <input type="hidden" name="trigger" value="nurse_request" />
            <Button variant="app" size="sm" type="submit">
              Request pickup
            </Button>
          </form>
          <form action={requestPickupAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <input type="hidden" name="trigger" value="patient_status_deceased" />
            <Button variant="ghost" size="sm" type="submit">
              EMR death fallback
            </Button>
          </form>
        </>
      ) : null}
      {showDischargeGate(order.status) ? (
        <DischargeReadyForm patientId={order.patientId} />
      ) : null}
    </div>
  );
}
