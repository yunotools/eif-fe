import Link from "next/link";

export function StatusPage({
  code,
  title,
  description,
}: {
  code: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex min-h-[68vh] max-w-2xl flex-col justify-center py-16">
      <div className="text-7xl font-black leading-none text-[var(--accent)]">
        {code}
      </div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-xl leading-7 text-[var(--muted)]">
        {description}
      </p>
      <div className="mt-7 flex gap-3">
        <Link href="/" className="eif-button eif-button-primary">
          Trang chủ
        </Link>
        <Link href="/about/" className="eif-button eif-button-secondary">
          Giới thiệu
        </Link>
      </div>
    </div>
  );
}
