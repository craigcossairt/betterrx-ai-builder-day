import {
  confirmOrderAction,
  declineOrderAction,
  markDeliveredAction,
} from "@/app/actions";
import type { SmsMessage } from "@/inbox/sms-inbox";
import { Button } from "@/ui/Button";

export function InboxMessage({ message }: { message: SmsMessage }) {
  return (
    <div className="inbox-item">
      <div className="census-line">{message.body}</div>
      <div className="inbox-actions">
        <form action={confirmOrderAction}>
          <input type="hidden" name="orderId" value={message.orderId} />
          <Button variant="app" size="sm" type="submit">
            Confirm
          </Button>
        </form>
        <form action={declineOrderAction}>
          <input type="hidden" name="orderId" value={message.orderId} />
          <Button variant="ghost" size="sm" type="submit">
            Decline
          </Button>
        </form>
        <form action={markDeliveredAction}>
          <input type="hidden" name="orderId" value={message.orderId} />
          <Button variant="outline" size="sm" type="submit">
            Delivered
          </Button>
        </form>
      </div>
    </div>
  );
}
