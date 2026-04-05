-- Associate archive items with field notes (articles)
-- Associate field notes (articles) with seasons

-- Add article_id to archive_items so a primary source can be linked to a field note
alter table public.archive_items
  add column article_id uuid references public.articles(id) on delete set null;

create index idx_archive_items_article on public.archive_items(article_id);

-- Add season_id to articles so field notes can be grouped by season
alter table public.articles
  add column season_id uuid references public.seasons(id) on delete set null;

create index idx_articles_season on public.articles(season_id);
