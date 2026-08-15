"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="app-frame" style={{ padding: 24 }}>
      <h1 className="app-title">Could not finish that action</h1>
      <p className="app-ppd-note">{error.message}</p>
      <button className="app-btn app-btn--primary" onClick={reset} type="button">
        Try again
      </button>
    </main>
  );
}
