import { requestJson } from "@global/protocol/http-client";
import type {
  SessionRefreshRequest,
  SessionResponse,
} from "@modules/hoadondientu.gdt.gov.vn/dto/session";
import { HDDT_ENDPOINTS } from "@modules/hoadondientu.gdt.gov.vn/lib/endpoints";

export function getSessionInfo(
  sessionId: string,
  signal?: AbortSignal,
): Promise<SessionResponse> {
  return requestJson<SessionResponse>(HDDT_ENDPOINTS.session, {
    sessionId,
    sessionAware: true,
    signal,
  });
}

export function refreshSession(
  sessionId: string,
  payload: SessionRefreshRequest,
): Promise<SessionResponse> {
  return requestJson<SessionResponse>(HDDT_ENDPOINTS.sessionRefresh, {
    method: "POST",
    sessionId,
    // 401 ở endpoint này có thể chỉ là captcha/mật khẩu refresh sai;
    // hook sẽ tự phân biệt với EIF-AUTH-SESSION-401.
    sessionAware: false,
    body: payload,
  });
}

export function deleteSession(sessionId: string): Promise<void> {
  return requestJson<void>(HDDT_ENDPOINTS.session, {
    method: "DELETE",
    sessionId,
    sessionAware: true,
  });
}
