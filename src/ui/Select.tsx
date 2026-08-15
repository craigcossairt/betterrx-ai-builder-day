import type { CSSProperties, SelectHTMLAttributes } from "react";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options?: string[];
};

export function Select({
  label,
  options = [],
  style,
  children,
  ...rest
}: SelectProps) {
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
      <select
        style={{
          width: "100%",
          padding: "11px 14px",
          fontSize: 15,
          fontFamily: "inherit",
          color: "var(--ink-700)",
          background: "#fff",
          border: "1px solid var(--line-200)",
          borderRadius: "var(--radius-md)",
          outline: "none",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235C6B77' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          ...style,
        } satisfies CSSProperties}
        {...rest}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        {children}
      </select>
    </label>
  );
}
