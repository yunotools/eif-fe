import type { ReactNode } from "react";

export function HddtGdtLayout({ children }: { children: ReactNode }) {
  return <div className="grid gap-5">{children}</div>;
}
