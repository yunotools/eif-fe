export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

function normalizeBaseUrl(value: string): string {
  if (value === "/") return "";
  return value.replace(/\/+$/, "");
}

function numberFromEnv(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function logLevelFromEnv(value: string | undefined): LogLevel {
  switch (value?.trim().toLowerCase()) {
    case "debug":
    case "warn":
    case "error":
    case "silent":
      return value.trim().toLowerCase() as LogLevel;
    default:
      return "info";
  }
}

function normalizeVersion(value: string | undefined): string {
  const version = value?.trim() || "v0.0.0.5";
  return version.startsWith("v") ? version : `v${version}`;
}

export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME?.trim() || "EIF",
    fullName: "Etax Invoice Fast",
    version: normalizeVersion(process.env.NEXT_PUBLIC_APP_VERSION),
  },
  api: {
    baseUrl: normalizeBaseUrl(
      process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "/api/v1",
    ),
  },
  session: {
    syncIntervalMs: Math.max(
      15_000,
      numberFromEnv(process.env.NEXT_PUBLIC_SESSION_SYNC_INTERVAL_MS, 60_000),
    ),
  },
  logger: {
    level: logLevelFromEnv(process.env.NEXT_PUBLIC_LOG_LEVEL),
  },
} as const;
