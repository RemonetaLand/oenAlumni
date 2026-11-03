import { prisma } from "@/lib/db";
import { bad, guard, ok } from "@/lib/api";
import { sendAlreadyMember, sendJoinConfirmation } from "@/lib/emails";
import { allow, hashToken, newToken } from "@/lib/security";
import { CONSENT_VERSION, joinSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const g = await guard(req, joinSchema, "join");
  if ("response" in g) return g.response;
  const d = g.data;
  if (!(await allow(`join:email:${d.email}`, 3, 3600))) return ok(); // silent, avoids mail bombing one address

  try {
    const token = newToken();
    const details = {
      firstName: d.firstName, surname: d.surname, telephone: d.telephone, address: d.address, college: d.college,
      matriculationYear: d.year, alumniNumber: d.alumniNumber, notes: d.details,
      consentEvents: d.optional.events, consentShareOxford: d.optional.shareOxford, consentShareThirdParties: d.optional.shareThirdParties,
      consentCommGroups: d.optional.commGroups, consentVolunteer: d.optional.volunteer, consentTextVersion: CONSENT_VERSION,
      confirmTokenHash: hashToken(token), confirmExpiresAt: new Date(Date.now() + 7 * 86400_000),
    };
    const existing = await prisma.member.findUnique({ where: { email: d.email }, select: { id: true, status: true, firstName: true } });

    if (existing?.status === "confirmed") {
      await sendAlreadyMember(d.email, existing.firstName); // data untouched; no hint to the requester
      return ok();
    }
    if (existing) {
      // pending or unsubscribed: refresh details and send a new confirmation
      await prisma.member.update({ where: { id: existing.id }, data: { ...details, status: "pending" } });
    } else {
      await prisma.member.create({ data: { ...details, email: d.email, consentDataProcessing: true, consentNecessaryEmails: true } });
    }
    await sendJoinConfirmation(d.email, d.firstName, token);
    return ok();
  } catch (e) {
    console.error("join failed", e);
    return bad("Something went wrong. Please try again.", 500);
  }
}
