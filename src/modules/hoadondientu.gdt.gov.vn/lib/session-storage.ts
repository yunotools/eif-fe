import type { StoredHddtSession } from "@modules/hoadondientu.gdt.gov.vn/model/session";

const LOCAL_KEY = "eif:hddtgdt:session:v1";
const TEMP_KEY = "eif:hddtgdt:session:tab:v1";

function parseSession(raw: string | null): StoredHddtSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredHddtSession>;
    if (
      typeof parsed.id !== "string" ||
      !parsed.id.trim() ||
      typeof parsed.expiredAt !== "string"
    ) {
      return null;
    }

    return {
      id: parsed.id,
      username: typeof parsed.username === "string" ? parsed.username : "",
      expiredAt: parsed.expiredAt,
      remainingSeconds:
        typeof parsed.remainingSeconds === "number" ? parsed.remainingSeconds : 0,
      remember: parsed.remember !== false,
      lastSyncedAt:
        typeof parsed.lastSyncedAt === "string" ? parsed.lastSyncedAt : "",
    };
  } catch {
    return null;
  }
}

export function loadStoredSession(): StoredHddtSession | null {
  if (typeof window === "undefined") return null;
  return (
    parseSession(window.localStorage.getItem(LOCAL_KEY)) ||
    parseSession(window.sessionStorage.getItem(TEMP_KEY))
  );
}

export function storeSession(session: StoredHddtSession): void {
  if (typeof window === "undefined") return;
  clearStoredSession();
  const target = session.remember ? window.localStorage : window.sessionStorage;
  target.setItem(session.remember ? LOCAL_KEY : TEMP_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LOCAL_KEY);
  window.sessionStorage.removeItem(TEMP_KEY);
}
