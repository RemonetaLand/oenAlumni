# oenAlumni.com – Requirements & Checklist

Source: email from Hadley Barrett, "New web pages". Status checked against the repo on 2 Nov 2026.

- Hosting: Vercel (from `main`) + Neon Postgres. The GitHub Pages prototype was retired on 3 Nov 2026.
- Target domain: **oenAlumni.com**
- Live checklist artifact: https://claude.ai/artifact/73RUm5dF8Tao3NbNemXo7n (kept in sync after every commit)

**Owners:** `Aman` (you) · `Claude` · `Both` · `Taen` (domain / DNS / email, per the email). Status: ✅ done · 🟡 partly done / needs confirming · ⬜ open.

---

## 1. Site-wide requirements

| # | Requirement (from email) | Owner | Status | Notes |
|---|---|---|---|---|
| S1 | Simple site on oenAlumni.com using the same greyed-out / light building background as Oxford Sustainable | Claude | 🟡 | Light grey backdrop is on every page, but uses an Unsplash stand-in. Need the exact Oxford Sustainable image file (see S2). |
| S2 | Provide the exact background image used on Oxford Sustainable | Both | ⬜ | Aman or Hadley to supply the file; Claude swaps it in (also removes the external Unsplash dependency). |
| S3 | Logo is the text "Oxford Entrepreneurs Network" | Claude | ✅ | In `src/components/header.tsx`. The email body also says "Alumni Network" elsewhere; confirm the logo wording (see Questions). |
| S4 | Menu is plain words, not a dropdown, left to right, half the logo size, under the logo | Claude | ✅ | Menu: About Us, Contact, Partners & Sponsors. |
| S5 | "Join Us" as a top-line item next to the logo, like Oxford Sustainable | Claude | ✅ | Button at top right of the header. |
| S6 | Privacy policy & cookies page, linked from the bottom of the page, not the top menu | Claude | ✅ | Linked from the footer only. |
| S7 | Cookie / privacy approval like Oxford Sustainable, text "Oxford Entrepreneurs Alumni Network", privacy approval only, all or nothing | Claude | ✅ | `cookie-notice.tsx`: Accept / Decline (Decline leaves the site). No cookie details yet, as requested. |
| S8 | Discuss further design once the site is online | Both | ⬜ | After go-live. |

## 2. Pages

| # | Page | Requirement | Owner | Status | Notes |
|---|---|---|---|---|---|
| P1 | Home | Photo and name of the group | Claude | 🟡 | Name and tagline are there; there is no photo (only the background). Need the photo from Hadley. |
| P1b | Home | Supply the home photo | Both | ⬜ | |
| P2 | About Us | Use the supplied text; all text with the same spacing (0 point) | Claude | 🟡 | Text is in. Spacing is currently 1.7 line-height with heading gaps; clarify "0 point" and match it (see Questions). |
| P3 | Join Us | Form that saves to a free, easy-to-access/export database | Claude | 🟡 | Form UI is done (S-forms below). Nothing is saved yet. |
| P4 | Contact | Hadley and Manjiri short summaries, format "photo – text / photo – text"; Hadley's photo for now | Claude | ✅ | Bios, LinkedIn links and photos are in. |
| P4b | Contact | Final photo for Manjiri (and a better one for Hadley if wanted) | Both | ⬜ | Swap files in `public/team/`. |
| P5 | Privacy policy & cookies | Real policy text | Both | ⬜ | Page currently holds placeholder text marked as a draft. Needs approved wording before real data is collected. |
| P6 | Partners & Sponsors | Intro text plus partner form | Claude | ✅ | UI done; saving and email still open (F5). |

## 3. Forms

### Join Us (`/JoinUs`)
Fields (all free text): First Name\*, Surname\*, Telephone\*, Email\*, Address / City / Postcode / Country, College\*, Year of matriculation\*, Alumni number (optional), Other details (optional, 500 characters).
Consents (stored in the DB): the first two are **required** to submit: data saved/processed (incl. aggregate stats), necessary emails and newsletter. Optional: event invitations, share with Oxford alumni office, share with vetted third parties, alumni communication groups (e.g. WhatsApp), volunteer / support / sponsor.
Behaviour: unfilled required fields highlight red on Submit; a confirmation email is sent to the address entered.

