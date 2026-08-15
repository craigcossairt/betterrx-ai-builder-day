import type { CSSProperties, ReactNode } from "react";

export type CardProps = {
  variant?: "marketing" | "app";
  topBar?: boolean;
  title?: string;
  children?: ReactNode;
  style?: CSSProperties;
};

export function Card({
  variant = "marketing",
  topBar = false,
  title,
  children,
  style,
}: CardProps) {
  const app = variant === "app";
  return (
    <div
      style={{
        background: "var(--surface-card)",
        borderRadius: app ? "var(--radius-md)" : "var(--radius-lg)",
        border: app ? "1px solid var(--line-200)" : "none",
        boxShadow: app
          ? "0 1px 3px rgba(36,51,63,.06)"
          : "var(--shadow-card)",
        overflow: "hidden",
        fontFamily: app ? "var(--font-ui)" : "var(--font-body)",
        ...style,
      }}
    >
      {topBar ? (
        <div style={{ height: 6, background: "var(--coral-400)" }} />
      ) : null}
      <div style={{ padding: app ? "18px 20px" : "28px 30px" }}>
        {title ? (
          <div
            style={{
              fontSize: app ? 18 : 20,
              fontWeight: 700,
              color: "var(--ink-900)",
              marginBottom: 12,
            }}
          >
            {title}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
