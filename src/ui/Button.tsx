"use client";

import { useState, type ButtonHTMLAttributes, type CSSProperties } from "react";

export type ButtonVariant =
  | "primary"
  | "navy"
  | "outline"
  | "outline-inverse"
  | "app"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const VARIANTS: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: "var(--grad-brand)",
    color: "var(--text-on-brand)",
    border: "none",
  },
  navy: { background: "var(--ink-900)", color: "#fff", border: "none" },
  outline: {
    background: "transparent",
    color: "var(--ink-900)",
    border: "2px solid var(--ink-900)",
  },
  "outline-inverse": {
    background: "transparent",
    color: "#fff",
    border: "2px solid #fff",
  },
  app: {
    background: "var(--blue-500)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontFamily: "var(--font-ui)",
    fontWeight: 600,
  },
  ghost: { background: "transparent", color: "var(--coral-600)", border: "none" },
};

const SIZES: Record<ButtonSize, CSSProperties> = {
  sm: { padding: "8px 18px", fontSize: 14 },
  md: { padding: "12px 26px", fontSize: 15 },
  lg: { padding: "15px 34px", fontSize: 17 },
};

export function Button({
  variant = "primary",
  size = "md",
  disabled,
  children,
  style,
  ...rest
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        borderRadius: "var(--radius-pill)",
        cursor: disabled ? "default" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        lineHeight: 1,
        transition: "all var(--dur-fast) var(--ease-brand)",
        transform: hover && !disabled ? "translateY(-1px)" : "none",
        boxShadow: hover && !disabled ? "var(--shadow-card-hover)" : "none",
        filter: hover && !disabled ? "brightness(.97)" : "none",
        opacity: disabled ? 0.45 : 1,
        ...SIZES[size],
        ...VARIANTS[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
