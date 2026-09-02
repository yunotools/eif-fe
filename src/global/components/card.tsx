import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@global/utils/cn";

export function Card({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <section {...props} className={cn("eif-card", className)}>
      {children}
    </section>
  );
}
