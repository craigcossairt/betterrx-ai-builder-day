import type { SmsMessage } from "@/inbox/sms-inbox";
import { InboxMessage } from "@/ui/census/InboxMessage";
import { PhoneBack } from "@/ui/order/PhoneBack";
import type { RoleId } from "@/ui/roles";

export function InboxScreen({
  role,
  messages,
}: {
  role: RoleId;
  messages: readonly SmsMessage[];
}) {
  return (
    <>
      <header className="census-head">
        <PhoneBack role={role} />
        <p className="census-lede">Vendor inbox</p>
        <p className="order-sub">Simulated text. No vendor account.</p>
      </header>
      <div className="order-body">
        {messages.length === 0 ? (
          <p className="order-sub">No texts yet. Place an order to seed one.</p>
        ) : (
          messages.map((message) => (
            <InboxMessage key={message.id} message={message} />
          ))
        )}
      </div>
    </>
  );
}
