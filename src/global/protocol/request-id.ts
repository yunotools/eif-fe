let sequence = 0;

export function createRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  sequence += 1;
  return `${Date.now().toString(36)}-${sequence.toString(36)}`;
}
