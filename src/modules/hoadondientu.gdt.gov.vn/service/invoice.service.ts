import {
  requestFile,
  requestJson,
  type DownloadResponse,
} from "@global/protocol/http-client";
import { appErrorFromCode } from "@global/error/app-error";
import { ERROR_CODES } from "@global/error/error-code";
import type {
  ExportInvoiceWrapperRequest,
  HoaDonQuery,
  InvoicePagination,
  InvoiceQueryFailedRange,
  InvoiceQueryResult,
  InvoiceRecord,
} from "@modules/hoadondientu.gdt.gov.vn/dto/invoice";
import { HDDT_ENDPOINTS } from "@modules/hoadondientu.gdt.gov.vn/lib/endpoints";
import { QUERY_RESULT_SIZE } from "@modules/hoadondientu.gdt.gov.vn/lib/mappers";
import type { InvoiceMode } from "@modules/hoadondientu.gdt.gov.vn/model/invoice-mode";

type InvoiceQueryResponse = Partial<
  Omit<InvoiceQueryResult, "datas" | "failed_ranges" | "pagination">
> & {
  datas?: InvoiceRecord[] | null;
  failed_ranges?: InvoiceQueryFailedRange[] | null;
  pagination?: Partial<InvoicePagination> | null;
};

function finiteInteger(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isSafeInteger(value)
    ? value
    : fallback;
}

function normalizePagination(
  response: InvoiceQueryResponse,
  payload: HoaDonQuery,
  total: number,
): InvoicePagination {
  const fallbackPage = Math.max(1, finiteInteger(payload.page, 1));
  const fallbackPageSize = QUERY_RESULT_SIZE;
  const fallbackTotalPages =
    total > 0 ? Math.ceil(total / fallbackPageSize) : 0;
  const value = response.pagination;

  if (!value || typeof value !== "object") {
    return {
      page: fallbackPage,
      page_size: fallbackPageSize,
      total_pages: fallbackTotalPages,
      has_previous: fallbackPage > 1,
      has_next: fallbackPage < fallbackTotalPages,
      truncated: false,
    };
  }

  const page = Math.max(1, finiteInteger(value.page, fallbackPage));
  const pageSize = Math.max(
    1,
    finiteInteger(value.page_size, fallbackPageSize),
  );
  const totalPages = Math.max(
    0,
    finiteInteger(value.total_pages, fallbackTotalPages),
  );

  return {
    page,
    page_size: pageSize,
    total_pages: totalPages,
    has_previous:
      typeof value.has_previous === "boolean" ? value.has_previous : page > 1,
    has_next:
      typeof value.has_next === "boolean" ? value.has_next : page < totalPages,
    truncated: value.truncated === true,
  };
}

function normalizeQueryResult(
  response: InvoiceQueryResponse | null | undefined,
  payload: HoaDonQuery,
): InvoiceQueryResult {
  if (!response || typeof response !== "object") {
    throw appErrorFromCode(ERROR_CODES.invalidResponse, {
      details: { reason: "Invoice query response is not an object." },
    });
  }

  const total =
    typeof response.total === "number" && Number.isFinite(response.total)
      ? response.total
      : 0;

  return {
    from_date:
      typeof response.from_date === "string"
        ? response.from_date
        : payload.from_date,
    to_date:
      typeof response.to_date === "string" ? response.to_date : payload.to_date,
    failed_ranges: Array.isArray(response.failed_ranges)
      ? response.failed_ranges
      : [],
    datas: Array.isArray(response.datas) ? response.datas : [],
    total,
    state: response.state ?? null,
    time:
      typeof response.time === "number" && Number.isFinite(response.time)
        ? response.time
        : 0,
    pagination: normalizePagination(response, payload, total),
  };
}

export async function queryInvoices(
  sessionId: string,
  mode: InvoiceMode,
  payload: HoaDonQuery,
  signal?: AbortSignal,
): Promise<InvoiceQueryResult> {
  const response = await requestJson<InvoiceQueryResponse>(
    HDDT_ENDPOINTS.wrapperQuery[mode.id],
    {
      method: "POST",
      body: payload,
      sessionId,
      sessionAware: true,
      signal,
    },
  );

  return normalizeQueryResult(response, payload);
}

export function exportInvoices(
  sessionId: string,
  mode: InvoiceMode,
  payload: ExportInvoiceWrapperRequest,
  signal?: AbortSignal,
): Promise<DownloadResponse> {
  return requestFile(HDDT_ENDPOINTS.wrapperExport[mode.id], {
    method: "POST",
    body: payload,
    sessionId,
    sessionAware: true,
    signal,
  });
}
