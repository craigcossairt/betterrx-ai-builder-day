"use client";

import type { MouseEvent, ReactNode } from "react";

export type DialogProps = {
  open?: boolean;
  title?: string;
  wide?: boolean;
  onClose?: () => void;
  actions?: ReactNode;
  children?: ReactNode;
};

export function Dialog({
  open = true,
  title,
  wide = false,
  onClose,
  actions,
  children,
}: DialogProps) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(36,51,63,.5)",
        display: "grid",
        placeItems: "center",
        zIndex: 100,
        fontFamily: "var(--font-body)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-pop)",
          width: wide ? "min(560px,94vw)" : "min(480px,90vw)",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            padding: "22px 26px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ fontSize: 20, fontWeight: 700, color: "var(--ink-900)" }}
          >
            {title}
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: 22,
                color: "var(--text-muted)",
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          ) : null}
        </div>
        <div
          style={{
            padding: "14px 26px 22px",
            fontSize: 15,
            color: "var(--ink-700)",
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>
        {actions ? (
          <div
            style={{
              padding: "0 26px 24px",
              display: "flex",
              gap: 12,
              justifyContent: "flex-end",
            }}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
