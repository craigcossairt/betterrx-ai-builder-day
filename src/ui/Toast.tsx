import type { ReactNode } from "react";

export type ToastTone = "success" | "info" | "warning" | "danger";

export type ToastProps = {
  tone?: ToastTone;
  title?: string;
  children?: ReactNode;
};

const TONES: Record<ToastTone, { bar: string; icon: string }> = {
  success: { bar: "var(--green-500)", icon: "✓" },
  info: { bar: "var(--blue-500)", icon: "i" },
  warning: { bar: "var(--gold-600)", icon: "!" },
  danger: { bar: "var(--red-500)", icon: "!" },
};

export function Toast({ tone = "success", title, children }: ToastProps) {
  const current = TONES[tone];
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        background: "#fff",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-pop)",
        padding: "14px 18px 14px 14px",
        fontFamily: "var(--font-body)",
        maxWidth: 420,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          flex: "none",
          borderRadius: "50%",
          background: current.bar,
          color: "#fff",
          display: "grid",
          placeItems: "center",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {current.icon}
      </span>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-900)" }}>
          {title}
        </div>
        {children ? (
          <div
            style={{
              fontSize: 14,
              color: "var(--ink-500)",
              marginTop: 2,
              lineHeight: 1.5,
            }}
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
