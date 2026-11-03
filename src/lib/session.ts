import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { safeEqual, sign } from "./security";

export const SESSION_COOKIE = "oen_admin";
export const FIXED_ADMIN_ID = "fixed";

/** Single admin from env (ADMIN_EMAIL / ADMIN_PASSWORD); null when not configured. Real accounts come later. */
export function fixedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  return email && password ? { id: FIXED_ADMIN_ID, email, name: "Admin", password } : null;
}
const MAX_AGE = 60 * 60 * 8; // 8 hours

export function makeSessionValue(adminId: string) {
  const payload = Buffer.from(JSON.stringify({ id: adminId, exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
export const sessionCookieOptions = {
  httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE,
};

function parse(value: string | undefined): string | null {
  if (!value) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return null;
  try {
    const { id, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof id === "string" && typeof exp === "number" && exp > Date.now() ? id : null;
  } catch { return null; }
}

/** Data access layer check: every admin page and route calls this, not just the proxy. */
export const getAdmin = cache(async () => {
  const id = parse((await cookies()).get(SESSION_COOKIE)?.value);
  if (!id) return null;
  if (id === FIXED_ADMIN_ID) {
    const fixed = fixedAdmin();
    return fixed && { id: fixed.id, email: fixed.email, name: fixed.name };
  }
  return prisma.admin.findUnique({ where: { id }, select: { id: true, email: true, name: true } });
});

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin-panel/login");
  return admin;
}
