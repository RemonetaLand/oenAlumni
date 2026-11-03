import { prisma } from "@/lib/db";
import { bad, ok } from "@/lib/api";
import { consentsOf } from "@/lib/consents";
import { sendStatusReceipt } from "@/lib/emails";
import { allow, clientIp, hashToken } from "@/lib/security";
import { optionalConsentSchema, tokenSchema } from "@/lib/validation";

export async function POST(req: Request) {
  if (!(await allow(`confirm:ip:${clientIp(req)}`, 30, 3600))) return bad("Too many attempts.", 429);
  const parsed = tokenSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return bad("This link is not valid.");
  const hash = hashToken(parsed.data.token);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const r = await tx.statusRequest.findFirst({ where: { tokenHash: hash, usedAt: null, expiresAt: { gt: new Date() } } });
      if (!r) return null;
      const { count } = await tx.statusRequest.updateMany({ where: { id: r.id, usedAt: null }, data: { usedAt: new Date() } });
      if (count !== 1) return null;
      const next = optionalConsentSchema.parse(r.requestedChanges);
      const before = consentsOf(await tx.member.findUniqueOrThrow({ where: { id: r.memberId } }));
      const m = await tx.member.update({
        where: { id: r.memberId },
        data: { consentEvents: next.events, consentShareOxford: next.shareOxford, consentShareThirdParties: next.shareThirdParties, consentCommGroups: next.commGroups, consentVolunteer: next.volunteer },
      });
      await tx.consentLog.create({ data: { memberId: r.memberId, source: "status-change", before, after: next } });
      return { email: m.email, firstName: m.firstName, next };
    });
    if (!result) return bad("This link is not valid or has expired.", 410);
    await sendStatusReceipt(result.email, result.firstName, result.next);
    return ok();
  } catch (e) {
    console.error("status-confirm failed", e);
    return bad("Something went wrong. Please try again.", 500);
  }
}
