"use client";

import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Button } from "@global/components/button";
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

export function InvoiceFilterForm({
  form,
  mode,
  loading,
  onChange,
  onSubmit,
  onReset,
}: {
  form: InvoiceFilterFormState;
  mode: InvoiceMode;
  loading: boolean;
  onChange: (field: FilterField, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}) {
  const inputChange =
    (field: FilterField) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      onChange(field, event.target.value);

  const selectChange =
    (field: FilterField) =>
    (event: ChangeEvent<HTMLSelectElement>) =>
      onChange(field, event.target.value);

  const processingStatuses =
    mode.direction === "purchase" ? PURCHASE_PROCESSING_STATUS : PROCESSING_STATUS;

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      <div className="eif-filter-grid xl:grid-cols-2">
        <div className="eif-filter-row xl:col-span-2">
          <span className="eif-filter-row-label">Ngày lập hóa đơn</span>
          <div className="eif-date-range eif-filter-control">
            <label className="grid gap-1">
              <span className="text-[11px] font-semibold text-[var(--muted)]">Từ ngày</span>
              <input
                id="invoice-from-date"
                className="eif-input"
                type="date"
                value={form.from_date}
                onChange={inputChange("from_date")}
                required
              />
            </label>
            <span className="eif-date-separator" aria-hidden="true">đến</span>
            <label className="grid gap-1">
              <span className="text-[11px] font-semibold text-[var(--muted)]">Đến ngày</span>
              <input
                id="invoice-to-date"
                className="eif-input"
                type="date"
                value={form.to_date}
                onChange={inputChange("to_date")}
                required
              />
            </label>
          </div>
        </div>

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
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
        <Button type="submit" busy={loading}>
          Tra cứu {mode.shortLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onReset}>
          Đặt lại
        </Button>
      </div>
    </form>
  );
}
