"use client";

import {
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
} from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({
  label,
  hint,
  error,
  style,
  ...rest
}: InputProps) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: "block", fontFamily: "var(--font-body)" }}>
      {label ? (
        <span
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--ink-900)",
            marginBottom: 6,
          }}
        >
          {label}
        </span>
      ) : null}
      <input
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "11px 14px",
          fontSize: 15,
          fontFamily: "inherit",
          color: "var(--ink-700)",
          background: "#fff",
          border: `1px solid ${
            error
              ? "var(--red-500)"
              : focus
                ? "var(--blue-500)"
                : "var(--line-200)"
          }`,
          borderRadius: "var(--radius-md)",
          outline: "none",
          boxShadow: focus ? "var(--focus-ring)" : "none",
          transition: "box-shadow var(--dur-fast),border-color var(--dur-fast)",
          ...style,
        }}
        {...rest}
      />
      {error ? (
        <span
          style={{
            display: "block",
            fontSize: 13,
            color: "var(--red-500)",
            marginTop: 5,
          }}
        >
          {error}
        </span>
      ) : hint ? (
        <span
          style={{
            display: "block",
            fontSize: 13,
            color: "var(--text-muted)",
            marginTop: 5,
          }}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}
