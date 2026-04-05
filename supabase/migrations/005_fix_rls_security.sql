-- 005_fix_rls_security.sql
--
-- Fixes three RLS / storage security gaps identified in audit:
--
--   1. profiles.is_admin could be self-escalated by any authenticated user
--   2. audio storage had no subscription enforcement (all objects readable by anon)
--   3. archive storage had no subscription enforcement (readable by any authenticated user)
--
-- Free-tier / public content remains accessible to unauthenticated users.
-- Storage policies join to the content tables so visibility is enforced
-- per-object, consistent with the episode / article RLS on the DB tables.


-- ── 1. Lock is_admin against client-side changes ────────────────────────────
--
-- The previous policy only checked that the row ID matched auth.uid(), which
-- allowed any authenticated user to self-grant admin access. The new
-- with check re-reads the stored is_admin value so a client can never change
-- it in either direction.

drop policy "Users can update own profile" on public.profiles;

create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and is_admin = (select p.is_admin from public.profiles p where p.id = auth.uid())
  );


-- ── 2. Audio storage: gate by episode visibility ─────────────────────────────
--
-- Public episodes must remain streamable by unauthenticated users.
-- Subscriber / patron episode audio requires an active subscription.
-- The join on audio_url ensures only files actually referenced by an episode
-- are accessible (no guessing random object names in the bucket).

drop policy "Public audio readable" on storage.objects;

create policy "Public episode audio readable by everyone"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'audio'
    and exists (
      select 1 from public.episodes e
      where e.visibility = 'public'
        and e.audio_url is not null
        and e.audio_url like '%' || name
    )
  );

create policy "Subscriber audio readable by active subscribers"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'audio'
    and exists (
      select 1 from public.episodes e
      where e.visibility in ('subscriber', 'patron')
        and e.audio_url is not null
        and e.audio_url like '%' || name
        and exists (
          select 1 from public.subscribers s
          where s.user_id = auth.uid()
            and s.status = 'active'
            and (
              (e.visibility = 'subscriber' and s.plan in ('descender', 'patron'))
              or (e.visibility = 'patron' and s.plan = 'patron')
            )
        )
    )
  );


-- ── 3. Archive storage: gate by archive_item visibility ──────────────────────
--
-- Public archive items must be downloadable by unauthenticated users.
-- Subscriber / patron archive files require an active subscription.
-- The join on file_path mirrors the episode visibility pattern above.

drop policy "Authenticated can read archive" on storage.objects;

create policy "Public archive files readable by everyone"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'archive'
    and exists (
      select 1 from public.archive_items ai
      where ai.visibility = 'public'
        and ai.file_path like '%' || name
    )
  );

create policy "Subscriber archive files readable by active subscribers"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'archive'
    and exists (
      select 1 from public.archive_items ai
      where ai.visibility in ('subscriber', 'patron')
        and ai.file_path like '%' || name
        and exists (
          select 1 from public.subscribers s
          where s.user_id = auth.uid()
            and s.status = 'active'
            and (
              (ai.visibility = 'subscriber' and s.plan in ('descender', 'patron'))
              or (ai.visibility = 'patron' and s.plan = 'patron')
            )
        )
    )
  );
