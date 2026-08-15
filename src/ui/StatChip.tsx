import type { ReactNode } from "react";

export type StatChipTone = "coral" | "green" | "blue" | "gold" | "navy";

export type StatChipProps = {
  tone?: StatChipTone;
  solid?: boolean;
  size?: number;
  children?: ReactNode;
};

const TONES: Record<StatChipTone, string> = {
  coral: "var(--coral-500)",
  green: "var(--green-500)",
  blue: "var(--blue-500)",
  gold: "var(--gold-400)",
  navy: "var(--ink-900)",
};

export function StatChip({
  tone = "coral",
  solid = true,
  size = 40,
  children,
}: StatChipProps) {
  const color = TONES[tone];
  return (
    <span
      style={{
        width: size,
        height: size,
        flex: "none",
        borderRadius: "50%",
        display: "inline-grid",
        placeItems: "center",
        background: solid ? color : `color-mix(in srgb, ${color} 14%, white)`,
        color: solid ? "#fff" : color,
        fontSize: size * 0.45,
        fontWeight: 700,
        fontFamily: "var(--font-body)",
      }}
    >
      {children}
    </span>
  );
}
