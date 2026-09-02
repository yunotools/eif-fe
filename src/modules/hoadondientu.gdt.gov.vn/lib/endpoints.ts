import type { InvoiceModeId } from "@modules/hoadondientu.gdt.gov.vn/model/invoice-mode";

const BASE = "/module/hoadondientu.gdt.gov.vn";

export const HDDT_ENDPOINTS = {
  captcha: `${BASE}/captcha`,
  authenticate: `${BASE}/authenticate`,
  session: `${BASE}/session`,
  sessionRefresh: `${BASE}/session/refresh`,
  export: `${BASE}/invoice/export`,
  exportMerged: `${BASE}/invoice/export/merged`,
  query: {
    "standard-sold": `${BASE}/invoice/sold`,
    "standard-purchase": `${BASE}/invoice/purchase`,
    "sco-sold": `${BASE}/invoice/sco/sold`,
    "sco-purchase": `${BASE}/invoice/sco/purchase`,
  } satisfies Record<InvoiceModeId, string>,
} as const;
