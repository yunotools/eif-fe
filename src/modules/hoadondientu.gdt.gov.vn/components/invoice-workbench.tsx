"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@global/components/button";
import { Card } from "@global/components/card";
import { ErrorNotice } from "@global/components/error-notice";
import { Notice } from "@global/components/notice";
import { formatNumber } from "@global/utils/format";
import { InvoiceFilterForm } from "@modules/hoadondientu.gdt.gov.vn/components/invoice-filter-form";
import { InvoiceTable } from "@modules/hoadondientu.gdt.gov.vn/components/invoice-table";
import type { HoaDonQuery } from "@modules/hoadondientu.gdt.gov.vn/dto/invoice";
import { useExport } from "@modules/hoadondientu.gdt.gov.vn/hooks/use-export";
import { useInvoiceFilterForm } from "@modules/hoadondientu.gdt.gov.vn/hooks/use-invoice-filter-form";
import { useInvoiceQuery } from "@modules/hoadondientu.gdt.gov.vn/hooks/use-invoice-query";
import { INVOICE_MODES } from "@modules/hoadondientu.gdt.gov.vn/lib/constants";
import {
  toExportPayload,
  toQueryPayload,
} from "@modules/hoadondientu.gdt.gov.vn/lib/mappers";
import type { InvoiceMode } from "@modules/hoadondientu.gdt.gov.vn/model/invoice-mode";
import { useHddtSession } from "@modules/hoadondientu.gdt.gov.vn/providers/session-provider";

const FILTER_FORM_ID = "invoice-filter-form";

