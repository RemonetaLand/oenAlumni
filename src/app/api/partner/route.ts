import { prisma } from "@/lib/db";
import { bad, guard, ok } from "@/lib/api";
import { sendPartnerNotice } from "@/lib/emails";
import { partnerSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const g = await guard(req, partnerSchema, "partner", 5);
  if ("response" in g) return g.response;
  const { firstName, surname, company, telephone, email, request } = g.data;
  try {
    await prisma.partner.create({ data: { firstName, surname, company, telephone, email, request } });
    const to = process.env.PARTNER_NOTIFY_EMAIL;
    if (to) await sendPartnerNotice(to, g.data).catch((e) => console.error("partner email failed", e));
    return ok();
  } catch (e) {
    console.error("partner failed", e);
    return bad("Something went wrong. Please try again.", 500);
  }
}
