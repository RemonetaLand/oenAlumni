import { esc, sendEmail, siteUrl } from "./email";
import { OptionalConsents } from "./validation";

const NAME = "Oxford Entrepreneurs Alumni Network";
const labels: Record<keyof OptionalConsents, string> = {
  events: "Event invitations, informational and educational knowledge",
  shareOxford: "Share my details with Oxford University’s alumni office",
  shareThirdParties: "Share my data with vetted and curated third parties",
  commGroups: "Be added to alumni communication groups (for example WhatsApp)",
  volunteer: "Open to act as a volunteer, support and/or sponsor the network",
};

const wrap = (body: string) =>
  `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1b2430;max-width:560px">${body}<p style="color:#6b7480;font-size:12px;margin-top:28px">${NAME} · info@oenalumni.com</p></div>`;
const button = (href: string, label: string) =>
  `<p><a href="${href}" style="background:#002147;color:#fff;padding:12px 22px;text-decoration:none;border-radius:4px;display:inline-block">${label}</a></p><p style="font-size:13px;color:#6b7480">If the button does not work, copy this link: ${href}</p>`;
const consentList = (c: OptionalConsents) =>
  Object.entries(labels).map(([k, l]) => `${c[k as keyof OptionalConsents] ? "✔" : "✘"} ${l}`);

export async function sendJoinConfirmation(to: string, firstName: string, token: string) {
  const link = `${siteUrl()}/confirm?token=${token}`;
  await sendEmail({
    to, subject: `Confirm your email – ${NAME}`,
    text: `Hello ${firstName},\n\nPlease confirm your email address to complete your membership request:\n${link}\n\nThe link is valid for 7 days. If you did not request this, ignore this email.`,
    html: wrap(`<p>Hello ${esc(firstName)},</p><p>Please confirm your email address to complete your membership request.</p>${button(link, "Confirm my email")}<p>The link is valid for 7 days. If you did not request this, ignore this email.</p>`),
  });
}

export async function sendAlreadyMember(to: string, firstName: string) {
  await sendEmail({
    to, subject: `You are already registered – ${NAME}`,
    text: `Hello ${firstName},\n\nSomeone (hopefully you) used this email to join again. You are already registered, so nothing has changed. To update your preferences, use "Change my status" at ${siteUrl()}/JoinUs`,
    html: wrap(`<p>Hello ${esc(firstName)},</p><p>Someone (hopefully you) used this email to join again. You are already registered, so nothing has changed.</p><p>To update your preferences, use “Change my status” at <a href="${siteUrl()}/JoinUs">${siteUrl()}/JoinUs</a>.</p>`),
  });
}

export async function sendWelcome(to: string, firstName: string, c: OptionalConsents) {
  const list = consentList(c);
  await sendEmail({
    to, subject: `Welcome – ${NAME}`,
    text: `Hello ${firstName},\n\nYour email is confirmed. Your choices:\n- You agreed to necessary emails and the newsletter\n${list.map((l) => "- " + l).join("\n")}\n\nChange them any time at ${siteUrl()}/JoinUs`,
    html: wrap(`<p>Hello ${esc(firstName)},</p><p>Your email is confirmed. Your choices:</p><ul><li>Necessary emails and the newsletter</li>${list.map((l) => `<li>${esc(l)}</li>`).join("")}</ul><p>Change them any time at <a href="${siteUrl()}/JoinUs">${siteUrl()}/JoinUs</a>.</p>`),
  });
}

export async function sendStatusConfirmation(to: string, firstName: string, c: OptionalConsents, token: string) {
  const link = `${siteUrl()}/confirm?type=status&token=${token}`;
  const list = consentList(c);
  await sendEmail({
    to, subject: `Confirm your preference change – ${NAME}`,
    text: `Hello ${firstName},\n\nYou asked to change your preferences to:\n${list.map((l) => "- " + l).join("\n")}\n\nConfirm here: ${link}\n\nIf this was not you, ignore this email and nothing will change.`,
    html: wrap(`<p>Hello ${esc(firstName)},</p><p>You asked to change your preferences to:</p><ul>${list.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>${button(link, "Confirm the change")}<p>If this was not you, ignore this email and nothing will change.</p>`),
  });
}

export async function sendStatusReceipt(to: string, firstName: string, c: OptionalConsents) {
  const list = consentList(c);
  await sendEmail({
    to, subject: `Your preferences were updated – ${NAME}`,
    text: `Hello ${firstName},\n\nYour preferences are now:\n${list.map((l) => "- " + l).join("\n")}`,
    html: wrap(`<p>Hello ${esc(firstName)},</p><p>Your preferences are now:</p><ul>${list.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>`),
  });
}

export async function sendPartnerNotice(to: string, p: { firstName: string; surname: string; company: string; telephone: string; email: string; request: string }) {
  await sendEmail({
    to, replyTo: p.email, subject: `New partner / sponsor enquiry – ${p.firstName} ${p.surname}`,
    text: `Name: ${p.firstName} ${p.surname}\nCompany: ${p.company || "-"}\nTelephone: ${p.telephone}\nEmail: ${p.email}\n\n${p.request || "(no details)"}`,
    html: wrap(`<p><b>New partner / sponsor enquiry</b></p><p>Name: ${esc(p.firstName)} ${esc(p.surname)}<br>Company: ${esc(p.company) || "-"}<br>Telephone: ${esc(p.telephone)}<br>Email: ${esc(p.email)}</p><p>${esc(p.request) || "(no details)"}</p>`),
  });
}
