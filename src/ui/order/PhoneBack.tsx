import { boardHref } from "@/ui/nav";
import type { RoleId } from "@/ui/roles";

export function PhoneBack({ role }: { role: RoleId }) {
  return (
    <a className="phone-back" href={boardHref(role)}>
      Census
    </a>
  );
}
