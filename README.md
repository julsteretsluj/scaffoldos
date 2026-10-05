# Scaffold OS (Scaffold Operating System)

Zero-data LMS / course engine. No mock courses or seed content — empty states first.

## Stack

- Next.js (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- PostgreSQL + Prisma
- React Hook Form + Zod
- Zustand (builder UI state)
- Lucide icons

## Branding (two layers)

| Layer | Asset | Use |
|-------|--------|-----|
| **System** | `public/brand/logo-scaffold-os.png` | Product header, landing, empty product states, favicon |
| **School** | `public/brand/logo-school-*` | Learner chrome / tenant identity |

See `docs/BRANDING.md` for the full usage map.

## Setup

```bash
cp .env.example .env
# Edit DATABASE_URL to your Postgres instance

npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Key routes

- `/` — Product landing (Scaffold OS brand)
- `/portal` — Role portal picker (student / teacher / admin / leadership / parent / tutor)
- `/portal/[role]` — Role dashboard + module shortcuts
- `/school` — School desk (tenant LMS modules)
- `/courses` — Author catalog (empty state if none)
- `/courses/new` — Create course
- `/courses/[id]/edit` — Outline builder
- `/courses/[id]/settings` — Metadata + publish lifecycle
- `/learn/[slug]` — Learner player (school brand)

See `docs/FEATURE_CHECKLIST.md` for PDF + LMS coverage.
