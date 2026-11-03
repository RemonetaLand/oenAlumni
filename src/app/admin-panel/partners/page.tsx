import { AdminShell } from "@/components/admin/admin-shell";
import { PartnersTable } from "@/components/admin/partners-table";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Partners & sponsors" };

export default async function PartnersAdminPage() {
  const admin = await requireAdmin();
  const partners = await prisma.partner.findMany({ orderBy: { createdAt: "desc" } });
  const rows = partners.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() }));
  return <AdminShell email={admin.email}><PartnersTable rows={rows} /></AdminShell>;
}
