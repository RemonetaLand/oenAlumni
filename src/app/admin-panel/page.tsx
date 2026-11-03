import { AdminShell } from "@/components/admin/admin-shell";
import { MembersTable } from "@/components/admin/members-table";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function MembersPage() {
  const admin = await requireAdmin();
  // Few members: load them all and let the browser search, filter, sort and export.
  const members = await prisma.member.findMany({
    orderBy: { createdAt: "desc" },
    omit: { confirmTokenHash: true, confirmExpiresAt: true, updatedAt: true, consentDataProcessing: true, consentNecessaryEmails: true },
  });
  const rows = members.map((m) => ({ ...m, createdAt: m.createdAt.toISOString(), confirmedAt: m.confirmedAt?.toISOString() ?? null }));
  return <AdminShell email={admin.email}><MembersTable rows={rows} /></AdminShell>;
}
