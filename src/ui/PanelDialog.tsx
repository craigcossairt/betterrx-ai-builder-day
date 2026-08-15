"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Dialog } from "@/ui/Dialog";

export function PanelDialog({
  title,
  wide,
  children,
}: {
  title: string;
  wide?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const params = useSearchParams();
  return (
    <Dialog
      open
      title={title}
      wide={wide}
      onClose={() => {
        const next = new URLSearchParams(params.toString());
        next.delete("panel");
        router.push(`/?${next.toString()}`);
      }}
    >
      {children}
    </Dialog>
  );
}
