"use client";

import { useState, type MouseEvent } from "react";

export type CheckboxProps = {
  label?: string;
  checked?: boolean;
  onChange?: (event: MouseEvent<HTMLSpanElement>) => void;
  indent?: boolean;
};

export function Checkbox({
  label,
  checked,
  onChange,
  indent,
}: CheckboxProps) {
  const [internal, setInternal] = useState(!!checked);
  const on = onChange ? checked : internal;
  const toggle = (event: MouseEvent<HTMLSpanElement>) => {
    if (onChange) onChange(event);
    else setInternal(!internal);
  };
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "var(--font-body)",
        fontSize: 15,
        color: "var(--ink-700)",
        cursor: "pointer",
        paddingLeft: indent ? 26 : 0,
      }}
    >
      <span
        onClick={toggle}
        style={{
          width: 18,
          height: 18,
          flex: "none",
          borderRadius: 4,
          border: `1.5px solid ${on ? "var(--blue-500)" : "var(--ink-300)"}`,
          background: on ? "var(--blue-500)" : "#fff",
          display: "grid",
          placeItems: "center",
          transition: "all var(--dur-fast)",
        }}
      >
        {on ? (
          <svg width="11" height="9" viewBox="0 0 11 9">
            <path
              d="M1 4.5l3 3L10 1"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        ) : null}
      </span>
      {label}
    </label>
  );
}
