export function Spinner({ label = "Đang tải" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
      <span className="eif-spinner" aria-hidden="true" />
      {label}
    </span>
  );
}
