-- Barefoot Mary: Core Schema
-- Applied to project: tbilpruocixohrbcsnzu (us-east-1)

-- Enums
create type public.visibility as enum ('public', 'subscriber', 'patron');
create type public.submission_status as enum ('pending', 'reviewed', 'accepted', 'declined');
create type public.plan_tier as enum ('free', 'descender', 'patron');
create type public.subscription_status as enum ('active', 'canceled', 'past_due');
create type public.archive_type as enum ('pdf', 'image', 'audio', 'transcript');
create type public.article_tag as enum ('essay', 'primary-source', 'interview', 'reading-list', 'research-note', 'analysis', 'deep-dive');

-- Seasons
create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  number int not null,
  title text not null,
  subtitle text,
  description text,
  numeral text not null default 'I',
  status text not null default 'upcoming' check (status in ('upcoming', 'airing', 'complete')),
  created_at timestamptz not null default now()
);

-- Episodes
create table public.episodes (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.seasons(id) on delete cascade,
  slug text not null,
  number int not null,
  title text not null,
  description text,
  show_notes_json jsonb,
  duration text,
  audio_url text,
  peaks_json_url text,
  visibility public.visibility not null default 'public',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique(season_id, slug)
);

-- Articles (Field Notes)
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body_json jsonb,
  tag public.article_tag not null default 'essay',
  visibility public.visibility not null default 'public',
  author text not null default 'T.S. Strickland',
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- Archive Items
create table public.archive_items (
  id uuid primary key default gen_random_uuid(),
  episode_id uuid references public.episodes(id) on delete set null,
  season_id uuid references public.seasons(id) on delete set null,
  title text not null,
  description text,
  type public.archive_type not null,
  file_path text not null,
  visibility public.visibility not null default 'subscriber',
  created_at timestamptz not null default now()
);

-- Story Submissions
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  description text not null,
  file_path text,
  status public.submission_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- Subscribers
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan public.plan_tier not null default 'free',
  status public.subscription_status not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_episodes_season on public.episodes(season_id);
create index idx_episodes_visibility on public.episodes(visibility);
create index idx_articles_tag on public.articles(tag);
create index idx_articles_visibility on public.articles(visibility);
create index idx_archive_items_episode on public.archive_items(episode_id);
create index idx_archive_items_season on public.archive_items(season_id);
create index idx_archive_items_type on public.archive_items(type);
create index idx_submissions_status on public.submissions(status);
create index idx_subscribers_user on public.subscribers(user_id);
create index idx_subscribers_stripe_customer on public.subscribers(stripe_customer_id);

-- RLS
alter table public.seasons enable row level security;
alter table public.episodes enable row level security;
alter table public.articles enable row level security;
alter table public.archive_items enable row level security;
alter table public.submissions enable row level security;
alter table public.subscribers enable row level security;

-- Seasons: readable by everyone
create policy "Seasons are publicly readable"
  on public.seasons for select to anon, authenticated using (true);

-- Episodes: public ones readable by everyone
create policy "Public episodes are readable by everyone"
  on public.episodes for select to anon, authenticated using (visibility = 'public');

create policy "Subscriber episodes readable by subscribers"
  on public.episodes for select to authenticated
  using (
    visibility in ('subscriber', 'patron')
    and exists (
      select 1 from public.subscribers s
      where s.user_id = auth.uid()
        and s.status = 'active'
        and (
          (visibility = 'subscriber' and s.plan in ('descender', 'patron'))
          or (visibility = 'patron' and s.plan = 'patron')
        )
    )
  );

-- Articles: same gating pattern
create policy "Public articles are readable by everyone"
  on public.articles for select to anon, authenticated using (visibility = 'public');

create policy "Subscriber articles readable by subscribers"
  on public.articles for select to authenticated
  using (
    visibility in ('subscriber', 'patron')
    and exists (
      select 1 from public.subscribers s
      where s.user_id = auth.uid()
        and s.status = 'active'
        and (
          (visibility = 'subscriber' and s.plan in ('descender', 'patron'))
          or (visibility = 'patron' and s.plan = 'patron')
        )
    )
  );

-- Archive: metadata visible to all
create policy "Archive metadata is publicly readable"
  on public.archive_items for select to anon, authenticated using (true);

-- Submissions: anyone can insert
create policy "Anyone can submit a story"
  on public.submissions for insert to anon, authenticated with check (true);

-- Subscribers: users read own record
create policy "Users can read own subscription"
  on public.subscribers for select to authenticated using (user_id = auth.uid());
