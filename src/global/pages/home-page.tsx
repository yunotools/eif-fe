import Link from "next/link";
import { config } from "@global/config/config";
import type { FrontendModuleDefinition } from "@global/types/module";

function statusText(status: FrontendModuleDefinition["status"]): string {
  switch (status) {
    case "beta":
      return "Beta";
    case "disabled":
      return "Chưa mở";
    default:
      return "Sẵn sàng";
  }
}

export function HomePage({ modules }: { modules: FrontendModuleDefinition[] }) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <section className="border-b border-[var(--border)] pb-12 pt-5 sm:pb-16 sm:pt-10">
        <div
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--accent)" }}
          aria-hidden="true"
        />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="eif-eyebrow">{config.app.name} · {config.app.version}</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              {config.app.fullName}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Không gian làm việc tập trung để đăng nhập, tra cứu và xuất dữ liệu hóa đơn điện tử nhanh hơn.
            </p>
          </div>
          <div className="border-l-2 border-[var(--accent)] pl-4 text-sm leading-6 text-[var(--muted)]">
            <strong className="block text-[var(--text)]">EIF</strong>
            <span>Etax Invoice Fast</span>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="eif-eyebrow">Workspace</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Chức năng</h2>
          </div>
          <span className="text-xs font-semibold text-[var(--muted)]">{modules.length} module</span>
        </div>

        <div className="border-y border-[var(--border)]">
          {modules.map((module, index) => {
            const disabled = module.status === "disabled";
            const content = (
              <>
                <div className="flex items-center gap-4">
                  <span className="w-8 text-xs font-black tabular-nums text-[var(--muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--accent)] font-black text-white">
                    {module.shortName.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold sm:text-xl">{module.name}</h3>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                      {statusText(module.status)}
                    </span>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted)]">{module.description}</p>
                </div>
                <span className="justify-self-end text-2xl text-[var(--accent)] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </>
            );

            return disabled ? (
              <div
                key={module.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-[var(--border)] py-6 opacity-55 last:border-b-0 sm:gap-7"
              >
                {content}
              </div>
            ) : (
              <Link
                key={module.id}
                href={module.href}
                className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-[var(--border)] py-6 transition-[padding,background-color] duration-200 last:border-b-0 hover:bg-[var(--surface-2)] sm:gap-7 sm:hover:px-4"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
