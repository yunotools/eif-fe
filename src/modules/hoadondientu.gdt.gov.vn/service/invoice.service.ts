import { requestFile, requestJson, type DownloadResponse } from "@global/protocol/http-client";
import type {
  ExportInvoiceRequest,
  HoaDonQuery, InvoiceQueryFailedRange,
  InvoiceQueryResult, InvoiceRecord,
} from "@modules/hoadondientu.gdt.gov.vn/dto/invoice";
import { HDDT_ENDPOINTS } from "@modules/hoadondientu.gdt.gov.vn/lib/endpoints";
import type { InvoiceMode } from "@modules/hoadondientu.gdt.gov.vn/model/invoice-mode";
import {appErrorFromCode} from "@global/error/app-error";
import {ERROR_CODES} from "@global/error/error-code";

type InvoiceQueryResponse = Partial<
    Omit<InvoiceQueryResult, "datas" | "failed_ranges">
> & {
  datas?: InvoiceRecord[] | null;
  failed_ranges?: InvoiceQueryFailedRange[] | null;
};

function normalizeQueryResult(
    response: InvoiceQueryResponse | null | undefined,
    payload: HoaDonQuery,
): InvoiceQueryResult {
  if (!response || typeof response !== "object") {
    throw appErrorFromCode(ERROR_CODES.invalidResponse, {
      details: { reason: "Invoice query response is not an object." },
    });
  }

  return {
    from_date:
        typeof response.from_date === "string" ? response.from_date : payload.from_date,
    to_date: typeof response.to_date === "string" ? response.to_date : payload.to_date,
    failed_ranges: Array.isArray(response.failed_ranges) ? response.failed_ranges : [],
    datas: Array.isArray(response.datas) ? response.datas : [],
    total:
        typeof response.total === "number" && Number.isFinite(response.total)
            ? response.total
            : 0,
    state: response.state ?? null,
    time:
        typeof response.time === "number" && Number.isFinite(response.time)
            ? response.time
            : 0,
  };
}

export async function queryInvoices(
  sessionId: string,
  mode: InvoiceMode,
  payload: HoaDonQuery,
  signal?: AbortSignal,
): Promise<InvoiceQueryResult> {
  const response = await requestJson<InvoiceQueryResponse>(HDDT_ENDPOINTS.query[mode.id], {
    method: "POST",
    body: payload,
    sessionId,
    sessionAware: true,
    signal,
  });

  return normalizeQueryResult(response, payload);
}

export function exportInvoices(
  sessionId: string,
  payload: ExportInvoiceRequest,
  merged: boolean,
  signal?: AbortSignal,
): Promise<DownloadResponse> {
  return requestFile(merged ? HDDT_ENDPOINTS.exportMerged : HDDT_ENDPOINTS.export, {
    method: "POST",
    body: payload,
    sessionId,
    sessionAware: true,
    signal,
  });
}
