"use client";

import { useEffect } from "react";
import { reportError } from "@global/error/error-handler";
import { THEME_BOOTSTRAP_SCRIPT } from "@global/lib/theme-bootstrap";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, "ui.global_error", { digest: error.digest });
  }, [error]);

  return (
    <html lang="vi" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "var(--background, #f4f6f8)", color: "var(--text, #172033)" }}>
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "15vh 24px" }}>
          <div style={{ fontSize: 80, fontWeight: 900, color: "var(--accent, #2563eb)" }}>500</div>
          <h1>Không thể tải ứng dụng</h1>
          <p style={{ color: "var(--muted, #667085)", lineHeight: 1.7 }}>Vui lòng thử lại.</p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 20, border: 0, borderRadius: 10, padding: "10px 16px", fontWeight: 700, cursor: "pointer", background: "var(--accent, #2563eb)", color: "#fff" }}
          >
            Thử lại
          </button>
        </main>
      </body>
    </html>
  );
}
