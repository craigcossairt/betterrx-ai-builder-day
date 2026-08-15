import type { CSSProperties, ReactNode } from "react";

export type BadgeTone =
  | "coral"
  | "peach"
  | "navy"
  | "green"
  | "blue"
  | "gold"
  | "red";

export type BadgeProps = {
  tone?: BadgeTone;
  children?: ReactNode;
};

const TONES: Record<BadgeTone, CSSProperties> = {
  coral: { background: "var(--coral-500)", color: "#fff" },
  peach: { background: "var(--coral-50)", color: "var(--coral-600)" },
  navy: { background: "var(--ink-900)", color: "#fff" },
  green: { background: "var(--green-50)", color: "#2E7D36" },
  blue: { background: "var(--blue-50)", color: "var(--blue-600)" },
  gold: { background: "#FBF3D9", color: "var(--gold-600)" },
  red: { background: "var(--red-50)", color: "var(--red-500)" },
};

export function Badge({ tone = "coral", children }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 14px",
        borderRadius: 999,
        fontFamily: "var(--font-body)",
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 1.2,
        ...TONES[tone],
      }}
    >
      {children}
    </span>
  );
}
