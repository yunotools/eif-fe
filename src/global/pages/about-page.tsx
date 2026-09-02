import { config } from "@global/config/config";

const capabilities = [
  ["01", "Đăng nhập", "Tạo và quản lý EIF session dùng để làm việc với HĐĐT."],
  ["02", "Tra cứu", "Lọc dữ liệu hóa đơn theo khoảng thời gian và các tiêu chí nghiệp vụ."],
  ["03", "Xuất dữ liệu", "Xuất file theo từng phần hoặc gộp dữ liệu thành một file."],
] as const;

export function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="border-b border-[var(--border)] pb-10 pt-4 sm:pb-14 sm:pt-8">
        <p className="eif-eyebrow">About · {config.app.version}</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <h1 className="text-5xl font-black leading-none tracking-[-0.05em] sm:text-6xl">
            {config.app.name}
            <span className="mt-3 block text-2xl font-semibold tracking-[-0.02em] text-[var(--muted)] sm:text-3xl">
              {config.app.fullName}
            </span>
          </h1>
          <p className="max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            EIF là giao diện làm việc tối giản cho quy trình hóa đơn điện tử: xác thực phiên, tra cứu dữ liệu và xuất kết quả mà không phải thao tác lặp lại trên nhiều màn hình.
          </p>
        </div>
      </header>

      <section className="grid gap-8 border-b border-[var(--border)] py-10 md:grid-cols-[0.7fr_1.3fr] sm:py-14">
        <div>
          <p className="eif-eyebrow">Tên gọi</p>
          <h2 className="mt-2 text-2xl font-black">EIF nghĩa là gì?</h2>
        </div>
        <dl className="grid gap-0 border-y border-[var(--border)]">
          <div className="grid grid-cols-[7rem_1fr] gap-5 border-b border-[var(--border)] py-5">
            <dt className="text-sm font-bold text-[var(--muted)]">EIF</dt>
            <dd className="font-bold">Etax Invoice Fast</dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] gap-5 py-5">
            <dt className="text-sm font-bold text-[var(--muted)]">Phiên bản</dt>
            <dd className="font-bold text-[var(--accent)]">{config.app.version}</dd>
          </div>
        </dl>
      </section>

      <section className="py-10 sm:py-14">
        <p className="eif-eyebrow">Chức năng chính</p>
        <div className="mt-6 border-y border-[var(--border)]">
          {capabilities.map(([number, title, description]) => (
            <div
              key={number}
              className="grid gap-3 border-b border-[var(--border)] py-6 last:border-b-0 sm:grid-cols-[4rem_12rem_minmax(0,1fr)] sm:items-start"
            >
              <span className="text-xs font-black text-[var(--accent)]">{number}</span>
              <h3 className="font-bold">{title}</h3>
              <p className="text-sm leading-6 text-[var(--muted)]">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
