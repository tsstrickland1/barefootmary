<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Barefoot Mary — Agent Rules

## Supabase Client Selection

Four clients exist in `src/lib/supabase/`. Pick the correct one or you will either hit auth errors or silently bypass Row Level Security.

| File | Allowed contexts |
|------|-----------------|
| `client.ts` | Client Components only |
| `server.ts` | Server Components, Route Handlers |
| `admin.ts` | Server Actions that must bypass RLS — use only when necessary |
| `middleware.ts` | `src/middleware.ts` only |

**Never instantiate a Supabase client anywhere else.**

---

## Admin Mutations

All create/update/delete operations in the admin panel must go through Server Actions in `src/app/admin/_actions/`. Do not add inline `fetch`, `supabase.*`, or form actions directly inside page or layout components under `src/app/admin/(panel)/`.

---

## Row Level Security

The `server.ts` client is subject to RLS. The `admin.ts` client bypasses it. Only use `admin.ts` inside server actions where elevated access is explicitly required (e.g. writing data on behalf of any user, reading subscriber records for Stripe webhooks). Never use it to read content that should be gated.

---

## Routing Conventions

| Area | Path prefix |
|------|-------------|
| Public site | `src/app/(site)/` |
| Admin panel | `src/app/admin/(panel)/` |
| API / Route Handlers | `src/app/(site)/api/` |

---

## Database Types

All entity types (`Season`, `Episode`, `Article`, `ArchiveItem`, `Submission`, `Subscriber`) are defined in `src/types/database.ts`. Always import from there. Do not redeclare or inline these types.

---

## Rich Text (Tiptap)

Articles and show notes are stored as Tiptap JSON (`body_json`, `show_notes_json`). Always use the extensions configured in `src/lib/tiptap/extensions.ts`. Do not add new extensions without updating that file.

---

## File Uploads

Use the existing helpers — do not write raw Supabase Storage calls:

- `src/lib/supabase/uploadImage.ts` — featured images
- `src/lib/supabase/uploadAudio.ts` — episode audio
- `src/lib/supabase/uploadArchiveFile.ts` — PDFs, transcripts, etc.

---

## Middleware

Read `src/middleware.ts` before touching it. The session refresh logic uses `src/lib/supabase/middleware.ts` and must not be broken — it keeps auth cookies alive across the app.
