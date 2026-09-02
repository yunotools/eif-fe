"use client";

import { useEffect, type ReactNode } from "react";
import { reportError } from "@global/error/error-handler";

export function ErrorObserverProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      reportError(event.error ?? new Error(event.message), "browser.uncaught");
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      reportError(event.reason, "browser.unhandled_rejection");
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return children;
}
