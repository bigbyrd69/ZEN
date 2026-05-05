-- Posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  media_url text,
  is_public boolean not null default false,
  pen_name varchar(50),
  slug text unique,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "posts_select_public_or_owner"
on public.posts
for select
using (
  is_public = true or auth.uid() = user_id
);

create policy "posts_insert_owner"
on public.posts
for insert
with check (
  auth.uid() = user_id
);

create policy "posts_update_owner"
on public.posts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "posts_delete_owner"
on public.posts
for delete
using (auth.uid() = user_id);

-- Comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "comments_select_visible_post"
on public.comments
for select
using (
  exists (
    select 1 from public.posts p
    where p.id = comments.post_id
      and (p.is_public = true or p.user_id = auth.uid())
  )
);

create policy "comments_insert_world_posts_only"
on public.comments
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.posts p
    where p.id = comments.post_id
      and p.is_public = true
  )
);

create policy "comments_modify_own"
on public.comments
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "comments_delete_own"
on public.comments
for delete
using (auth.uid() = user_id);
