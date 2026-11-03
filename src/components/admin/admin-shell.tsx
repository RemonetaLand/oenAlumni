"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const tab = (href: string, label: string) => (
    <Link href={href} aria-current={path === href ? "page" : undefined}
      className={`border-b-2 pb-1 text-sm font-semibold ${path === href ? "border-gold text-oxford" : "border-transparent text-muted hover:text-oxford"}`}>{label}</Link>
  );
  return (
    <>
      <header className="border-b border-stone bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <p className="display text-xl font-semibold text-oxford">OEN Admin</p>
            <nav className="flex gap-6">{tab("/admin-panel", "Members")}{tab("/admin-panel/partners", "Partners & sponsors")}</nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="hidden sm:inline">{email}</span>
            <button className="btn btn-ghost !min-h-9 !px-4 !py-1.5 !text-xs" onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              router.replace("/admin-panel/login");
            }}>Sign out</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </>
  );
}
