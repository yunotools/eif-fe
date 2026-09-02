"use client";

import type { ChangeEvent } from "react";
import { useTheme } from "@global/providers/theme-provider";
import { THEME_ACCENTS } from "@global/utils/color";
import { cn } from "@global/utils/cn";

export function ThemeControl() {
  const { theme, setTheme, accent, setAccent } = useTheme();

  return (
    <div className="eif-theme-control grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
      <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
        Giao diện
        <select
          className="eif-input min-h-9"
          value={theme}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setTheme(event.target.value as "light" | "dark" | "system")
          }
        >
          <option value="system">Theo hệ thống</option>
          <option value="light">Sáng</option>
          <option value="dark">Tối</option>
        </select>
      </label>

      <div className="grid gap-2">
        <span className="text-xs font-semibold text-[var(--muted)]">Màu chủ đạo</span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Màu chủ đạo">
          {THEME_ACCENTS.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-label={item.name}
              aria-pressed={accent === item.value}
              className={cn(
                "eif-color-swatch size-7 rounded-full border-2 border-transparent outline-none",
                accent === item.value &&
                  "ring-2 ring-[var(--text)] ring-offset-2 ring-offset-[var(--surface-2)]",
              )}
              style={{ backgroundColor: item.value }}
              onClick={() => setAccent(item.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
