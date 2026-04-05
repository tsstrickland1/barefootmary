-- 007_images_bucket.sql
--
-- Creates a public storage bucket for featured images (seasons, episodes, articles).
-- Images are publicly readable. Uploads are performed server-side via the service
-- role key (which bypasses RLS), so no authenticated upload policy is required.

insert into storage.buckets (id, name, public) values ('images', 'images', true);

-- Public read: all objects in the images bucket are publicly accessible.
-- This is redundant with the public bucket flag but makes the intent explicit.
create policy "Images are publicly readable"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'images');