function AuthenticatedInvoiceWorkbench({ sessionId }: { sessionId: string }) {
  const [mode, setMode] = useState<InvoiceMode>(INVOICE_MODES[0]!);
  const { form, change, reset } = useInvoiceFilterForm();
  const query = useInvoiceQuery(sessionId, mode);
  const exporter = useExport(sessionId);
  const [formError, setFormError] = useState<Error | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState<HoaDonQuery | null>(
    null,
  );

  function changeMode(nextMode: InvoiceMode) {
    if (
      nextMode.direction === "purchase" &&
      form.ttxly !== "" &&
      !["5", "6", "8"].includes(form.ttxly)
    ) {
      change("ttxly", "");
    }

    setMode(nextMode);
    setSubmittedQuery(null);
    query.reset();
    exporter.resetError();
    setFormError(null);
  }

  function executeQuery(payload: HoaDonQuery) {
    void query
      .execute(payload)
      .then((result) => {
        if (result) setSubmittedQuery(payload);
      })
      .catch(() => undefined);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    exporter.resetError();
    setFormError(null);
    try {
      executeQuery(toQueryPayload(form, 1));
    } catch (error) {
      setFormError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  function goToPage(page: number) {
    if (!submittedQuery || query.loading || page < 1) return;
    exporter.resetError();
    setFormError(null);
    executeQuery({ ...submittedQuery, page });
  }

  function resetFilters() {
    reset();
    setSubmittedQuery(null);
    query.reset();
    exporter.resetError();
    setFormError(null);
  }

  function exportFile() {
    setFormError(null);
    try {
      const payload = toExportPayload(form);
      void exporter.execute(mode, payload).catch(() => undefined);
    } catch (error) {
      setFormError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  const displayedCount = query.data?.datas?.length ?? 0;
  const hasFailedRanges = (query.data?.failed_ranges?.length ?? 0) > 0;
  const pagination = query.data?.pagination;
  const totalPagesLabel = pagination
    ? `${pagination.total_pages}${pagination.truncated ? "+" : ""}`
    : "0";

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-bold">Loại hóa đơn</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Mỗi tab tự tổng hợp dữ liệu hóa đơn thường và hóa đơn khởi tạo từ
              máy tính tiền.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {/*
              Bốn tab cũ đã được comment tại lib/constants.ts:
              Bán ra / Mua vào / MTT bán ra / MTT mua vào.
            */}
            {INVOICE_MODES.map((item) => (
              <Button
                key={item.id}
                type="button"
                variant={mode.id === item.id ? "primary" : "secondary"}
                onClick={() => changeMode(item)}
              >
                {item.shortLabel}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-6 flex flex-col gap-4 border-b border-[var(--border)] pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold">{mode.label}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {mode.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" form={FILTER_FORM_ID} busy={query.loading}>
              Tra cứu {mode.shortLabel}
            </Button>
            <Button type="button" variant="secondary" onClick={resetFilters}>
              Đặt lại
            </Button>

            {/*
              Nút xuất trực tiếp/chia file cũ được giữ lại dưới dạng comment theo yêu cầu.

              <Button
                type="button"
                variant="secondary"
                busy={exporter.loading}
                onClick={() => exportFileLegacy(false)}
              >
                Xuất file
              </Button>
            */}
            <Button
              type="button"
              variant="secondary"
              busy={exporter.loading}
              onClick={exportFile}
            >
              Xuất file
            </Button>
          </div>
        </div>

        <InvoiceFilterForm
          id={FILTER_FORM_ID}
          form={form}
          mode={mode}
          onChange={change}
          onSubmit={submit}
        />

        {formError ? (
          <div className="mt-4">
            <Notice tone="danger">{formError.message}</Notice>
          </div>
        ) : null}
        {exporter.error ? (
          <div className="mt-4">
            <ErrorNotice value={exporter.error} />
          </div>
        ) : null}
      </Card>

      <Card>
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-bold">Kết quả</h2>
            {query.data ? (
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
                <span>Tổng: {formatNumber(query.data.total)}</span>
                <span>Trang này: {formatNumber(displayedCount)}</span>
                <span>{query.data.pagination.page_size} bản ghi / trang</span>
              </div>
            ) : null}
          </div>

          {pagination && pagination.total_pages > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                className="min-h-9 px-3 text-xs"
                disabled={!pagination.has_previous || query.loading}
                onClick={() => goToPage(pagination.page - 1)}
              >
                ← Trang trước
              </Button>
              <div className="min-w-24 text-center text-xs font-bold tabular-nums">
                Trang {pagination.page} / {totalPagesLabel}
              </div>
              <Button
                type="button"
                variant="secondary"
                className="min-h-9 px-3 text-xs"
                disabled={!pagination.has_next || query.loading}
                onClick={() => goToPage(pagination.page + 1)}
              >
                Trang sau →
              </Button>
            </div>
          ) : null}
        </div>

        {query.error ? (
          <div className="mb-4">
            <ErrorNotice value={query.error} />
          </div>
        ) : null}

        {pagination?.truncated ? (
          <div className="mb-4">
            <Notice tone="warning">
              Kết quả rất lớn hoặc có một khoảng dữ liệu vượt khả năng phân
              trang chính xác của API công khai. EIF giới hạn tối đa 100 trang
              đầu để tránh tạo quá nhiều request tới hệ thống Thuế.
            </Notice>
          </div>
        ) : null}

        {query.data && displayedCount === 0 ? (
          <div className="mb-4">
            <Notice tone={hasFailedRanges ? "warning" : "info"}>
              {hasFailedRanges
                ? "Không có dữ liệu để hiển thị; một số nguồn dữ liệu chưa tải được. Vui lòng thử lại."
                : "Không có dữ liệu phù hợp với điều kiện tra cứu."}
            </Notice>
          </div>
        ) : hasFailedRanges ? (
          <div className="mb-4">
            <Notice tone="warning">
              Một phần dữ liệu chưa tải được. Vui lòng thử lại.
            </Notice>
          </div>
        ) : null}

        <InvoiceTable datas={query.data?.datas ?? []} />
      </Card>
    </div>
  );
}

export function InvoiceWorkbench() {
  const { session } = useHddtSession();
  if (!session) return null;
  return <AuthenticatedInvoiceWorkbench sessionId={session.id} />;
}
