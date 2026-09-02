import { AppError, appErrorFromCode } from "@global/error/app-error";
import {
  ERROR_CODES,
  userMessageForBackendError,
} from "@global/error/error-code";
import { config } from "@global/config/config";
import { SESSION_UNAUTHORIZED_EVENT } from "@global/events/events";
import { logger } from "@global/logger/logger";
import { createRequestId } from "@global/protocol/request-id";
import { filenameFromDisposition } from "@global/utils/download";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  base?: "api" | "backend";
  body?: unknown;
  sessionId?: string;
  sessionAware?: boolean;
  signal?: AbortSignal;
  accept?: string;
  headers?: HeadersInit;
};

export type DownloadResponse = {
  blob: Blob;
  filename: string | null;
  contentType: string;
};

type BackendErrorBody = {
  status_code?: number;
  code?: string;
  message?: string;
  request_id?: string;
};

function backendRootUrl(): string {
  if (!/^https?:\/\//i.test(config.api.baseUrl)) return "";

  try {
    return new URL(config.api.baseUrl).origin;
  } catch {
    return "";
  }
}

function buildUrl(path: string, base: "api" | "backend"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return base === "backend"
    ? `${backendRootUrl()}${suffix}`
    : `${config.api.baseUrl}${suffix}`;
}

async function parseApiError(
  response: Response,
  requestContext: { method: string; path: string; url: string },
): Promise<AppError> {
  const text = await response.text();
  let parsed: BackendErrorBody | string | null = null;

  if (text) {
    try {
      parsed = JSON.parse(text) as BackendErrorBody;
    } catch {
      parsed = text;
    }
  }

  const body = typeof parsed === "object" && parsed !== null ? parsed : undefined;
  const code = body?.code || `HTTP-${response.status}`;
  const requestId = body?.request_id || response.headers.get("X-Request-ID") || undefined;

  return new AppError({
    status: response.status,
    code,
    message: userMessageForBackendError(code, response.status, body?.message),
    requestId,
    details: {
      ...requestContext,
      backend: parsed,
    },
  });
}

function broadcastUnauthorized(error: AppError, sessionAware: boolean): void {
  if (!sessionAware || error.status !== 401 || typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(SESSION_UNAUTHORIZED_EVENT, {
      detail: { code: error.code, requestId: error.requestId },
    }),
  );
}

async function request(path: string, options: RequestOptions = {}): Promise<Response> {
  const {
    method = "GET",
    base = "api",
    body,
    sessionId,
    sessionAware = false,
    signal,
    accept = "application/json",
    headers: additionalHeaders,
  } = options;

  const requestId = createRequestId();
  const url = buildUrl(path, base);
  const headers = new Headers(additionalHeaders);
  headers.set("Accept", accept);
  headers.set("X-Request-ID", requestId);
  if (body !== undefined) headers.set("Content-Type", "application/json");
  if (sessionId) headers.set("X-Session-ID", sessionId);

  const startedAt = performance.now();
  logger.debug("http.request", { method, path, requestId });

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") throw cause;

    const error = appErrorFromCode(ERROR_CODES.network, {
      requestId,
      cause,
      details: {
        method,
        path,
        url,
        browserMessage: cause instanceof Error ? cause.message : String(cause),
      },
    });
    logger.error("http.network_error", { method, path, requestId, error });
    throw error;
  }

  logger.debug("http.response", {
    method,
    path,
    requestId,
    status: response.status,
    durationMs: Math.round(performance.now() - startedAt),
  });

  if (!response.ok) {
    const error = await parseApiError(response, { method, path, url });
    broadcastUnauthorized(error, sessionAware);
    logger.warn("http.error_response", {
      method,
      path,
      status: error.status,
      code: error.code,
      requestId: error.requestId || requestId,
    });
    throw error;
  }

  return response;
}

export async function requestJson<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await request(path, options);
  if (response.status === 204) return undefined as T;

  try {
    return (await response.json()) as T;
  } catch (cause) {
    throw appErrorFromCode(ERROR_CODES.invalidResponse, { cause });
  }
}

export async function requestFile(
  path: string,
  options: RequestOptions = {},
): Promise<DownloadResponse> {
  const response = await request(path, {
    ...options,
    accept:
      "application/octet-stream, application/zip, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  return {
    blob: await response.blob(),
    filename: filenameFromDisposition(response.headers.get("Content-Disposition")),
    contentType: response.headers.get("Content-Type") || "application/octet-stream",
  };
}
