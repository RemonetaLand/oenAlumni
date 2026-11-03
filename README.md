# Oxford Entrepreneurs Alumni Network

Frontend prototype for the Oxford Entrepreneurs Alumni Network website. It includes public content pages, responsive navigation, dummy leadership profiles, demo membership and partnership forms, and a privacy preference banner.

Forms save to Postgres and send double opt-in confirmation emails (emails print to the server console until `RESEND_API_KEY` is set).

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin panel

The admin is at `/admin-panel` (members, partners, CSV export). For now it uses a single fixed login read from the environment (`ADMIN_EMAIL` and `ADMIN_PASSWORD`, see `.env.example`). The data is not sensitive at this stage; real per-person accounts come later.

Local development login:

- Email: `admin@oenalumni.local`
- Password: `local-admin-pass-1`

Set your own `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`. In production, set both in the host's environment variables and use a different password from the one above.

## Deployment

`main` is a Next.js server app deployed on Vercel with a Neon Postgres database (see `docs/BACKEND.md`). The old GitHub Pages static prototype has been retired.

## Verification

```bash
npm run lint
npm run build
```
