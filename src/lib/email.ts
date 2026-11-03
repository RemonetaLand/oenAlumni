/** Sends through Resend when RESEND_API_KEY is set, otherwise prints to the server console (dev). */
export async function sendEmail({ to, subject, html, text, replyTo }: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`\n--- EMAIL (not sent, RESEND_API_KEY empty) ---\nTo: ${to}\nSubject: ${subject}\n\n${text}\n----------------------------------------------\n`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "Oxford Entrepreneurs Alumni Network <info@oenalumni.com>",
      to, subject, html, text, reply_to: replyTo,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
export const siteUrl = () => (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
