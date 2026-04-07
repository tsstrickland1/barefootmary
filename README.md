# Barefoot Mary

A podcast and media platform with public and subscriber-gated content, an admin CMS, and a listener story submission system.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.2 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript 5 |
| Database / Auth / Storage | Supabase (`@supabase/ssr`) |
| Payments | Stripe 21 |
| Rich text editor | Tiptap 3 |
| Audio waveform | WaveSurfer.js 7 |
| Notifications | Sonner 2 |

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account with two subscription prices configured

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment template and fill in your values:
   ```bash
   cp .env.local.example .env.local
   ```

3. Apply the database migrations in order using the Supabase dashboard SQL editor or CLI:
   ```
   supabase/migrations/001_create_core_tables.sql
   supabase/migrations/002_storage_buckets.sql
   supabase/migrations/003_add_image_urls.sql
   supabase/migrations/004_add_profiles_table.sql
   supabase/migrations/005_fix_rls_security.sql
   supabase/migrations/006_article_season_associations.sql
   supabase/migrations/007_images_bucket.sql
   supabase/migrations/008_seed_initial_content.sql
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `SUPABASE_SECRET_KEY` | Supabase service role key — server-only, bypasses RLS |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_PRICE_DESCENDER` | Stripe Price ID for the Descender tier |
| `STRIPE_PRICE_PATRON` | Stripe Price ID for the Patron tier |

## Subscription Tiers

| Plan | Description |
|------|-------------|
| `free` | Authenticated user, no paid subscription |
| `descender` | Paid subscriber — accesses `subscriber`-visibility content |
| `patron` | Higher-tier paid subscriber — accesses all content including `patron`-visibility |

Content visibility is enforced at the database level via Supabase Row Level Security policies. The three visibility values are `public`, `subscriber`, and `patron`.

## Project Structure

```
src/
├── app/
│   ├── (site)/              # Public-facing site
│   │   ├── page.tsx         # Home
│   │   ├── about/
│   │   ├── episodes/        # [seasonSlug]/[episodeSlug]
│   │   ├── field-notes/     # [slug]
│   │   ├── archive/         # [id]
│   │   ├── subscribe/
│   │   ├── share-your-story/
│   │   ├── login/ signup/ account/
│   │   └── api/             # Route Handlers (auth, checkout, billing-portal, stripe webhook)
│   ├── admin/
│   │   ├── (panel)/         # Admin CMS (episodes, articles, seasons, archive, submissions, subscribers)
│   │   ├── _actions/        # Server Actions for all admin mutations
│   │   └── login/
│   └── layout.tsx / globals.css / not-found.tsx
├── components/              # React components grouped by feature
├── lib/
│   ├── supabase/            # client.ts · server.ts · admin.ts · middleware.ts · upload helpers
│   └── tiptap/              # editor extensions
└── types/
    └── database.ts          # Shared TypeScript types for all DB entities
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
