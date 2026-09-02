import type { ReactNode } from "react";
import { cn } from "@global/utils/cn";

type NoticeTone = "info" | "success" | "warning" | "danger";

export function Notice({
  tone = "info",
  title,
  children,
}: {
  tone?: NoticeTone;
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={cn("eif-notice", `eif-notice-${tone}`)} role="status">
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </div>
  );
}
