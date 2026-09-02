import type { ErrorCodeDefinition } from "@global/error/error-code";

export type AppErrorInit = {
  status: number;
  code: string;
  message: string;
  requestId?: string;
  cause?: unknown;
  details?: unknown;
};

export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId?: string;
  readonly details?: unknown;

  constructor(init: AppErrorInit) {
    super(init.message, { cause: init.cause });
    this.name = "AppError";
    this.status = init.status;
    this.code = init.code;
    this.requestId = init.requestId;
    this.details = init.details;
  }
}

export function appErrorFromCode(
  definition: ErrorCodeDefinition,
  options: Omit<Partial<AppErrorInit>, "status" | "code" | "message"> = {},
): AppError {
  return new AppError({
    status: definition.status,
    code: definition.code,
    message: definition.message,
    ...options,
  });
}
