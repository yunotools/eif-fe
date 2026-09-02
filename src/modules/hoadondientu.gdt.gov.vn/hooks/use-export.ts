"use client";

import { useCallback, useRef, useState } from "react";
import { toAppError } from "@global/error/error-handler";
import { downloadBlob, extensionFromContentType } from "@global/utils/download";
import type { ExportInvoiceRequest } from "@modules/hoadondientu.gdt.gov.vn/dto/invoice";
import { exportInvoices } from "@modules/hoadondientu.gdt.gov.vn/service/invoice.service";

type ExportState = {
  loading: boolean;
  error: Error | null;
};

export function useExport(sessionId: string | undefined) {
  const [state, setState] = useState<ExportState>({ loading: false, error: null });
  const controllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (payload: ExportInvoiceRequest, merged: boolean) => {
      if (!sessionId) throw new Error("Bạn chưa có EIF session.");

      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      setState({ loading: true, error: null });

      try {
        const file = await exportInvoices(sessionId, payload, merged, controller.signal);
        const fallbackExtension = extensionFromContentType(file.contentType);
        const fallbackName = merged
          ? `hddtgdt-${payload.sco ? "sco" : "standard"}-${payload.type}-merged-${payload.from_date}_${payload.to_date}.xlsx`
          : `hddtgdt-${payload.sco ? "sco" : "standard"}-${payload.type}-export-${payload.from_date}_${payload.to_date}.${fallbackExtension}`;
        downloadBlob(file.blob, file.filename || fallbackName);
        setState({ loading: false, error: null });
      } catch (value) {
        if (value instanceof DOMException && value.name === "AbortError") return;
        const error = toAppError(value);
        setState({ loading: false, error });
        throw error;
      }
    },
    [sessionId],
  );

  const resetError = useCallback(() => setState((current) => ({ ...current, error: null })), []);

  return { ...state, execute, resetError };
}
