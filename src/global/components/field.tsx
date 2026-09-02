import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="eif-field">
      <span className="eif-field-label">{label}</span>
      {children}
      {hint ? <span className="eif-field-hint">{hint}</span> : null}
      {error ? <span className="eif-field-error">{error}</span> : null}
    </label>
  );
}
