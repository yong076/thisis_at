# Architecture Notes

## Stack

- Next.js 14 App Router (SSR-ready)
- TypeScript strict mode
- Prisma schema targeting Postgres
- Deploy target: Vercel

## Key routes

- Public profile: `app/[handle]/page.tsx`
- Public events: `app/[handle]/events/page.tsx`
- Dashboard: `app/dashboard/page.tsx`
- Editor shell: `app/editor/[handle]/page.tsx`

## API contract stubs

- `GET /api/v1/profiles/[handle]`
- `GET /api/v1/profiles/id/[profileId]`
- `GET /api/v1/trappist/events?artist_id=&place_id=&from=`
- `GET /api/og/[handle]`

## DB model (prisma/schema.prisma)

- `UserAccount`
- `Identity`
- `Profile`
- `Block`

This is intentionally aligned with the PRD ownership split and keeps room for linkage/webhook extensions.
