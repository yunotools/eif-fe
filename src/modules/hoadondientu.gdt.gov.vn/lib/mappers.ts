import type {
  ExportInvoiceRequest,
  HoaDonQuery,
  InvoiceFilter,
} from "@modules/hoadondientu.gdt.gov.vn/dto/invoice";
import type { InvoiceMode } from "@modules/hoadondientu.gdt.gov.vn/model/invoice-mode";

export type InvoiceFilterFormState = {
  from_date: string;
  to_date: string;
  size: string;
  shdon: string;
  khhdon: string;
  khmshdon: string;
  nbmst: string;
  nmmst: string;
  tthai: string;
  ttxly: string;
  unhiem: string;
  nmcmnd: string;
};

export const EMPTY_FILTER_FORM: InvoiceFilterFormState = {
  from_date: "",
  to_date: "",
  size: "15",
  shdon: "",
  khhdon: "",
  khmshdon: "",
  nbmst: "",
  nmmst: "",
  tthai: "",
  ttxly: "",
  unhiem: "",
  nmcmnd: "",
};

const taxCodePattern = /^[0-9-]{1,32}$/;
const invoiceSymbolPattern = /^[A-Za-z0-9._/-]{1,64}$/;
const buyerIdPattern = /^[A-Za-z0-9-]{1,32}$/;

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
  const nmcmnd = form.nmcmnd.trim();

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
  validatePattern(nmcmnd, buyerIdPattern, "CCCD người mua chứa ký tự không được backend hỗ trợ.");

  return {
    shdon,
    khhdon: khhdon || undefined,
    khmshdon,
    nbmst: nbmst || undefined,
    nmmst: nmmst || undefined,
    tthai,
    ttxly,
    unhiem,
    nmcmnd: nmcmnd || undefined,
  };
}

function validateDates(form: InvoiceFilterFormState): void {
  if (!form.from_date || !form.to_date) {
    throw new Error("Vui lòng chọn Từ ngày và Đến ngày.");
  }
  if (form.to_date < form.from_date) {
    throw new Error("Đến ngày không được nhỏ hơn Từ ngày.");
  }
}

export function toQueryPayload(form: InvoiceFilterFormState): HoaDonQuery {
  validateDates(form);
  const size = optionalInteger(form.size, "Số bản ghi") ?? 15;
  if (size < 1 || size > 5000) {
    throw new Error("Số bản ghi phải từ 1 đến 5000.");
  }

  return {
    ...compactFilter(form),
    from_date: form.from_date,
    to_date: form.to_date,
    size,
  };
}

export function toExportPayload(
  form: InvoiceFilterFormState,
  mode: InvoiceMode,
): ExportInvoiceRequest {
  validateDates(form);
  return {
    ...compactFilter(form),
    from_date: form.from_date,
    to_date: form.to_date,
    type: mode.direction,
    sco: mode.sco,
  };
}
