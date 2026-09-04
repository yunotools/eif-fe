import type { InvoiceMode } from "@modules/hoadondientu.gdt.gov.vn/model/invoice-mode";

export const INVOICE_STATUS = [
  [1, "Hóa đơn mới"],
  [2, "Hóa đơn thay thế"],
  [3, "Hóa đơn điều chỉnh"],
  [4, "Hóa đơn đã bị thay thế"],
  [5, "Hóa đơn đã bị điều chỉnh"],
  [6, "Hóa đơn đã bị hủy"],
] as const;

export const PROCESSING_STATUS = [
  [0, "Cục Thuế đã nhận"],
  [1, "Đang tiến hành kiểm tra điều kiện cấp mã"],
  [2, "CQT từ chối hóa đơn theo từng lần phát sinh"],
  [3, "Hóa đơn đủ điều kiện cấp mã"],
  [4, "Hóa đơn không đủ điều kiện cấp mã"],
  [5, "Đã cấp mã hóa đơn"],
  [6, "Cục Thuế đã nhận không mã"],
  [7, "Đã kiểm tra định kỳ HĐĐT không có mã"],
  [8, "Cục Thuế đã nhận hóa đơn có mã khởi tạo từ máy tính tiền"],
] as const;

export const PURCHASE_PROCESSING_STATUS = PROCESSING_STATUS.filter(
  ([value]) => value === 5 || value === 6 || value === 8,
);

/*
 * Các tab cũ được giữ lại dưới dạng comment để có thể tham chiếu khi cần:
 *
 * export const LEGACY_INVOICE_MODES = [
 *   { id: "standard-sold", shortLabel: "Bán ra", channel: "standard", direction: "sold" },
 *   { id: "standard-purchase", shortLabel: "Mua vào", channel: "standard", direction: "purchase" },
 *   { id: "sco-sold", shortLabel: "MTT bán ra", channel: "sco", direction: "sold" },
 *   { id: "sco-purchase", shortLabel: "MTT mua vào", channel: "sco", direction: "purchase" },
 * ];
 *
 * UI hiện tại chỉ dùng hai wrapper endpoint bên dưới. Mỗi wrapper tự tổng hợp
 * dữ liệu hóa đơn thường + hóa đơn khởi tạo từ máy tính tiền.
 */
export const INVOICE_MODES: InvoiceMode[] = [
  {
    id: "sold",
    label: "Hóa đơn bán ra",
    shortLabel: "Hóa đơn bán ra",
    description: "Gộp hóa đơn bán ra thường và hóa đơn bán ra từ máy tính tiền.",
    direction: "sold",
  },
  {
    id: "purchase",
    label: "Hóa đơn mua vào",
    shortLabel: "Hóa đơn mua vào",
    description: "Gộp hóa đơn mua vào thường và hóa đơn mua vào từ máy tính tiền.",
    direction: "purchase",
  },
];
