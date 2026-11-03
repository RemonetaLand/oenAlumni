import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { prisma } from "./db";

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET must be set to at least 32 characters");
  return s;
}

export const newToken = () => randomBytes(32).toString("base64url");
/** Only the hash of an emailed token is stored. */
export const hashToken = (token: string) => createHmac("sha256", secret()).update(token).digest("hex");

export function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}
export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/** Fixed-window limiter backed by Postgres. Returns true when the call is allowed. */
export async function allow(key: string, max: number, windowSeconds: number) {
  const windowStart = new Date(Math.floor(Date.now() / (windowSeconds * 1000)) * windowSeconds * 1000);
  const row = await prisma.rateLimit.upsert({
    where: { key_windowStart: { key, windowStart } },
    create: { key, windowStart },
    update: { count: { increment: 1 } },
  });
  if (Math.random() < 0.02) void prisma.rateLimit.deleteMany({ where: { windowStart: { lt: new Date(Date.now() - 2 * 86400_000) } } }).catch(() => {});
  return row.count <= max;
}

export async function turnstileOk(token: string | undefined, ip: string) {
  const key = process.env.TURNSTILE_SECRET_KEY;
  if (!key) return true; // not configured: bot check skipped
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret: key, response: token, remoteip: ip }),
  });
  return ((await res.json()) as { success?: boolean }).success === true;
}
