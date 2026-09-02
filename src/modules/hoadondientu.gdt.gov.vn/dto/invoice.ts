export type InvoiceFilter = {
  shdon?: number;
  khhdon?: string;
  khmshdon?: number;
  nbmst?: string;
  nmmst?: string;
  tthai?: number;
  ttxly?: number;
  unhiem?: number;
  nmcmnd?: string;
};

export type HoaDonQuery = InvoiceFilter & {
  from_date: string;
  to_date: string;
  size?: number;
};

export type ExportInvoiceRequest = InvoiceFilter & {
  from_date: string;
  to_date: string;
  type: "sold" | "purchase";
  sco: boolean;
};

export type InvoiceQueryFailedRange = {
  from_date: string;
  to_date: string;
};

export type InvoiceRecord = Record<string, unknown>;

export type InvoiceQueryResult = {
  from_date: string;
  to_date: string;
  failed_ranges: InvoiceQueryFailedRange[];
  datas: InvoiceRecord[];
  total: number;
  state: unknown;
  time: number;
};
