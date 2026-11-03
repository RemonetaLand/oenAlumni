# oenAlumni.com – Backend Requirements

> **Update 3 Nov 2026 – stack changed (branch `backend`).** Aman chose plain Postgres (Supabase free projects pause) and the admin panel at `oenAlumni.com/admin-panel`. So the whole site is now **one Next.js app with a server** (route handlers for the form APIs, `/admin-panel` for admins, Postgres for storage, Resend for email), not a static GitHub Pages export. Sections 2, 4 and 8 below describe the original Supabase plan; the data model (3), emails (5), security (6) and flows still apply. Implemented so far: schema + migrations, all five endpoints, form wiring, `/confirm` page, admin login, members and partners tables with search, filter, CSV export and delete. See the "Implementation status" section at the end.


Companion to [REQUIREMENTS.md](REQUIREMENTS.md). The frontend (all pages, forms, validation, privacy banner) is built. This document covers what must exist behind the three forms. Items marked **Decision** need Aman's or Hadley's answer before building.

## 1. Why a backend is needed

The site is a static export on GitHub Pages (`output: "export"`), so it cannot store data or send email. The backend does only what must be server-side: persistence, secrets (email API key), email sending, and security checks. Filtering, formatting and field validation stay in the browser, but the server re-validates everything because browser checks can be bypassed.

## 2. Recommended stack (Decision)

| Part | Choice | Why |
|---|---|---|
| Database | Supabase (Postgres), free tier | Table editor and one-click CSV export satisfy "simple, free, easy to access and export". |
| API | Supabase Edge Functions (one per action) | Keeps the site static; holds secrets; no separate server to run. |
| Email | Resend, sending from `oenAlumni.com` | Simple API; needs SPF/DKIM on the domain (Taen). |
| Bot protection | Cloudflare Turnstile (free) plus a hidden honeypot field | Public forms get spammed; this stops most of it without CAPTCHA puzzles. |

Alternative if Hadley wants a spreadsheet he already knows: Google Sheets through Apps Script. Cheaper to start, but weaker for confirmation tokens, rate limiting and opt-out lookups. Not recommended.

**Free-tier risks to check before launch:** Supabase free projects can pause after a period of inactivity (a paused project makes the join form fail), and Resend free plans have daily and monthly send caps. Confirm current limits; if the pause risk matters, use a scheduled keep-alive or the paid plan.

## 3. Data model

### `members`
| Column | Type | Notes |
|---|---|---|
| id | uuid, pk | |
| first_name, surname | text, required | |
| telephone | text, required | free format |
| email | text, required, **unique on lower(email)** | |
| address | text | one free-format field (address, city, postcode, country) |
| college | text, required | |
| matriculation_year | text, required | free format per the email |
| alumni_number | text | optional |
| notes | text, max 500 | optional |
| status | enum `pending` / `confirmed` / `unsubscribed` | `pending` until the email link is clicked |
| consent_data_processing | bool | required, must be true |
| consent_necessary_emails | bool | required, must be true |
| consent_events | bool | |
| consent_share_oxford | bool | share with Oxford alumni office |
| consent_share_third_parties | bool | vetted, curated third parties |
| consent_comm_groups | bool | e.g. WhatsApp alumni groups |
| consent_volunteer | bool | volunteer / support / sponsor |
| consent_text_version | text | which wording they agreed to |
| confirm_token_hash | text | store a hash, never the raw token |
| confirm_expires_at | timestamptz | e.g. 7 days |
| confirmed_at, created_at, updated_at | timestamptz | |

### `partners`
id, first_name, surname, company, telephone, email, request (max 500), created_at.

### `consent_log` (audit trail)
member_id, before jsonb, after jsonb, source (`join` / `status-change`), created_at. Records every consent change so Hadley can show when and what someone agreed to.

### `status_requests`
member_id, requested_changes jsonb, token_hash, expires_at, used_at. Backs the "Change my status" email link.

