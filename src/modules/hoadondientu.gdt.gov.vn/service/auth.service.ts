import { requestJson } from "@global/protocol/http-client";
import type {
  AuthenticationRequest,
  AuthenticationResponse,
} from "@modules/hoadondientu.gdt.gov.vn/dto/auth";
import type { CaptchaResponse } from "@modules/hoadondientu.gdt.gov.vn/dto/captcha";
import { HDDT_ENDPOINTS } from "@modules/hoadondientu.gdt.gov.vn/lib/endpoints";

export function getCaptcha(signal?: AbortSignal): Promise<CaptchaResponse> {
  return requestJson<CaptchaResponse>(HDDT_ENDPOINTS.captcha, { signal });
}

export function authenticate(
  payload: AuthenticationRequest,
  signal?: AbortSignal,
): Promise<AuthenticationResponse> {
  return requestJson<AuthenticationResponse>(HDDT_ENDPOINTS.authenticate, {
    method: "POST",
    body: payload,
    signal,
  });
}
