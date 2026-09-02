"use client";

import { useCallback } from "react";
import { logger } from "@global/logger/logger";
import { useHddtSession } from "@modules/hoadondientu.gdt.gov.vn/providers/session-provider";
import { deleteSession } from "@modules/hoadondientu.gdt.gov.vn/service/session.service";

export function useLogoutSession() {
  const { session, clearSession } = useHddtSession();

  return useCallback(async () => {
    const sessionId = session?.id;
    clearSession();
    if (!sessionId) return;

    try {
      await deleteSession(sessionId);
    } catch (error) {
      logger.warn("session.remote_logout_failed", { error });
    }
  }, [session?.id, clearSession]);
}
