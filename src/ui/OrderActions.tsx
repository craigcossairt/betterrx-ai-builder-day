import {
  confirmOrderAction,
  declineOrderAction,
  markDeliveredAction,
  markDischargeReadyAction,
  requestPickupAction,
} from "@/app/actions";
import type { Order } from "@/domain/order";
import { Button } from "@/ui/Button";
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
      <form action={markDischargeReadyAction} style={{ display: "flex", gap: 8 }}>
        <input type="hidden" name="patientId" value={order.patientId} />
        <input
          name="reason"
          placeholder="Override reason"
          style={{
            border: "1px solid var(--line-200)",
            borderRadius: 6,
            padding: "8px 10px",
            fontFamily: "inherit",
            fontSize: 13,
          }}
        />
        <Button variant="outline" size="sm" type="submit">
          Discharge ready
        </Button>
      </form>
    </div>
  );
}
