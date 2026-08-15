import {
  confirmOrderAction,
  declineOrderAction,
  markDeliveredAction,
  markPickedUpAction,
  setPickupWindowAction,
} from "@/app/actions";
import type { Order } from "@/domain/order";
import type { SmsMessage } from "@/inbox/sms-inbox";
import { projectVendorTask } from "@/project/vendor-task";
import { Button } from "@/ui/Button";
import { PhoneBack } from "@/ui/order/PhoneBack";
import type { SurfaceId } from "@/ui/nav";
import type { RoleId } from "@/ui/roles";

export function VendorTaskScreen({
  role,
  surface,
  orders,
  messages,
}: {
  role: RoleId;
  surface?: SurfaceId;
  orders: readonly Order[];
  messages: readonly SmsMessage[];
}) {
  const fromSms = messages[0]?.orderId;
  const task = projectVendorTask(orders, fromSms);
  return (
    <>
      <header className="census-head">
        {role !== "vendor" ? <PhoneBack role={role} surface={surface} /> : null}
        <p className="census-lede">
          {role === "vendor" ? "Opened from a text" : "Vendor inbox"}
        </p>
        <p className="order-sub">
          {role === "vendor"
            ? "No login. One order, one question."
            : "Simulated text. No vendor account."}
        </p>
      </header>
      <div className="order-body">
        {task.kind === "idle" ? (
          <p className="order-sub">Nothing waiting on a vendor right now.</p>
        ) : (
          <article className="vendor-task">
            <div className="vendor-hero">
              <div className="chart-label vendor-hero-label">{task.orderId}</div>
              <h2 className="vendor-gear">{task.gear}</h2>
              {task.kind === "confirm" && task.neededBy ? (
                <p>Needed by {task.neededBy}</p>
              ) : null}
            </div>
            <dl className="vendor-facts">
              <div>
                <dt>Patient</dt>
                <dd>{task.patient}</dd>
              </div>
              <div>
                <dt>Deliver to</dt>
                <dd>{task.address}</dd>
              </div>
              {task.contact ? (
                <div>
                  <dt>At the door</dt>
                  <dd>{task.contact}</dd>
                </div>
              ) : null}
            </dl>
            {task.kind === "confirm" ? (
              <div className="vendor-ask">
                <p className="vendor-q">{task.question}</p>
                <form action={confirmOrderAction}>
                  <input type="hidden" name="orderId" value={task.orderId} />
                  <input type="hidden" name="eta" value="on_time" />
                  <Button variant="app" type="submit">
                    Yes, on time
                  </Button>
                </form>
                <form action={confirmOrderAction}>
                  <input type="hidden" name="orderId" value={task.orderId} />
                  <input type="hidden" name="eta" value="late" />
                  <Button variant="outline" type="submit">
                    Yes, but later
                  </Button>
                </form>
                <form action={declineOrderAction}>
                  <input type="hidden" name="orderId" value={task.orderId} />
                  <Button variant="ghost" type="submit">
                    Can&apos;t take it
                  </Button>
                </form>
                <p className="ssn-note">
                  A later ETA sends the nurse the new time. Declining re-offers
                  the order to the other vendor.
                </p>
              </div>
            ) : null}
            {task.kind === "deliver" ? (
              <div className="vendor-ask">
                <p className="vendor-q">Dropped it off?</p>
                <form action={markDeliveredAction}>
                  <input type="hidden" name="orderId" value={task.orderId} />
                  <Button variant="app" type="submit">
                    Mark delivered
                  </Button>
                </form>
                <p className="ssn-note">Photo is optional. Not stored in this build.</p>
              </div>
            ) : null}
            {task.kind === "pickup_window" ? (
              <div className="vendor-ask">
                <p className="vendor-q">{task.gear} pickup</p>
                <p className="order-sub">{task.why}</p>
                <form action={setPickupWindowAction} className="window-row">
                  <input type="hidden" name="orderId" value={task.orderId} />
                  <input type="hidden" name="window" value="Today 4-6 PM" />
                  <Button variant="outline" type="submit">
                    Today 4-6 PM
                  </Button>
                </form>
                <form action={setPickupWindowAction}>
                  <input type="hidden" name="orderId" value={task.orderId} />
                  <input type="hidden" name="window" value="Tomorrow AM" />
                  <Button variant="ghost" type="submit">
                    Tomorrow AM
                  </Button>
                </form>
              </div>
            ) : null}
            {task.kind === "picked_up" ? (
              <div className="vendor-ask">
                <p className="vendor-q">Bed on the truck?</p>
                <form action={markPickedUpAction}>
                  <input type="hidden" name="orderId" value={task.orderId} />
                  <Button variant="navy" type="submit">
                    Mark picked up
                  </Button>
                </form>
                <p className="ssn-note">
                  This tap stops the rental clock. It is the only tap in the
                  product that does.
                </p>
              </div>
            ) : null}
          </article>
        )}
      </div>
    </>
  );
}