**Row Level Security:** enabled on every table with **no** public policies. The browser never reads or writes tables directly; it only calls the Edge Functions, which use the service key stored as a function secret.

## 4. Endpoints (Edge Functions)

All accept JSON via POST from `https://oenAlumni.com` only (CORS locked), verify the Turnstile token, check the honeypot, rate limit by IP, and re-validate every field.

| Function | Input | Behaviour |
|---|---|---|
| `join` | all Join fields + consents | Reject if the two required consents are false or required fields are empty. Insert as `pending`, email a confirmation link. If the email already exists, do **not** reveal it: return the same success message and re-send a confirmation to the address owner. |
| `confirm` | token (from the email link) | Hash the token, check it exists and is unexpired, set `confirmed`, write `confirmed_at`, clear the token. Shows a "you're confirmed" page. |
| `status-request` | email + selected optional consents | Always return the same neutral response. If the email matches a confirmed member, email that address a summary of the requested changes with a confirm link. No match: no email, no error, no change (as the email specifies). |
| `status-confirm` | token | Applies the changes, writes `consent_log`, emails a receipt showing the new settings. |
| `partner` | partner fields | Insert into `partners`, email Hadley (HB) the details. Reply to the sender stays neutral. |

**Decision:** Hadley's note says "an email is sent with the new details". Applying changes the moment someone types an email address would let anyone change another person's consents, so the recommended flow is: send the new details with a confirm link and apply on click. If Hadley wants changes applied immediately, the risk must be accepted in writing.

## 5. Emails

| Email | To | Content |
|---|---|---|
| Join confirmation | the member | Link to confirm; says nothing is stored as active until confirmed. |
| Welcome / receipt (after confirm) | the member | Lists the consents they chose and how to change them. |
| Status change confirmation | the member | Requested new settings plus confirm link. |
| Status change receipt | the member | The final settings. |
| New partner enquiry | Hadley (HB@OxfordSustainable.com) | All submitted fields. |

Sender: `info@oenAlumni.com` (or a no-reply address on the same domain). Needs the domain verified in Resend (SPF/DKIM records added by Taen). Required (necessary) emails never include unsubscribe-only marketing; newsletter and event emails need a working opt-out link.

## 6. Security and privacy

- Honeypot field plus Turnstile on all three forms; per-IP and per-email rate limits in each function.
- Server-side length limits (500 chars for notes and request) and trimming; reject unexpected fields.
- Tokens are random, single-use, expire, and only their hash is stored.
- No account enumeration: join, status-request and confirm responses never say whether an email exists.
- Secrets (service key, Resend key, Turnstile secret) live only in function secrets, never in the repo or the browser. The browser only gets the public function URL and the Turnstile site key.
- UK/EU GDPR: consent timestamp and wording version stored; sharing with the alumni office and third parties only happens for members who ticked it; retention period and deletion/export on request must be written into the privacy policy (P5). The privacy page text must be approved before real data is collected.
- Backups: use Supabase's backups or a scheduled CSV export; Hadley decides how often.

## 7. Export and access

- Hadley and Manjiri get read/export access through the Supabase table editor (CSV export), or a saved SQL view such as "confirmed members with event consent".
- Optional later: a small password-protected admin page. Out of scope unless requested.

## 8. Frontend changes needed (Claude)

- Replace the simulated `submit` in `useRequiredForm` with a `fetch` to the function URL (`NEXT_PUBLIC_API_URL`), with sending, success and error states.
- Add the Turnstile widget and honeypot to the three forms.
- Add a `/confirm` page that reads the token from the link and shows the result.
- Remove the "Demo only" wording from success messages and the README note.
- Update the privacy page to match what is actually collected.

## 9. Build tasks

