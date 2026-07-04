# RCR Admin Portal — Setup Guide

The site reads fellows from Supabase and falls back to the built-in
snapshot (`src/data/fellows.ts`) whenever Supabase isn't configured, so
nothing breaks before you finish these steps.

## 1. Create the Supabase project (once, ~5 minutes)

1. Go to [supabase.com](https://supabase.com) → **New project** (free tier is fine).
   Sign in with the RCR Google account.
2. When it's ready, open **SQL Editor → New query**, paste the whole
   contents of `supabase/schema.sql`, and click **Run**. This creates the
   `fellows` table, its security rules, and the public `photos` bucket.
3. Open **Authentication → Users → Add user → Create new user**. Use the
   RCR email and a strong password — this is the admin login.
4. Open **Project Settings → API** and copy three values.

## 2. Configure the site

Copy `.env.example` to `.env.local` and paste in the values:

```
NEXT_PUBLIC_SUPABASE_URL=...       (Project URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  (anon public key)
SUPABASE_SERVICE_ROLE_KEY=...      (service_role key — keep secret)
```

On **Vercel**: add the same three variables under
**Project → Settings → Environment Variables**, then redeploy.

## 3. Load the current cohort (once)

```
npx tsx scripts/seed.ts
```

This uploads all 54 fellows and their photos from `public/fellows/` into
Supabase. It refuses to run twice, so it can't duplicate anyone.

## 4. Use the portal

- Visit **/admin** (e.g. `https://your-site.vercel.app/admin`).
- Sign in with the user from step 1.3.
- **Fellows** lets you add, edit, or remove fellows, upload photos, and
  star/unstar who appears in the homepage strip.
- Public pages refresh within **60 seconds** of a change.

## Notes

- The `service_role` key is only used by the seed script on your
  machine. The website and admin portal never use it.
- Anyone you add as a user in Supabase **Authentication** can edit
  content; remove users there to revoke access.
- Next content types (partners, impact stats, page copy) follow the same
  pattern: a table in `schema.sql`, a card in `/admin`, and a fetch in
  `src/lib/content.ts`.
