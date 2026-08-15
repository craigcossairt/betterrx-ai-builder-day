import type { SmsMessage } from "@/inbox/sms-inbox";
import { InboxMessage } from "@/ui/census/InboxMessage";
import { PhoneBack } from "@/ui/order/PhoneBack";
import type { SurfaceId } from "@/ui/nav";
import type { RoleId } from "@/ui/roles";

export function InboxScreen({
  role,
  surface,
  messages,
}: {
  role: RoleId;
  surface?: SurfaceId;
  messages: readonly SmsMessage[];
}) {
  return (
    <>
      <header className="census-head">
        {role !== "vendor" ? <PhoneBack role={role} surface={surface} /> : null}
        <p className="census-lede">Vendor inbox</p>
        <p className="order-sub">
          {role === "vendor"
            ? "Wasatch / Uintah dispatch. No login. Opened from a text."
            : "Simulated text. No vendor account."}
        </p>
      </header>
      <div className="order-body">
        {messages.length === 0 ? (
          <p className="order-sub">Nothing waiting on a vendor right now.</p>
        ) : (
          messages.map((message) => (
            <InboxMessage key={message.id} message={message} />
          ))
        )}
      </div>
    </>
  );
}
