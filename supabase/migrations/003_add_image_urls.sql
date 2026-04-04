-- Add optional featured image URL to seasons, episodes, and articles
alter table public.seasons add column image_url text;
alter table public.episodes add column image_url text;
alter table public.articles add column image_url text;
