import { formatDateTime } from "@global/utils/date";
import { formatMoney } from "@global/utils/format";
import type { InvoiceRecord } from "@modules/hoadondientu.gdt.gov.vn/dto/invoice";
import {
  numericValue,
  processingLabel,
  statusLabel,
  textValue,
} from "@modules/hoadondientu.gdt.gov.vn/utils/invoice";

function rowKey(record: InvoiceRecord, index: number): string {
  return String(
    record.id ??
      record.mhdon ??
      `${record.khhdon ?? "invoice"}-${record.shdon ?? index}-${index}`,
  );
}

export function InvoiceTable({ datas }: { datas: InvoiceRecord[] }) {
  if (datas.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] px-5 py-12 text-center text-sm text-[var(--muted)]">
        Không có dữ liệu để hiển thị.
      </div>
    );
  }

  return (
    <div className="eif-table-wrap">
      <table className="eif-table">
        <thead>
          <tr>
            <th>Số HĐ</th>
            <th>Mẫu số</th>
            <th>Ký hiệu</th>
            <th>Ngày lập</th>
            <th>MST người bán</th>
            <th>Tên người bán</th>
            <th>MST người mua</th>
            <th>Tên người mua</th>
            <th>Tổng thanh toán</th>
            <th>Trạng thái</th>
            <th>Kết quả xử lý</th>
          </tr>
        </thead>
        <tbody>
          {datas.map((record, index) => (
            <tr key={rowKey(record, index)}>
              <td className="font-semibold">{textValue(record, "shdon")}</td>
              <td>{textValue(record, "khmshdon")}</td>
              <td>{textValue(record, "khhdon")}</td>
              <td>
                {record.tdlap ? formatDateTime(String(record.tdlap)) : "-"}
              </td>
              <td>{textValue(record, "nbmst")}</td>
              <td className="max-w-64">{textValue(record, "nbten")}</td>
              <td>{textValue(record, "nmmst")}</td>
              <td className="max-w-64">{textValue(record, "nmten")}</td>
              <td className="whitespace-nowrap font-semibold">
                {formatMoney(numericValue(record, "tgtttbso"))}
              </td>
              <td>{statusLabel(record.tthai)}</td>
              <td className="max-w-72">{processingLabel(record.ttxly)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
