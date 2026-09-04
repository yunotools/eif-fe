import { Notice } from "@global/components/notice";
import { toAppError } from "@global/error/error-handler";

type DetailBag = Record<string, unknown>;

function asObject(value: unknown): DetailBag | null {
  return typeof value === "object" && value !== null
    ? (value as DetailBag)
    : null;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function ErrorNotice({
  value,
  tone = "danger",
}: {
  value: unknown;
  tone?: "danger" | "warning";
}) {
  const error = toAppError(value);
  const details = asObject(error.details);
  const backend = asObject(details?.backend);
  const method = text(details?.method);
  const path = text(details?.path);
  const url = text(details?.url);
  const browserMessage = text(details?.browserMessage);
  const backendMessage = text(backend?.message);

  return (
    <Notice tone={tone} title={error.message}>
      <div className="mt-1 grid gap-1 text-xs">
        <div>
          <strong>Mã lỗi:</strong> {error.code}
        </div>
        <div>
          <strong>HTTP:</strong>{" "}
          {error.status > 0 ? error.status : "Không có phản hồi HTTP"}
        </div>
        {error.requestId ? (
          <div>
            <strong>Request ID:</strong>{" "}
            <span className="break-all">{error.requestId}</span>
          </div>
        ) : null}
        {method || path ? (
          <div>
            <strong>Yêu cầu:</strong> {[method, path].filter(Boolean).join(" ")}
          </div>
        ) : null}
        {url ? (
          <div>
            <strong>Endpoint:</strong> <span className="break-all">{url}</span>
          </div>
        ) : null}
        {backendMessage && backendMessage !== error.message ? (
          <div>
            <strong>Backend:</strong> {backendMessage}
          </div>
        ) : null}
        {browserMessage ? (
          <div>
            <strong>Trình duyệt:</strong> {browserMessage}
          </div>
        ) : null}
      </div>
    </Notice>
  );
}
