export type ErrorCodeDefinition = {
  code: string;
  status: number;
  message: string;
};

export const ERROR_CODES = {
  internal: {
    code: "EIF-FE-SYS-500",
    status: 500,
    message: "Có lỗi xảy ra. Vui lòng thử lại.",
  },
  network: {
    code: "EIF-FE-NETWORK",
    status: 0,
    message: "Không thể kết nối tới backend EIF. Kiểm tra backend đang chạy và cấu hình NEXT_PUBLIC_API_BASE_URL.",
  },
  invalidResponse: {
    code: "EIF-FE-RESPONSE-502",
    status: 502,
    message: "Máy chủ trả về dữ liệu không hợp lệ.",
  },
} satisfies Record<string, ErrorCodeDefinition>;

const BACKEND_MESSAGES: Record<string, string> = {
  "EIF-REQ-400": "Thông tin gửi lên chưa hợp lệ.",
  "EIF-AUTH-401": "Bạn cần đăng nhập lại.",
  "EIF-AUTH-SESSION-401": "Phiên đăng nhập đã hết hạn.",
  "EIF-HDDT-GDT-AUTH-401": "Đăng nhập không thành công. Kiểm tra tài khoản, mật khẩu và captcha.",
  "EIF-HDDT-GDT-REFRESH-401": "Không thể làm mới phiên. Kiểm tra mật khẩu và captcha.",
  "EIF-HDDT-GDT-504": "Hệ thống Thuế phản hồi quá chậm. Vui lòng thử lại.",
  "EIF-HDDT-GDT-502": "Không thể kết nối tới hệ thống Thuế.",
  "EIF-HDDT-GDT-RATE-LIMIT-429": "Hệ thống Thuế đang giới hạn số lần truy cập. EIF đã tự thử lại; vui lòng chờ một chút rồi thử lại.",
  "EIF-HDDT-GDT-INVALID-502": "Hệ thống Thuế trả về dữ liệu không hợp lệ.",
  "EIF-HDDT-GDT-EXPORT-400": "Khoảng ngày xuất dữ liệu quá lớn.",
};

export function userMessageForBackendError(
  code: string | undefined,
  status: number,
  fallback?: string,
): string {
  if (code && BACKEND_MESSAGES[code]) return BACKEND_MESSAGES[code];
  if (status === 400) return "Thông tin gửi lên chưa hợp lệ.";
  if (status === 401) return "Phiên đăng nhập đã hết hạn.";
  if (status === 403) return "Bạn không có quyền thực hiện thao tác này.";
  if (status === 429) return "Hệ thống Thuế đang giới hạn số lần truy cập. Vui lòng chờ một chút rồi thử lại.";
  if (status >= 500) return "Hệ thống đang bận. Vui lòng thử lại.";
  return fallback?.trim() || "Yêu cầu không thành công.";
}
