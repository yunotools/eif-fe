import {
  INVOICE_STATUS,
  PROCESSING_STATUS,
} from "@modules/hoadondientu.gdt.gov.vn/lib/constants";
import type { InvoiceRecord } from "@modules/hoadondientu.gdt.gov.vn/dto/invoice";

export function textValue(record: InvoiceRecord, key: string): string {
  const value = record[key];
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

export function numericValue(
  record: InvoiceRecord,
  key: string,
): number | null {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function statusLabel(value: unknown): string {
  if (typeof value !== "number")
    return value === null || value === undefined ? "-" : String(value);
  return INVOICE_STATUS.find(([code]) => code === value)?.[1] ?? String(value);
}

export function processingLabel(value: unknown): string {
  if (typeof value !== "number")
    return value === null || value === undefined ? "-" : String(value);
  return (
    PROCESSING_STATUS.find(([code]) => code === value)?.[1] ?? String(value)
  );
}
