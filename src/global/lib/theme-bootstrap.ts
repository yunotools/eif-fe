import { DEFAULT_THEME_ACCENT, THEME_ACCENTS } from "@global/utils/color";

const accentValues = THEME_ACCENTS.map((accent) => accent.value);

// Chạy inline trong <head> trước first paint để route reload/404/500 không
// chớp màu accent mặc định rồi mới đổi sang màu đã lưu trong localStorage.
export const THEME_BOOTSTRAP_SCRIPT = `(() => {
  const root = document.documentElement;
  try {
    const storedTheme = localStorage.getItem("eif:theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolvedTheme = storedTheme === "dark" || storedTheme === "light"
      ? storedTheme
      : prefersDark ? "dark" : "light";
    root.dataset.theme = resolvedTheme;

    const allowedAccents = new Set(${JSON.stringify(accentValues)});
    const storedAccent = localStorage.getItem("eif:accent");
    const accent = storedAccent && allowedAccents.has(storedAccent)
      ? storedAccent
      : ${JSON.stringify(DEFAULT_THEME_ACCENT)};
    root.style.setProperty("--accent", accent);
  } catch {
    root.style.setProperty("--accent", ${JSON.stringify(DEFAULT_THEME_ACCENT)});
  } finally {
    root.dataset.themeReady = "true";
  }
})();`;
