export type InvoiceFilter = {
  shdon?: number;
  khhdon?: string;
  khmshdon?: number;
  nbmst?: string;
  nmmst?: string;
  tthai?: number;
  ttxly?: number;
  unhiem?: number;

  // Bộ lọc CCCD (nmcmnd) tạm thời không hiển thị/gửi từ frontend.
  // Backend vẫn giữ field này để tương thích với API cũ.
  // nmcmnd?: string;
};

export type HoaDonQuery = InvoiceFilter & {
  from_date: string;
  to_date: string;
  page?: number;
  size?: number;
};

export type ExportInvoiceWrapperRequest = InvoiceFilter & {
  from_date: string;
  to_date: string;
};

/*
 * DTO export cũ được giữ làm tham chiếu cho các endpoint legacy:
 * type ExportInvoiceRequest = InvoiceFilter & {
 *   from_date: string;
 *   to_date: string;
 *   type: "sold" | "purchase";
 *   sco: boolean;
 * };
 */

export type InvoiceQueryFailedRange = {
  from_date: string;
  to_date: string;
};

export type InvoiceRecord = Record<string, unknown>;

export type InvoicePagination = {
  page: number;
  page_size: number;
  total_pages: number;
  has_previous: boolean;
  has_next: boolean;
  truncated: boolean;
};

export type InvoiceQueryResult = {
  from_date: string;
  to_date: string;
  failed_ranges: InvoiceQueryFailedRange[];
  datas: InvoiceRecord[];
  total: number;
  state: unknown;
  time: number;
  pagination: InvoicePagination;
};
