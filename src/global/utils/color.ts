export type ThemeAccent = {
  name: string;
  value: string;
};

export const THEME_ACCENTS: readonly ThemeAccent[] = [
  { name: "Xanh dương", value: "#2563eb" },
  { name: "Chàm", value: "#4f46e5" },
  { name: "Tím", value: "#7c3aed" },
  { name: "Xanh lá", value: "#059669" },
  { name: "Xanh ngọc", value: "#0f766e" },
  { name: "Cam", value: "#d97706" },
  { name: "Đỏ hồng", value: "#e11d48" },
  { name: "Xám xanh", value: "#475569" },
] as const;

export const DEFAULT_THEME_ACCENT = THEME_ACCENTS[0]!.value;

export function isThemeAccent(value: string | null): value is string {
  return THEME_ACCENTS.some((accent) => accent.value === value);
}
