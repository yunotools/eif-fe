(() => {
  const root = document.documentElement;
  try {
    const theme = localStorage.getItem("eif:theme");
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = theme === "dark" || theme === "light" ? theme : dark ? "dark" : "light";

    const allowedAccents = new Set([
      "#2563eb", "#4f46e5", "#7c3aed", "#059669",
      "#0f766e", "#d97706", "#e11d48", "#475569",
    ]);
    const accent = localStorage.getItem("eif:accent");
    root.style.setProperty("--accent", accent && allowedAccents.has(accent) ? accent : "#2563eb");
  } catch {} finally {
    root.dataset.themeReady = "true";
  }
})();
