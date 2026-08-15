"use client";

import { useState, type ReactNode } from "react";

export type TabsProps = {
  tabs?: string[];
  active?: string;
  onChange?: (tab: string) => void;
  children?: ReactNode;
};

export function Tabs({
  tabs = [],
  active,
  onChange,
  children,
}: TabsProps) {
  const [internal, setInternal] = useState(active || tabs[0]);
  const current = onChange ? active : internal;
  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "1px solid var(--line-200)",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => (onChange ? onChange(tab) : setInternal(tab))}
            style={{
              padding: "10px 18px",
              fontSize: 15,
              fontFamily: "inherit",
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: current === tab ? "var(--coral-600)" : "var(--text-muted)",
              borderBottom:
                current === tab
                  ? "3px solid var(--coral-500)"
                  : "3px solid transparent",
              marginBottom: -1,
              transition: "color var(--dur-fast)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
