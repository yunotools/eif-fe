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

export const INVOICE_MODES: InvoiceMode[] = [
  {
    id: "standard-sold",
    label: "Hóa đơn bán ra",
    shortLabel: "Bán ra",
    description: "Hóa đơn điện tử bán ra tiêu chuẩn",
    direction: "sold",
    channel: "standard",
    sco: false,
  },
  {
    id: "standard-purchase",
    label: "Hóa đơn mua vào",
    shortLabel: "Mua vào",
    description: "Hóa đơn điện tử mua vào tiêu chuẩn",
    direction: "purchase",
    channel: "standard",
    sco: false,
  },
  {
    id: "sco-sold",
    label: "Bán ra từ máy tính tiền",
    shortLabel: "MTT bán ra",
    description: "Hóa đơn bán ra khởi tạo từ máy tính tiền",
    direction: "sold",
    channel: "sco",
    sco: true,
  },
  {
    id: "sco-purchase",
    label: "Mua vào từ máy tính tiền",
    shortLabel: "MTT mua vào",
    description: "Hóa đơn mua vào có mã khởi tạo từ máy tính tiền",
    direction: "purchase",
    channel: "sco",
    sco: true,
  },
];
