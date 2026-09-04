"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { config } from "@global/config/config";
import { AppError } from "@global/error/app-error";
import { toAppError } from "@global/error/error-handler";
import { SESSION_UNAUTHORIZED_EVENT } from "@global/events/events";
import { logger } from "@global/logger/logger";
import { loadStoredSession } from "@modules/hoadondientu.gdt.gov.vn/lib/session-storage";
import { useHddtSession } from "@modules/hoadondientu.gdt.gov.vn/providers/session-provider";
import { getSessionInfo } from "@modules/hoadondientu.gdt.gov.vn/service/session.service";

type SessionSyncContextValue = {
  syncError: AppError | null;
  syncNow: () => Promise<void>;
};

const SessionSyncContext = createContext<SessionSyncContextValue | null>(null);

export function HddtSessionSyncProvider({ children }: { children: ReactNode }) {
  const {
    phase,
    session,
    setValidating,
    resumeSession,
    acceptSessionInfo,
    clearSession,
  } = useHddtSession();
  const [syncError, setSyncError] = useState<AppError | null>(null);

  const syncSession = useCallback(
    async (showLoading: boolean) => {
      const current = session;
      if (!current) return;
      if (showLoading) setValidating();

      try {
        const info = await getSessionInfo(current.id);
        acceptSessionInfo(info, current.remember);
        setSyncError(null);
      } catch (value) {
        const error = toAppError(value);
        if (error.status === 401) {
          clearSession();
          setSyncError(null);
          return;
        }

        setSyncError(error);
        if (showLoading) resumeSession(current);
        throw error;
      }
    },
    [session, setValidating, resumeSession, acceptSessionInfo, clearSession],
  );

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      await Promise.resolve();
      if (cancelled) return;

      const stored = loadStoredSession();
      if (!stored) {
        clearSession();
        return;
      }

      const expiry = new Date(stored.expiredAt).getTime();
      if (Number.isFinite(expiry) && expiry <= Date.now()) {
        clearSession();
        return;
      }

      setValidating();
      try {
        const info = await getSessionInfo(stored.id);
        if (!cancelled) acceptSessionInfo(info, stored.remember);
      } catch (value) {
        if (cancelled) return;
        const error = toAppError(value);
        logger.warn("session.restore_failed", {
          code: error.code,
          status: error.status,
          requestId: error.requestId,
        });

        if (error.status === 401) {
          clearSession();
          setSyncError(null);
          return;
        }

        // Backend/network tạm lỗi không có nghĩa session local đã hỏng.
        // Giữ session để UI có thể hiển thị lỗi cụ thể và tự đồng bộ lại sau.
        resumeSession(stored);
        setSyncError(error);
      }
    };

    void restore();
    return () => {
      cancelled = true;
    };
  }, [acceptSessionInfo, clearSession, resumeSession, setValidating]);

  useEffect(() => {
    const handleUnauthorized = () => clearSession();
    window.addEventListener(SESSION_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(
        SESSION_UNAUTHORIZED_EVENT,
        handleUnauthorized,
      );
  }, [clearSession]);

  useEffect(() => {
    if (!session?.expiredAt) return;

    const expiry = new Date(session.expiredAt).getTime();
    if (!Number.isFinite(expiry)) return;

    const delay = Math.max(0, expiry - Date.now());
    const timeout = window.setTimeout(clearSession, delay + 1_000);
    return () => window.clearTimeout(timeout);
  }, [session?.expiredAt, clearSession]);

  useEffect(() => {
    if (phase !== "authenticated" || !session?.id) return;

    const interval = window.setInterval(() => {
      void syncSession(false).catch(() => undefined);
    }, config.session.syncIntervalMs);

    return () => window.clearInterval(interval);
  }, [phase, session?.id, syncSession]);

  const syncNow = useCallback(async () => {
    await syncSession(true);
  }, [syncSession]);

  const value = useMemo(() => ({ syncError, syncNow }), [syncError, syncNow]);

  return (
    <SessionSyncContext.Provider value={value}>
      {children}
    </SessionSyncContext.Provider>
  );
}

export function useHddtSessionSync(): SessionSyncContextValue {
  const context = useContext(SessionSyncContext);
  if (!context) {
    throw new Error(
      "useHddtSessionSync must be used inside HddtSessionSyncProvider",
    );
  }
  return context;
}
