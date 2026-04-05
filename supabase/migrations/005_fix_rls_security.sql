-- 005_fix_rls_security.sql
--
-- Fixes three RLS/storage security gaps identified in audit:
--
--   1. profiles.is_admin could be self-escalated by any authenticated user
--   2. audio storage was readable by anon (no subscription required)
--   3. archive storage was readable by any authenticated user (no subscription required)

-- ── 1. Lock is_admin against client-side changes ─────────────────────────────
--
-- The previous policy only checked that the row ID matched auth.uid(), which
-- allowed any authenticated user to run:
--   supabase.from('profiles').update({ is_admin: true }).eq('id', userId)
-- and gain full admin panel access. The new with check re-reads the current
-- is_admin value so a client can never change it in either direction.

drop policy "Users can update own profile" on public.profiles;

create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and is_admin = (select p.is_admin from public.profiles p where p.id = auth.uid())
  );


-- ── 2. Restrict audio storage to authenticated users ─────────────────────────
--
-- The previous policy granted anon read access to every object in the audio
-- bucket. Episode row RLS hides audio_url from unauthenticated DB queries, but
-- anyone who obtained or guessed a storage URL could stream subscriber audio
-- without credentials. Requiring authentication closes that gap.
--
-- Note: for full subscriber-only enforcement, audio URLs for gated episodes
-- should be delivered as short-lived signed URLs generated server-side after
-- a subscription check, not as permanent public URLs.

drop policy "Public audio readable" on storage.objects;

create policy "Audio readable by authenticated users" on storage.objects
  for select to authenticated
  using (bucket_id = 'audio');


-- ── 3. Restrict archive storage to active subscribers ────────────────────────
--
-- The previous policy required only authentication, not a subscription. Any
-- free-tier logged-in user who had an archive file path could download the
-- file directly. This policy enforces the same plan-tier check used for
-- archive_items row visibility.

drop policy "Authenticated can read archive" on storage.objects;

create policy "Subscribers can read archive" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'archive'
    and exists (
      select 1 from public.subscribers s
      where s.user_id = auth.uid()
        and s.status = 'active'
        and s.plan in ('descender', 'patron')
    )
  );
