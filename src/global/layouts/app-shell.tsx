"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ThemeControl } from "@global/components/theme-control";
import { config } from "@global/config/config";
import type { FrontendModuleDefinition } from "@global/types/module";
import { cn } from "@global/utils/cn";

function isActive(pathname: string, href: string): boolean {
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const normalizedHref = href === "/" ? "/" : href.replace(/\/+$/, "");
  if (normalizedHref === "/") return normalizedPath === "/";
  return (
    normalizedPath === normalizedHref ||
    normalizedPath.startsWith(`${normalizedHref}/`)
  );
}

export function AppShell({
  children,
  modules,
}: {
  children: ReactNode;
  modules: FrontendModuleDefinition[];
}) {
  const pathname = usePathname();
  const nav = [
    { href: "/", label: "Trang chủ" },
    ...modules
      .filter((module) => module.status !== "disabled")
      .map((module) => ({ href: module.href, label: module.shortName })),
    { href: "/about/", label: "Giới thiệu" },
  ];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="eif-shell-aside border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
        <Link href="/" className="eif-brand flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[var(--accent)] font-black text-white">
            E
          </span>
          <span className="min-w-0">
            <span className="flex items-baseline gap-2">
              <strong className="block text-base">{config.app.name}</strong>
              <small className="text-[10px] font-bold text-[var(--accent)]">
                {config.app.version}
              </small>
            </span>
            <small className="block truncate text-[11px] text-[var(--muted)]">
              {config.app.fullName}
            </small>
          </span>
        </Link>

        <nav
          className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:grid lg:overflow-visible"
          aria-label="Điều hướng chính"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "eif-nav-link",
                isActive(pathname, item.href) && "eif-nav-link-active",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 lg:hidden">
          <ThemeControl />
        </div>
        <div className="mt-5 hidden lg:block lg:pt-10">
          <ThemeControl />
          <div className="mt-6 border-t border-[var(--border)] pt-4 text-[10px] leading-5 text-[var(--muted)]">
            <div>{config.app.fullName}</div>
            <div>{config.app.version}</div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        <div className="eif-page mx-auto w-full max-w-[1500px]">{children}</div>
      </main>
    </div>
  );
}