### Change my status
Email + the five optional consents. Email is checked against the DB; if it matches, an email is sent with the new details. If not, no error and no change.

### Partners & Sponsors
First Name\*, Surname\*, Company (optional), Telephone\*, Email\*, Details (optional, 500 characters). Saved to the DB under "partners" and emailed to Hadley (HB).

| # | Requirement | Owner | Status | Notes |
|---|---|---|---|---|
| F1 | Join form fields, required markers, 500-char limit, red highlight on missing, first two consents required | Claude | ✅ | `join-form.tsx`, `fields.tsx`; validation runs in the browser. |
| F2 | "Change my status" form UI | Claude | ✅ | |
| F3 | Partner form UI | Claude | ✅ | |
| F4 | Choose and set up a free database that is easy to access and export | Both | ⬜ | Site is static on GitHub Pages, so it needs an external store. Options: Supabase free tier, Google Sheets via Apps Script. Aman picks, Claude wires it up. |
| F5 | Save Join, Status changes and Partner submissions (table "partners") to the DB | Claude | ⬜ | Blocked by F4. Server only does saving and security checks; everything else stays client-side. |
| F6 | Confirmation email to the member after Join | Claude | ⬜ | Needs an email sender and the oenAlumni.com domain verified (T3). |
| F7 | Status change: check email against DB; send email if matched, silent otherwise | Claude | ⬜ | Blocked by F4, F6. |
| F8 | Email Hadley (HB) when a Partner form is submitted | Claude | ⬜ | Blocked by F4, F6. |
| F9 | Remove "Demo only" wording from success messages once saving works | Claude | ⬜ | |

Full backend detail (data model, endpoints, emails, security, build tasks B1–B14) is in [BACKEND.md](BACKEND.md).

## 4. Domain, hosting and email (asked of Taen)

| # | Requirement | Owner | Status | Notes |
|---|---|---|---|---|
| T1 | Set up oenAlumni.com domain, DNS, HTTPS, malware protection (Namecheap) | Taen | ⬜ | |
| T2 | Point the domain at the site (GitHub Pages custom domain) | Both | ⬜ | Claude adds the `CNAME` / config; Taen sets the DNS records. Also switch `basePath` from `/oenAlumni` to none. |
| T3 | Verify domain for sending email (SPF / DKIM) | Taen | ⬜ | Needed for F6–F8. |
| T4 | Mailbox forward: Info@oenAlumni.com → Hadley and Manjiri | Taen | ⬜ | |
| T5 | Mailbox forward: hadley.Barrett@oenAlumni.com → HB@OxfordSustainable.com | Taen | ⬜ | |
| T6 | Mailbox forward: Manjiri.Gokhale@oenAlumni.com → manjiri.gokhale@hotmail.com | Taen | ⬜ | |

## 5. Urgent ask

| # | Requirement | Owner | Status | Notes |
|---|---|---|---|---|
| U1 | **Send Hadley the Join Us link asap** so a QR code for a banner can be made (page need not be finished) | Aman | ⬜ | Current link: https://remonetaland.github.io/oenAlumni/JoinUs/. Recommendation: make the QR code point at `https://oenAlumni.com/JoinUs/` once T1/T2 are done, so the printed banner keeps working. If the banner is printed first, use the GitHub link and add a redirect later. |

---

## Questions to confirm with Hadley

1. Logo wording: the email says logo = "Oxford Entrepreneurs Network", but everything else says "Oxford Entrepreneurs Alumni Network". Which is the logo text?
2. "Same spacing (0 point)" on About Us: no extra space between paragraphs, or uniform line spacing?
3. Which photo for the home page?
4. Preferred database: anything Hadley already uses (e.g. Google Sheets) so exports are easy?
5. Copy typos in the email ("Guernsey,,", "ffor") were not copied across; Hadley's bio has had the "Founder since age 14" highlight removed in the contact card.

## How deployment works

Pushing to `main` triggers `.github/workflows/deploy-pages.yml`, which builds the static export (`out/`) and publishes it to GitHub Pages. No `gh-pages` branch is involved. When the domain goes live, `basePath` in `next.config.ts` must change (T2).
