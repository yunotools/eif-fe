import type { InvoiceModeId } from "@modules/hoadondientu.gdt.gov.vn/model/invoice-mode";

const BASE = "/module/hoadondientu.gdt.gov.vn";

export const HDDT_ENDPOINTS = {
  captcha: `${BASE}/captcha`,
  authenticate: `${BASE}/authenticate`,
  session: `${BASE}/session`,
  sessionRefresh: `${BASE}/session/refresh`,

  wrapperQuery: {
    sold: `${BASE}/invoice/wrapper/sold`,
    purchase: `${BASE}/invoice/wrapper/purchase`,
  } satisfies Record<InvoiceModeId, string>,

  wrapperExport: {
    sold: `${BASE}/invoice/wrapper/sold/export`,
    purchase: `${BASE}/invoice/wrapper/purchase/export`,
  } satisfies Record<InvoiceModeId, string>,

  // Các endpoint cũ vẫn được backend giữ để tương thích, nhưng UI không gọi trực tiếp nữa.
  legacy: {
    export: `${BASE}/invoice/export`,
    exportMerged: `${BASE}/invoice/export/merged`,
    query: {
      standardSold: `${BASE}/invoice/sold`,
      standardPurchase: `${BASE}/invoice/purchase`,
      scoSold: `${BASE}/invoice/sco/sold`,
      scoPurchase: `${BASE}/invoice/sco/purchase`,
    },
  },
} as const;