| # | Task | Owner | Depends on |
|---|---|---|---|
| B1 | Decide stack and the status-change flow (section 2 and 4) | Both | |
| B2 | Create Supabase project, give Claude access | Aman | B1 |
| B3 | Create tables, constraints and RLS (section 3) | Claude | B2 |
| B4 | Create Resend account, verify oenAlumni.com sending domain | Aman + Taen | T1 |
| B5 | Add SPF / DKIM DNS records from Resend | Taen | B4 |
| B6 | Create Turnstile site and keep the secret as a function secret | Aman | |
| B7 | Build `join` + `confirm` functions and emails | Claude | B3, B4 |
| B8 | Build `status-request` + `status-confirm` functions and emails | Claude | B7 |
| B9 | Build `partner` function and email to HB | Claude | B3, B4 |
| B10 | Wire the three forms to the functions; add `/confirm` page | Claude | B7–B9 |
| B11 | Test end to end with a real address: join, confirm, change, partner, duplicate, bad input | Both | B10 |
| B12 | Set up CSV export access for Hadley and Manjiri | Aman | B3 |
| B13 | Approve final privacy policy text and retention period | Both | |
| B14 | Switch to oenAlumni.com, update CORS origin, retest | Both | T2 |

## 10. Implementation status (branch `backend`)

**Built and tested locally** (join, confirm, reuse of a used link, already-member re-join, status request for known and unknown email, status confirm, partner, honeypot, bad input, admin login/logout, unauthenticated redirect, production build):
- **Prisma 7** (stable 7.10.1; the npm `latest` tag is an 8.0 release candidate, so it is pinned): `prisma/schema.prisma`, migrations in `prisma/migrations` (the first one also adds the CHECK rules Prisma cannot express), `src/lib/db.ts` uses the `@prisma/adapter-pg` driver adapter, the client is generated into `src/generated/prisma` (git-ignored, regenerated by `predev`/`prebuild`). Commands: `npm run db:migrate` (dev), `npm run db:deploy` (production), `npm run db:studio`, `npm run admin:create -- <email> "<name>"`. There are no raw SQL queries in the app code.
- `src/lib`: validation (shared with the browser), db (Prisma), security (hashed tokens, Postgres rate limit, Turnstile hook), email (Resend, or console in dev), session (signed 8-hour cookie, checked in every admin page and route, plus an optimistic `proxy.ts` redirect)
- `src/app/api/*`: join, confirm, status-request, status-confirm, partner, admin login/logout, admin delete member/partner
- `/admin-panel`: members (stats, search, status and consent filters, details, CSV export, delete), `/admin-panel/partners`
- Public forms use React Hook Form with the same zod schemas as the server (`src/lib/validation.ts`), so browser and server validate identically, and post to the API; `/confirm` page needs an explicit button click so email scanners cannot confirm for a member.

**Not done yet**
- Hosting for the Next.js server and a hosted Postgres (suggested: Vercel + Neon; note Vercel's free Hobby plan is for non-commercial use, check fit). The GitHub Pages workflow no longer applies to this branch because the site is no longer a static export.
- Resend account and verified domain (needs oenAlumni.com DNS); until then emails print to the server console.
- Turnstile keys (the server check is in; the widget is not added to the forms yet).
- Real per-person admin accounts for Hadley, Manjiri and Aman (for now a single **fixed admin** is set with `ADMIN_EMAIL` / `ADMIN_PASSWORD` in the environment; DB admins from `admin:create` also still work). Set a strong `ADMIN_PASSWORD` in production; production `AUTH_SECRET`; `SITE_URL`; `PARTNER_NOTIFY_EMAIL`.
- Approved privacy policy text; consent wording version (`CONSENT_VERSION`) should be bumped if the wording changes.

**Neon (hosted Postgres).** Project `sweet-mouse-79728633`, branch `production`, set up with the Neon CLI (`neon.ts`, `skills-lock.json`, `.agents/skills`). The app reads `DATABASE_URL_POOLED` at runtime (`src/lib/db.ts`) and `DATABASE_URL_UNPOOLED` for migrations (`prisma.config.ts`); both fall back to `DATABASE_URL`. The `init` migration is applied. On Vercel set `DATABASE_URL_POOLED`, `DATABASE_URL_UNPOOLED`, `AUTH_SECRET`, `SITE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (plus Resend/Turnstile later).
