import {
  confirmOrderAction,
  declineOrderAction,
  markDeliveredAction,
  markPickedUpAction,
  proposePickupWindowAction,
  reviseEtaAction,
} from "@/app/actions";
import type { Order } from "@/domain/order";
import { vendorActions } from "@/project/vendor-actions";
import { Button } from "@/ui/Button";
import { formatLaneLabel, formatVendor } from "@/ui/format";
import { lookupPatient } from "@/domain/patients";

export function VendorOrder({ order }: { order: Order }) {
  const actions = vendorActions(order);
  const who = lookupPatient(order.patientId).displayName;
  const gear = order.equipment.map((line) => line.name).join(", ");
  return (
    <>
      <header className="census-head">
        <p className="census-lede">One order. No login.</p>
        <p className="order-sub">
          {who}. {gear}. {formatLaneLabel(order.status)}.
          {order.vendorId ? ` ${formatVendor(order.vendorId)}.` : ""}
        </p>
      </header>
      <div className="order-body">
        {order.notes ? <p className="order-sub">{order.notes}</p> : null}
        {order.status === "pickup_delayed" ? (
          <p className="order-sub">{order.riskWhy}</p>
        ) : null}
        <div className="inbox-actions">
          {actions.includes("confirm") ? (
            <form action={confirmOrderAction}>
              <input type="hidden" name="orderId" value={order.id} />
              <Button variant="app" size="sm" type="submit">
                Confirm
              </Button>
            </form>
          ) : null}
          {actions.includes("yes_but") ? (
            <form action={reviseEtaAction}>
              <input type="hidden" name="orderId" value={order.id} />
              <Button variant="outline" size="sm" type="submit">
                Yes, later ETA
              </Button>
            </form>
          ) : null}
          {actions.includes("decline") ? (
            <form action={declineOrderAction}>
              <input type="hidden" name="orderId" value={order.id} />
              <Button variant="ghost" size="sm" type="submit">
                Decline
              </Button>
            </form>
          ) : null}
          {actions.includes("delivered") ? (
            <form action={markDeliveredAction}>
              <input type="hidden" name="orderId" value={order.id} />
              <Button variant="app" size="sm" type="submit">
                Delivered
              </Button>
            </form>
          ) : null}
          {actions.includes("pickup_window") ? (
            <form action={proposePickupWindowAction}>
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="pickupWindow" value="tomorrow morning" />
              <Button variant="outline" size="sm" type="submit">
                Pickup tomorrow morning
              </Button>
            </form>
          ) : null}
          {actions.includes("picked_up") ? (
            <form action={markPickedUpAction}>
              <input type="hidden" name="orderId" value={order.id} />
              <Button variant="app" size="sm" type="submit">
                Mark picked up
              </Button>
            </form>
          ) : null}
        </div>
      </div>
    </>
  );
}
