@AGENTS.md

# Barefoot Mary — Project Context

Barefoot Mary is a podcast/media platform. The public site serves episodes, field-note articles, and an archive with three tiers of content visibility (`public`, `subscriber`, `patron`). An admin panel provides a full CMS. Stripe handles subscriptions; Supabase handles everything else (database, auth, storage, RLS).

---

## Supabase Client Selection

There are four Supabase helpers in `src/lib/supabase/`. Use the right one for the context — using the wrong client will either silently fail or bypass security.

| File | Use when |
|------|----------|
| `client.ts` | Client Components (browser only) |
| `server.ts` | Server Components and Route Handlers |
| `admin.ts` | Server Actions that need to bypass RLS (use sparingly) |
| `middleware.ts` | `middleware.ts` only — refreshes the session cookie |

Never create a Supabase client outside these files.

---

## Content Visibility & RLS

Every piece of content (`episodes`, `articles`, `archive_items`) has a `visibility` column: `public`, `subscriber`, or `patron`. Access is enforced by Postgres RLS policies — not by application code. The `server.ts` client respects RLS automatically. Only `admin.ts` bypasses it.

Subscription tiers map to visibility:
- `descender` plan → can access `subscriber` content
- `patron` plan → can access `subscriber` and `patron` content

---

## Admin Area

- Route prefix: `/admin`
- All data mutations go through Server Actions in `src/app/admin/_actions/` — never add inline mutations inside page components.
- Admin access is gated by `is_admin = true` on the `profiles` table.

---

## Rich Text

Articles (`body_json`) and episode show notes (`show_notes_json`) are stored as Tiptap JSON. When reading or writing these fields, use the Tiptap editor configured in `src/lib/tiptap/extensions.ts`. Do not write raw ProseMirror or add new Tiptap extensions without updating that file.

---

## File Uploads

Use the upload helpers — do not write raw Supabase Storage calls:

| Helper | Purpose |
|--------|---------|
| `src/lib/supabase/uploadImage.ts` | Season/episode/article featured images |
| `src/lib/supabase/uploadAudio.ts` | Episode audio files |
| `src/lib/supabase/uploadArchiveFile.ts` | Archive PDFs, transcripts, etc. |

The Server Actions body size limit is set to 500 MB in `next.config.ts` to support large audio uploads.

---

## TypeScript Types

All database entity types are in `src/types/database.ts`. Import from there — do not inline type definitions for DB records.
