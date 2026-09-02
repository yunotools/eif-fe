"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@global/components/button";
import { Card } from "@global/components/card";
import { ErrorNotice } from "@global/components/error-notice";
import { Notice } from "@global/components/notice";
import { formatNumber } from "@global/utils/format";
import { InvoiceFilterForm } from "@modules/hoadondientu.gdt.gov.vn/components/invoice-filter-form";
import { InvoiceTable } from "@modules/hoadondientu.gdt.gov.vn/components/invoice-table";
import { useExport } from "@modules/hoadondientu.gdt.gov.vn/hooks/use-export";
import { useInvoiceFilterForm } from "@modules/hoadondientu.gdt.gov.vn/hooks/use-invoice-filter-form";
import { useInvoiceQuery } from "@modules/hoadondientu.gdt.gov.vn/hooks/use-invoice-query";
import { INVOICE_MODES } from "@modules/hoadondientu.gdt.gov.vn/lib/constants";
import { toExportPayload, toQueryPayload } from "@modules/hoadondientu.gdt.gov.vn/lib/mappers";
import type { InvoiceMode } from "@modules/hoadondientu.gdt.gov.vn/model/invoice-mode";
import { useHddtSession } from "@modules/hoadondientu.gdt.gov.vn/providers/session-provider";

function AuthenticatedInvoiceWorkbench({ sessionId }: { sessionId: string }) {
  const [mode, setMode] = useState<InvoiceMode>(INVOICE_MODES[0]!);
  const { form, change, reset } = useInvoiceFilterForm();
  const query = useInvoiceQuery(sessionId, mode);
  const exporter = useExport(sessionId);
  const [formError, setFormError] = useState<Error | null>(null);

  function changeMode(nextMode: InvoiceMode) {
    if (
      nextMode.direction === "purchase" &&
      form.ttxly !== "" &&
      !["5", "6", "8"].includes(form.ttxly)
    ) {
      change("ttxly", "");
    }

    setMode(nextMode);
    query.reset();
    exporter.resetError();
    setFormError(null);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    try {
      const payload = toQueryPayload(form);
      void query.execute(payload).catch(() => undefined);
    } catch (error) {
      setFormError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  function exportFile(merged: boolean) {
    setFormError(null);
    try {
      const payload = toExportPayload(form, mode);
      void exporter.execute(payload, merged).catch(() => undefined);
    } catch (error) {
      setFormError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-xl font-bold">Loại hóa đơn</h2>
          <div className="flex flex-wrap gap-2">
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
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-bold">{mode.label}</h2>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" busy={exporter.loading} onClick={() => exportFile(false)}>
              Xuất file
            </Button>
            <Button type="button" busy={exporter.loading} onClick={() => exportFile(true)}>
              Xuất gộp
            </Button>
          </div>
        </div>

        <InvoiceFilterForm
          form={form}
          mode={mode}
          loading={query.loading}
          onChange={change}
          onSubmit={submit}
          onReset={() => {
            reset();
            query.reset();
          }}
        />

        {formError ? <div className="mt-4"><Notice tone="danger">{formError.message}</Notice></div> : null}
        {exporter.error ? <div className="mt-4"><ErrorNotice value={exporter.error} /></div> : null}
      </Card>

      <Card>
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="text-xl font-bold">Kết quả</h2>
          {query.data ? (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
              <span>Tổng: {formatNumber(query.data.total)}</span>
              <span>Hiển thị: {formatNumber(query.data.datas?.length ?? 0)}</span>
            </div>
          ) : null}
        </div>

        {query.error ? <div className="mb-4"><ErrorNotice value={query.error} /></div> : null}
        {query.data?.failed_ranges?.length ? (
          <div className="mb-4">
            <Notice tone="warning">Một phần dữ liệu chưa tải được. Vui lòng thử lại.</Notice>
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
