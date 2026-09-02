"use client";

import { useCallback } from "react";
import { toAppError } from "@global/error/error-handler";
import { useAsyncAction } from "@global/hooks/use-async-action";
import type { SessionRefreshRequest } from "@modules/hoadondientu.gdt.gov.vn/dto/session";
import { useHddtSession } from "@modules/hoadondientu.gdt.gov.vn/providers/session-provider";
import { refreshSession } from "@modules/hoadondientu.gdt.gov.vn/service/session.service";

export function useRefreshSession() {
  const { session, acceptSessionInfo, clearSession } = useHddtSession();

  const action = useCallback(
    async (payload: SessionRefreshRequest) => {
      const current = session;
      if (!current) throw new Error("Bạn chưa có EIF session.");

      try {
        const info = await refreshSession(current.id, payload);
        acceptSessionInfo(info, current.remember);
        return info;
      } catch (value) {
        const error = toAppError(value);
        if (error.code === "EIF-AUTH-SESSION-401") {
          clearSession();
        }
        throw error;
      }
    },
    [session, acceptSessionInfo, clearSession],
  );

  return useAsyncAction(action);
}
