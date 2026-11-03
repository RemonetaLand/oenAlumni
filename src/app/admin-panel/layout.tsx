import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | Admin" }, robots: { index: false, follow: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin-panel">) {
  return <div className="min-h-screen bg-[#f4f2ee] text-ink">{children}</div>;
}
