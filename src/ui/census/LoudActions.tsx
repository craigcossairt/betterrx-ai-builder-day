import {
  markDeliveredAction,
  markPickedUpAction,
  requestPickupAction,
} from "@/app/actions";
import type { Order } from "@/domain/order";
import { Button } from "@/ui/Button";
import type { RoleId } from "@/ui/roles";

export function LoudActions({
  order,
  role,
}: {
  order: Order;
  role: RoleId;
}) {
  if (order.status === "in_transit_at_risk") {
    return (
      <form action={markDeliveredAction} className="loud-card-action">
        <input type="hidden" name="orderId" value={order.id} />
        <Button variant="app" size="sm" type="submit">
          Proof of delivery
        </Button>
      </form>
    );
  }
  if (
    order.status === "delivered" &&
    (role === "case_manager" || role === "don")
  ) {
    return (
      <form action={requestPickupAction} className="loud-card-action">
        <input type="hidden" name="orderId" value={order.id} />
        <input type="hidden" name="trigger" value="nurse_request" />
        <Button variant="app" size="sm" type="submit">
          Request pickup
        </Button>
      </form>
    );
  }
  if (
    order.status === "pickup_delayed" &&
    (role === "case_manager" || role === "don")
  ) {
    return (
      <>
        <form action={requestPickupAction} className="loud-card-action">
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="trigger" value="nurse_request" />
          <Button variant="app" size="sm" type="submit">
            Request pickup
          </Button>
        </form>
        <form action={markPickedUpAction} className="loud-card-action">
          <input type="hidden" name="orderId" value={order.id} />
          <Button variant="app" size="sm" type="submit">
            Mark picked up
          </Button>
        </form>
      </>
    );
  }
  return null;
}
