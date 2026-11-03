import { z } from "zod";

/** Shared by the browser forms (instant feedback) and the API routes (the real check). */
export const CONSENT_VERSION = "2026-11-v1";

export const optionalConsentKeys = ["events", "shareOxford", "shareThirdParties", "commGroups", "volunteer"] as const;
export type OptionalConsents = Record<(typeof optionalConsentKeys)[number], boolean>;

const text = (max = 200) => z.string().trim().min(1).max(max);
const optionalText = (max = 200) => z.string().trim().max(max).default("");
const email = z.string().trim().toLowerCase().email().max(254);

export const optionalConsentSchema = z.object({
  events: z.boolean(), shareOxford: z.boolean(), shareThirdParties: z.boolean(), commGroups: z.boolean(), volunteer: z.boolean(),
});
const optionalConsents = optionalConsentSchema;

export const joinSchema = z.object({
  firstName: text(), surname: text(), telephone: text(50), email,
  address: optionalText(500), college: text(), year: text(20), alumniNumber: optionalText(50), details: optionalText(500),
  consentData: z.literal(true), consentEmails: z.literal(true),
  optional: optionalConsents,
  website: z.string().max(0).optional(), // honeypot
  turnstile: z.string().optional(),
});

export const statusSchema = z.object({
  email, optional: optionalConsents,
  website: z.string().max(0).optional(), turnstile: z.string().optional(),
});

export const partnerSchema = z.object({
  firstName: text(), surname: text(), company: optionalText(), telephone: text(50), email, request: optionalText(500),
  website: z.string().max(0).optional(), turnstile: z.string().optional(),
});

export const tokenSchema = z.object({ token: z.string().min(20).max(200) });
