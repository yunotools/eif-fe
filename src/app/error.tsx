"use client";

import { useEffect } from "react";
import { Button } from "@global/components/button";
import { reportError } from "@global/error/error-handler";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, "ui.route_error", { digest: error.digest });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[68vh] max-w-2xl flex-col justify-center py-16">
      <p className="eif-eyebrow">Lỗi</p>
      <h1 className="mt-2 text-4xl font-black">Không thể tải trang</h1>
      <p className="mt-4 text-[var(--muted)]">Vui lòng thử lại.</p>
      <div className="mt-6">
        <Button type="button" onClick={reset}>Thử lại</Button>
      </div>
    </div>
  );
}
