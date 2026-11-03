import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { bad, ok } from "@/lib/api";
import { DUMMY_HASH, verifyPassword } from "@/lib/password";
import { allow, clientIp, safeEqual } from "@/lib/security";
import { fixedAdmin, makeSessionValue, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

const schema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1).max(200) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return bad("Enter your email and password.");
  const { email, password } = parsed.data;
  if (!(await allow(`login:ip:${clientIp(req)}`, 10, 900)) || !(await allow(`login:email:${email}`, 5, 900)))
    return bad("Too many attempts. Try again in 15 minutes.", 429);
  const fixed = fixedAdmin();
  if (fixed && safeEqual(email, fixed.email) && safeEqual(password, fixed.password)) {
    (await cookies()).set(SESSION_COOKIE, makeSessionValue(fixed.id), sessionCookieOptions);
    return ok();
  }
  const admin = await prisma.admin.findUnique({ where: { email }, select: { id: true, passwordHash: true } });
  const good = verifyPassword(password, admin?.passwordHash ?? DUMMY_HASH) && !!admin; // same work whether or not the email exists
  if (!good) return bad("Email or password is incorrect.", 401);
  (await cookies()).set(SESSION_COOKIE, makeSessionValue(admin.id), sessionCookieOptions);
  return ok();
}
