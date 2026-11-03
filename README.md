# Oxford Entrepreneurs Alumni Network

Frontend prototype for the Oxford Entrepreneurs Alumni Network website. It includes public content pages, responsive navigation, dummy leadership profiles, demo membership and partnership forms, and a privacy preference banner.

The forms are frontend demonstrations only: submissions are not stored or emailed.

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

## Demo

The latest `main` branch is automatically exported and published to
[GitHub Pages](https://remonetaland.github.io/oenAlumni/).

## Verification

```bash
npm run lint
npm run build
```
