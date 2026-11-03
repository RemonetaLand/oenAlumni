import { prisma } from "@/lib/db";
import { guard, ok } from "@/lib/api";
import { sendStatusConfirmation } from "@/lib/emails";
import { allow, hashToken, newToken } from "@/lib/security";
import { statusSchema } from "@/lib/validation";

/** Always answers the same way: an unknown address gets no email, no error and no change. */
export async function POST(req: Request) {
  const g = await guard(req, statusSchema, "status");
  if ("response" in g) return g.response;
  const { email, optional } = g.data;
  if (!(await allow(`status:email:${email}`, 3, 3600))) return ok();
  try {
    const m = await prisma.member.findFirst({ where: { email, status: "confirmed" }, select: { id: true, firstName: true } });
    if (m) {
      const token = newToken();
      await prisma.statusRequest.create({
        data: { memberId: m.id, requestedChanges: optional, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 2 * 86400_000) },
      });
      await sendStatusConfirmation(email, m.firstName, optional, token);
    }
  } catch (e) {
    console.error("status-request failed", e);
  }
  return ok();
}
