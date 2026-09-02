import { AppError, appErrorFromCode } from "@global/error/app-error";
import { ERROR_CODES } from "@global/error/error-code";
import { logger } from "@global/logger/logger";

export function toAppError(value: unknown): AppError {
  if (value instanceof AppError) return value;

  if (value instanceof Error) {
    return appErrorFromCode(ERROR_CODES.internal, {
      cause: value,
      details: { name: value.name },
    });
  }

  return appErrorFromCode(ERROR_CODES.internal, { cause: value });
}

export function reportError(
  value: unknown,
  event: string,
  fields?: Record<string, unknown>,
): AppError {
  const error = toAppError(value);
  logger.error(event, {
    ...fields,
    code: error.code,
    status: error.status,
    requestId: error.requestId,
    error,
    cause: error.cause,
  });
  return error;
}

export function userErrorText(value: unknown): string {
  const error = toAppError(value);
  return error.requestId
    ? `${error.message} Mã hỗ trợ: ${error.requestId}`
    : error.message;
}
