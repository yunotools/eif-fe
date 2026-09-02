"use client";

import { useCallback } from "react";
import { useAsyncAction } from "@global/hooks/use-async-action";
import { useHddtSession } from "@modules/hoadondientu.gdt.gov.vn/providers/session-provider";
import { getSessionInfo } from "@modules/hoadondientu.gdt.gov.vn/service/session.service";

export function useAttachSession() {
  const { setValidating, acceptSessionInfo, clearSession } = useHddtSession();

  const action = useCallback(
    async (sessionId: string, remember: boolean) => {
      const id = sessionId.trim();
      if (!id) throw new Error("Vui lòng nhập session ID.");

      setValidating();
      try {
        const info = await getSessionInfo(id);
        acceptSessionInfo(info, remember);
      } catch (error) {
        clearSession();
        throw error;
      }
    },
    [setValidating, acceptSessionInfo, clearSession],
  );

  return useAsyncAction(action);
}
