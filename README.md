# thisis.at

thisis.at is a link-in-bio + mini-site builder for artists, venues, and creators.

## Live

- Production: https://thisis-at.vercel.app
- Repository: https://github.com/yong076/thisis_at

## MVP scope included

- Public profile at `/@handle`
- Blocks (link, social, announcement, media, events, place info, embed)
- Dashboard / Editor / Account shell pages
- Trappist read-integration API stub
- Prisma schema draft for accounts, profiles, blocks, and linkage
- API stubs:
  - `GET /api/v1/profiles/[handle]`
  - `GET /api/v1/profiles/id/[profileId]`
  - `GET /api/v1/trappist/events`

## Local run

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploy to Vercel

1. Create Vercel project and link.
2. Add env variables from `.env.example`.
3. For DB, use Vercel Postgres and set `DATABASE_URL`.
4. Deploy with:

```bash
vercel --prod
```

## DB status

- Connected integration: Prisma Postgres (`thisis-at-db`)
- Injected env vars: `DATABASE_URL`, `PRISMA_DATABASE_URL`, `POSTGRES_URL`
