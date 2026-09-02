export function toLocalInputDate(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString()
      .slice(0, 10);
}

export function currentMonthDateRange(): { from: string; to: string } {
  const now = new Date();
  const first = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
  );
  return {
    from: toLocalInputDate(first),
    to: toLocalInputDate(now),
  };
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}
