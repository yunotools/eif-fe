import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@global/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  busy?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  busy = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || busy}
      className={cn("eif-button", `eif-button-${variant}`, className)}
    >
      {busy ? <span className="eif-spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
