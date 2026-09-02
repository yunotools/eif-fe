"use client";

import { useCallback } from "react";
import { useAsyncAction } from "@global/hooks/use-async-action";
import type { AuthenticationRequest } from "@modules/hoadondientu.gdt.gov.vn/dto/auth";
import { authenticate } from "@modules/hoadondientu.gdt.gov.vn/service/auth.service";

export function useAuthenticate() {
  const action = useCallback((payload: AuthenticationRequest) => authenticate(payload), []);
  return useAsyncAction(action);
}
