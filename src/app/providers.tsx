"use client";

import type { ReactNode } from "react";
import { ErrorObserverProvider } from "@global/providers/error-observer-provider";
import { ThemeProvider } from "@global/providers/theme-provider";
import { HddtSessionProvider } from "@modules/hoadondientu.gdt.gov.vn/providers/session-provider";
import { HddtSessionSyncProvider } from "@modules/hoadondientu.gdt.gov.vn/providers/session-sync-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorObserverProvider>
      <ThemeProvider>
        <HddtSessionProvider>
          <HddtSessionSyncProvider>{children}</HddtSessionSyncProvider>
        </HddtSessionProvider>
      </ThemeProvider>
    </ErrorObserverProvider>
  );
}
