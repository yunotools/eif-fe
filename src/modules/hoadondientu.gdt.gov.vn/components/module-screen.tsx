"use client";

import { Spinner } from "@global/components/spinner";
import { AuthPanel } from "@modules/hoadondientu.gdt.gov.vn/components/auth-panel";
import { InvoiceWorkbench } from "@modules/hoadondientu.gdt.gov.vn/components/invoice-workbench";
import { SessionPanel } from "@modules/hoadondientu.gdt.gov.vn/components/session-panel";
import { useHddtSession } from "@modules/hoadondientu.gdt.gov.vn/providers/session-provider";

export function ModuleScreen() {
  const { phase, session } = useHddtSession();

  return (
    <div className="grid gap-5">
      <header className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="eif-eyebrow">HĐĐT</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          Hóa đơn điện tử Tổng cục Thuế
        </h1>
      </header>

      {phase === "booting" ? <Spinner label="Đang kiểm tra phiên..." /> : null}
      {!session && phase !== "booting" ? <AuthPanel /> : null}
      <SessionPanel />
      <InvoiceWorkbench />
    </div>
  );
}
