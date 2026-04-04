-- Storage buckets
insert into storage.buckets (id, name, public) values ('audio', 'audio', false);
insert into storage.buckets (id, name, public) values ('archive', 'archive', false);
insert into storage.buckets (id, name, public) values ('submissions', 'submissions', false);

-- Audio: public read (signed URLs used for gated content)
create policy "Public audio readable" on storage.objects for select
  to anon, authenticated using (bucket_id = 'audio');

-- Submissions: anyone can upload
create policy "Anyone can upload submissions" on storage.objects for insert
  to anon, authenticated with check (bucket_id = 'submissions');

-- Archive: authenticated read (server actions verify subscription before signing)
create policy "Authenticated can read archive" on storage.objects for select
  to authenticated using (bucket_id = 'archive');
