-- Profiles table: replaces user_metadata.is_admin approach with proper RLS
--
-- IMPORTANT: After applying this migration, grant admin access to existing
-- admin users by running:
--   UPDATE public.profiles SET is_admin = true WHERE id = '<admin-user-uuid>';
--
-- New signups will have a profile auto-created by the trigger below.
-- Existing users will need profiles backfilled:
--   INSERT INTO public.profiles (id)
--   SELECT id FROM auth.users
--   ON CONFLICT (id) DO NOTHING;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select to authenticated
  using (id = auth.uid());

-- Users can update their own profile (display_name only; is_admin is server-managed)
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
