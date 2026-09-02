import { GLOBAL_ENDPOINTS } from "@global/lib/endpoints";
import { requestJson } from "@global/protocol/http-client";

export type HealthResponse = {
  status: string;
};

export function getBackendHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return requestJson<HealthResponse>(GLOBAL_ENDPOINTS.health, {
    base: "backend",
    signal,
  });
}
