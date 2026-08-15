import { boardHref, type SurfaceId } from "@/ui/nav";
import type { RoleId } from "@/ui/roles";

export function PhoneBack({
  role,
  surface,
}: {
  role: RoleId;
  surface?: SurfaceId;
}) {
  return (
    <a className="phone-back" href={boardHref({ role, surface })}>
      Census
    </a>
  );
}
