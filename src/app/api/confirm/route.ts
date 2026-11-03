import { prisma } from "@/lib/db";
import { bad, ok } from "@/lib/api";
import { consentsOf } from "@/lib/consents";
import { sendWelcome } from "@/lib/emails";
import { allow, clientIp, hashToken } from "@/lib/security";
import { tokenSchema } from "@/lib/validation";

export async function POST(req: Request) {
  if (!(await allow(`confirm:ip:${clientIp(req)}`, 30, 3600))) return bad("Too many attempts.", 429);
  const parsed = tokenSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return bad("This link is not valid.");
  const hash = hashToken(parsed.data.token);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const m = await tx.member.findFirst({ where: { confirmTokenHash: hash, confirmExpiresAt: { gt: new Date() } } });
      if (!m) return null;
      // The hash is part of the filter, so a second request with the same link updates nothing.
      const { count } = await tx.member.updateMany({
        where: { id: m.id, confirmTokenHash: hash },
        data: { status: "confirmed", confirmedAt: new Date(), confirmTokenHash: null, confirmExpiresAt: null },
      });
      if (count !== 1) return null;
      const consents = consentsOf(m);
      await tx.consentLog.create({ data: { memberId: m.id, source: "join", after: consents } });
      return { email: m.email, firstName: m.firstName, consents };
    });
    if (!result) return bad("This link is not valid or has expired. Please join again.", 410);
    await sendWelcome(result.email, result.firstName, result.consents);
    return ok();
  } catch (e) {
    console.error("confirm failed", e);
    return bad("Something went wrong. Please try again.", 500);
  }
}
