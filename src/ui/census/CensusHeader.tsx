import Image from "next/image";
import { Suspense } from "react";
import { RoleSwitcher } from "@/ui/RoleSwitcher";
import type { RoleId } from "@/ui/roles";

export function CensusHeader({
  role,
  lede,
}: {
  role: RoleId;
  lede: string;
}) {
  return (
    <header className="census-head">
      <div className="census-head-bar">
        <Image
          src="/brand/logo-black.svg"
          alt="BetterRX"
          width={63}
          height={16}
          priority
        />
        <Suspense>
          <RoleSwitcher role={role} />
        </Suspense>
      </div>
      <p className="census-lede">{lede}</p>
    </header>
  );
}
