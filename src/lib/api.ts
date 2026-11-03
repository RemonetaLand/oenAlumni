import { z } from "zod";
import { allow, clientIp, turnstileOk } from "./security";

export const ok = () => Response.json({ ok: true });
export const bad = (error: string, status = 400) => Response.json({ ok: false, error }, { status });

/**
 * Shared front door for the public form endpoints: parse + validate, honeypot, bot check, per-IP rate limit.
 * A filled honeypot gets a normal-looking success so bots learn nothing.
 */
export async function guard<T extends z.ZodType<{ website?: string; turnstile?: string }>>(
  req: Request, schema: T, scope: string, perHour = 10,
): Promise<{ data: z.infer<T>; ip: string } | { response: Response }> {
  const ip = clientIp(req);
  let body: unknown;
  try { body = await req.json(); } catch { return { response: bad("Invalid request") }; }
  if (typeof body === "object" && body && (body as { website?: unknown }).website) return { response: ok() };
  const parsed = schema.safeParse(body);
  if (!parsed.success) return { response: bad("Please check the highlighted fields and try again.") };
  if (!(await allow(`${scope}:ip:${ip}`, perHour, 3600))) return { response: bad("Too many attempts. Please try again later.", 429) };
  if (!(await turnstileOk(parsed.data.turnstile, ip))) return { response: bad("Bot check failed. Please reload and try again.") };
  return { data: parsed.data, ip };
}
