"use client";

import type { ChangeEvent, FormEvent, ReactNode } from "react";
import {
  displayDateToISO,
  formatDateForDisplay,
  normalizeDateDisplayInput,
} from "@global/utils/date";
import {
  INVOICE_STATUS,
  PROCESSING_STATUS,
  PURCHASE_PROCESSING_STATUS,
} from "@modules/hoadondientu.gdt.gov.vn/lib/constants";
import type { InvoiceFilterFormState } from "@modules/hoadondientu.gdt.gov.vn/lib/mappers";
import type { InvoiceMode } from "@modules/hoadondientu.gdt.gov.vn/model/invoice-mode";

export type FilterField = keyof InvoiceFilterFormState;

function FilterRow({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="eif-filter-row">
      <label htmlFor={id} className="eif-filter-row-label">
        {label}
      </label>
      <div className="eif-filter-control">{children}</div>
    </div>
  );
}

function DateInput({
  id,
  value,
  onChange,
  label,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const isoValue = displayDateToISO(value) ?? "";

  return (
    <div className="relative">
      <input
        id={id}
        className="eif-input pr-12 tabular-nums"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={10}
        placeholder="DD/MM/YYYY"
        value={value}
        onChange={(event) =>
          onChange(normalizeDateDisplayInput(event.target.value))
        }
        required
      />

      <span
        className="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--muted)]"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M7 3v3M17 3v3M4.5 9.5h15" strokeLinecap="round" />
          <rect x="4.5" y="5.5" width="15" height="14" rx="2.5" />
        </svg>
      </span>

      {/*
        Native date input chỉ phủ lên vùng icon lịch. End-user vẫn thấy/nhập
        DD/MM/YYYY ở input text nhưng khi bấm icon sẽ dùng calendar picker
        của browser/OS.
      */}
      <input
        type="date"
        className="absolute inset-y-0 right-0 w-11 cursor-pointer opacity-0"
        value={isoValue}
        onChange={(event) => {
          if (event.target.value)
            onChange(formatDateForDisplay(event.target.value));
        }}
        aria-label={`Chọn ${label} từ lịch`}
        title={`Chọn ${label} từ lịch`}
      />
    </div>
  );
}

function SectionTitle({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-1 flex items-baseline justify-between gap-3">
      <h3 className="text-sm font-black">{children}</h3>
      {hint ? (
        <span className="text-[10px] font-semibold text-[var(--muted)]">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

export function InvoiceFilterForm({
  id,
  form,
  mode,
  onChange,
  onSubmit,
}: {
  id: string;
  form: InvoiceFilterFormState;
  mode: InvoiceMode;
  onChange: (field: FilterField, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const inputChange =
    (field: FilterField) => (event: ChangeEvent<HTMLInputElement>) =>
      onChange(field, event.target.value);

  const selectChange =
    (field: FilterField) => (event: ChangeEvent<HTMLSelectElement>) =>
      onChange(field, event.target.value);

  const processingStatuses =
    mode.direction === "purchase"
      ? PURCHASE_PROCESSING_STATUS
      : PROCESSING_STATUS;

  return (
    <form
      id={id}
      className="grid gap-0 xl:grid-cols-[1.15fr_0.78fr_1fr]"
      onSubmit={onSubmit}
    >
      <section className="grid content-start gap-3 pb-5 xl:pb-0 xl:pr-7">
        <SectionTitle>Thông tin hóa đơn</SectionTitle>

        <FilterRow id="invoice-number" label="Số hóa đơn">
          <input
            id="invoice-number"
            className="eif-input"
            type="number"
            min="0"
            value={form.shdon}
            onChange={inputChange("shdon")}
            placeholder="Nhập số hóa đơn"
          />
        </FilterRow>

        <FilterRow id="invoice-symbol" label="Ký hiệu hóa đơn">
          <input
            id="invoice-symbol"
            className="eif-input"
            value={form.khhdon}
            onChange={inputChange("khhdon")}
            placeholder="Ví dụ: C26TER"
          />
        </FilterRow>

        <FilterRow id="invoice-template" label="Ký hiệu mẫu số hóa đơn">
          <input
            id="invoice-template"
            className="eif-input"
            type="number"
            min="0"
            value={form.khmshdon}
            onChange={inputChange("khmshdon")}
            placeholder="Nhập mẫu số"
          />
        </FilterRow>

        <FilterRow id="seller-tax-code" label="MST người bán">
          <input
            id="seller-tax-code"
            className="eif-input"
            value={form.nbmst}
            onChange={inputChange("nbmst")}
            inputMode="numeric"
            placeholder="Nhập MST người bán"
          />
        </FilterRow>

        <FilterRow id="buyer-tax-code" label="MST người mua">
          <input
            id="buyer-tax-code"
            className="eif-input"
            value={form.nmmst}
            onChange={inputChange("nmmst")}
            inputMode="numeric"
            placeholder="Nhập MST người mua"
          />
        </FilterRow>

        {/*
          Bộ lọc CCCD người mua tạm thời không dùng trên frontend.
          Backend vẫn giữ nmcmnd để tương thích với API cũ.

          <FilterRow id="buyer-id" label="CCCD người mua">
            <input
              id="buyer-id"
              className="eif-input"
              value={form.nmcmnd}
              onChange={inputChange("nmcmnd")}
              inputMode="numeric"
              placeholder="Nhập CCCD người mua"
            />
          </FilterRow>
        */}
      </section>

      <section className="grid content-start gap-3 border-t border-[var(--border)] py-5 xl:border-l xl:border-t-0 xl:px-7 xl:py-0">
        <SectionTitle hint="DD/MM/YYYY">Ngày lập hóa đơn</SectionTitle>

        <div className="grid gap-1.5">
          <label
            htmlFor="invoice-from-date"
            className="text-[11px] font-semibold text-[var(--muted)]"
          >
            Từ ngày
          </label>
          <DateInput
            id="invoice-from-date"
            label="Từ ngày"
            value={form.from_date}
            onChange={(value) => onChange("from_date", value)}
          />
        </div>

        <div className="grid gap-1.5">
          <label
            htmlFor="invoice-to-date"
            className="text-[11px] font-semibold text-[var(--muted)]"
          >
            Đến ngày
          </label>
          <DateInput
            id="invoice-to-date"
            label="Đến ngày"
            value={form.to_date}
            onChange={(value) => onChange("to_date", value)}
          />
        </div>

        <p className="text-[11px] leading-5 text-[var(--muted)]">
          Nhập DD/MM/YYYY hoặc bấm biểu tượng lịch để chọn ngày. EIF sẽ tự
          chuyển sang định dạng API khi tra cứu.
        </p>
      </section>

      <section className="grid content-start gap-3 border-t border-[var(--border)] pt-5 xl:border-l xl:border-t-0 xl:pl-7 xl:pt-0">
        <SectionTitle>Trạng thái</SectionTitle>

        <FilterRow id="delegated-invoice" label="Hóa đơn ủy nhiệm">
          <select
            id="delegated-invoice"
            className="eif-input"
            value={form.unhiem}
            onChange={selectChange("unhiem")}
          >
            <option value="">Tất cả</option>
            <option value="0">Không</option>
            <option value="1">Có</option>
          </select>
        </FilterRow>

        <FilterRow id="invoice-status" label="Trạng thái hóa đơn">
          <select
            id="invoice-status"
            className="eif-input"
            value={form.tthai}
            onChange={selectChange("tthai")}
          >
            <option value="">Tất cả</option>
            {INVOICE_STATUS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FilterRow>

        <FilterRow id="processing-status" label="Kết quả kiểm tra">
          <select
            id="processing-status"
            className="eif-input"
            value={form.ttxly}
            onChange={selectChange("ttxly")}
          >
            <option value="">Tất cả</option>
            {processingStatuses.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FilterRow>

        {/*
          Số bản ghi đã được cố định là 50 ở payload và wrapper backend.
          Field nhập tay cũ được giữ lại dưới dạng comment theo yêu cầu.

          <FilterRow id="result-size" label="Số bản ghi">
            <input
              id="result-size"
              className="eif-input"
              type="number"
              min="1"
              max="5000"
              value={form.size}
              onChange={inputChange("size")}
            />
          </FilterRow>
        */}
      </section>
    </form>
  );
}
