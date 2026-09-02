"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { AuthenticationResponse } from "@modules/hoadondientu.gdt.gov.vn/dto/auth";
import type { SessionResponse } from "@modules/hoadondientu.gdt.gov.vn/dto/session";
import {
  clearStoredSession,
  storeSession,
} from "@modules/hoadondientu.gdt.gov.vn/lib/session-storage";
import type { StoredHddtSession } from "@modules/hoadondientu.gdt.gov.vn/model/session";

export type SessionPhase = "booting" | "anonymous" | "validating" | "authenticated";

type SessionState = {
  phase: SessionPhase;
  session: StoredHddtSession | null;
};

type SessionAction =
  | { type: "ANONYMOUS" }
  | { type: "VALIDATING" }
  | { type: "AUTHENTICATED"; session: StoredHddtSession };

function reducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "ANONYMOUS":
      return { phase: "anonymous", session: null };
    case "VALIDATING":
      return { ...state, phase: "validating" };
    case "AUTHENTICATED":
      return { phase: "authenticated", session: action.session };
  }
}

function fromSessionResponse(info: SessionResponse, remember: boolean): StoredHddtSession {
  return {
    id: info.session_id,
    username: info.username,
    expiredAt: info.expired_at,
    remainingSeconds: info.remaining_seconds,
    remember,
    lastSyncedAt: new Date().toISOString(),
  };
}

type SessionContextValue = SessionState & {
  setValidating: () => void;
  resumeSession: (session: StoredHddtSession) => void;
  acceptAuthentication: (
    response: AuthenticationResponse,
    username: string,
    remember: boolean,
  ) => void;
  acceptSessionInfo: (info: SessionResponse, remember: boolean) => StoredHddtSession;
  clearSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function HddtSessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    phase: "booting",
    session: null,
  });

  const setValidating = useCallback(() => {
    dispatch({ type: "VALIDATING" });
  }, []);

  const resumeSession = useCallback((session: StoredHddtSession) => {
    dispatch({ type: "AUTHENTICATED", session });
  }, []);

  const clearSession = useCallback(() => {
    clearStoredSession();
    dispatch({ type: "ANONYMOUS" });
  }, []);

  const acceptSessionInfo = useCallback(
    (info: SessionResponse, remember: boolean) => {
      const session = fromSessionResponse(info, remember);
      storeSession(session);
      dispatch({ type: "AUTHENTICATED", session });
      return session;
    },
    [],
  );

  const acceptAuthentication = useCallback(
    (response: AuthenticationResponse, username: string, remember: boolean) => {
      const session: StoredHddtSession = {
        id: response.session_id,
        username: username.trim(),
        expiredAt: response.expired_at,
        remainingSeconds: Math.max(
          0,
          Math.floor((new Date(response.expired_at).getTime() - Date.now()) / 1_000),
        ),
        remember,
        lastSyncedAt: new Date().toISOString(),
      };
      storeSession(session);
      dispatch({ type: "AUTHENTICATED", session });
    },
    [],
  );

  const value = useMemo<SessionContextValue>(
    () => ({
      ...state,
      setValidating,
      resumeSession,
      acceptAuthentication,
      acceptSessionInfo,
      clearSession,
    }),
    [
      state,
      setValidating,
      resumeSession,
      acceptAuthentication,
      acceptSessionInfo,
      clearSession,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useHddtSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useHddtSession must be used inside HddtSessionProvider");
  return context;
}
