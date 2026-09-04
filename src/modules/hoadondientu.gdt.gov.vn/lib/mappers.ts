import { displayDateToISO } from "@global/utils/date";
import type {
  ExportInvoiceWrapperRequest,
  HoaDonQuery,
  InvoiceFilter,
} from "@modules/hoadondientu.gdt.gov.vn/dto/invoice";

export const QUERY_RESULT_SIZE = 50;

export type InvoiceFilterFormState = {
  from_date: string;
  to_date: string;
  shdon: string;
  khhdon: string;
  khmshdon: string;
  nbmst: string;
  nmmst: string;
  tthai: string;
  ttxly: string;
  unhiem: string;

  // CCCD người mua tạm thời không dùng trên frontend.
  // nmcmnd: string;

  // Số bản ghi không còn là field nhập tay; wrapper cố định ở QUERY_RESULT_SIZE = 50.
  // size: string;
};

export const EMPTY_FILTER_FORM: InvoiceFilterFormState = {
  from_date: "",
  to_date: "",
  shdon: "",
  khhdon: "",
  khmshdon: "",
  nbmst: "",
  nmmst: "",
  tthai: "",
  ttxly: "",
  unhiem: "",
};

const taxCodePattern = /^[0-9-]{1,32}$/;
const invoiceSymbolPattern = /^[A-Za-z0-9._/-]{1,64}$/;

function optionalInteger(value: string, label: string): number | undefined {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${label} phải là số nguyên hợp lệ.`);
  }
  return parsed;
}

function validateRange(
  value: number | undefined,
  minimum: number,
  maximum: number,
  label: string,
): void {
  if (value === undefined) return;
  if (value < minimum || value > maximum) {
    throw new Error(`${label} phải nằm trong khoảng ${minimum} đến ${maximum}.`);
  }
}

function validatePattern(value: string, pattern: RegExp, message: string): void {
  if (value && !pattern.test(value)) throw new Error(message);
}

function compactFilter(form: InvoiceFilterFormState): InvoiceFilter {
  const shdon = optionalInteger(form.shdon, "Số hóa đơn");
  const khmshdon = optionalInteger(form.khmshdon, "Ký hiệu mẫu số");
  const tthai = optionalInteger(form.tthai, "Trạng thái hóa đơn");
  const ttxly = optionalInteger(form.ttxly, "Kết quả kiểm tra");
  const unhiem = optionalInteger(form.unhiem, "Hóa đơn ủy nhiệm");
  const khhdon = form.khhdon.trim();
  const nbmst = form.nbmst.trim();
  const nmmst = form.nmmst.trim();

  if (shdon !== undefined && shdon < 0) {
    throw new Error("Số hóa đơn phải lớn hơn hoặc bằng 0.");
  }
  if (khmshdon !== undefined && khmshdon < 0) {
    throw new Error("Ký hiệu mẫu số phải lớn hơn hoặc bằng 0.");
  }

  validateRange(tthai, 1, 6, "Trạng thái hóa đơn");
  validateRange(ttxly, 0, 8, "Kết quả kiểm tra");
  validateRange(unhiem, 0, 1, "Hóa đơn ủy nhiệm");
  validatePattern(khhdon, invoiceSymbolPattern, "Ký hiệu hóa đơn chứa ký tự không được backend hỗ trợ.");
  validatePattern(nbmst, taxCodePattern, "MST người bán chỉ được gồm chữ số và dấu gạch ngang.");
  validatePattern(nmmst, taxCodePattern, "MST người mua chỉ được gồm chữ số và dấu gạch ngang.");

  return {
    shdon,
    khhdon: khhdon || undefined,
    khmshdon,
    nbmst: nbmst || undefined,
    nmmst: nmmst || undefined,
    tthai,
    ttxly,
    unhiem,
  };
}

function normalizeDates(form: InvoiceFilterFormState): { fromDate: string; toDate: string } {
  if (!form.from_date || !form.to_date) {
    throw new Error("Vui lòng nhập Từ ngày và Đến ngày.");
  }

  const fromDate = displayDateToISO(form.from_date);
  if (!fromDate) {
    throw new Error("Từ ngày không hợp lệ. Vui lòng nhập theo định dạng DD/MM/YYYY.");
  }

  const toDate = displayDateToISO(form.to_date);
  if (!toDate) {
    throw new Error("Đến ngày không hợp lệ. Vui lòng nhập theo định dạng DD/MM/YYYY.");
  }

  if (toDate < fromDate) {
    throw new Error("Đến ngày không được nhỏ hơn Từ ngày.");
  }

  return { fromDate, toDate };
}

export function toQueryPayload(form: InvoiceFilterFormState, page = 1): HoaDonQuery {
  const { fromDate, toDate } = normalizeDates(form);
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new Error("Trang tra cứu không hợp lệ.");
  }

  return {
    ...compactFilter(form),
    from_date: fromDate,
    to_date: toDate,
    page,
    size: QUERY_RESULT_SIZE,
  };
}

export function toExportPayload(form: InvoiceFilterFormState): ExportInvoiceWrapperRequest {
  const { fromDate, toDate } = normalizeDates(form);
  return {
    ...compactFilter(form),
    from_date: fromDate,
    to_date: toDate,
  };
}
