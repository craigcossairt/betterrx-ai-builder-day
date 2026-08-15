"use client";

import { useState, type MouseEvent } from "react";

export type SwitchProps = {
  label?: string;
  checked?: boolean;
  onChange?: (event: MouseEvent<HTMLSpanElement>) => void;
};

export function Switch({ label, checked, onChange }: SwitchProps) {
  const [internal, setInternal] = useState(!!checked);
  const on = onChange ? checked : internal;
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "var(--font-body)",
        fontSize: 15,
        color: "var(--ink-700)",
        cursor: "pointer",
      }}
    >
      <span
        onClick={(event) => {
          if (onChange) onChange(event);
          else setInternal(!internal);
        }}
        style={{
          width: 40,
          height: 22,
          borderRadius: 999,
          background: on ? "var(--green-500)" : "var(--ink-300)",
          position: "relative",
          transition: "background var(--dur-med) var(--ease-brand)",
          flex: "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: on ? 20 : 2,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,.25)",
            transition: "left var(--dur-med) var(--ease-brand)",
          }}
        />
      </span>
      {label}
    </label>
  );
}
