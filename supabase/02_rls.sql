alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_media enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;
alter table public.friendships enable row level security;
alter table public.friend_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.pages enable row level security;
alter table public.page_followers enable row level security;
alter table public.stories enable row level security;
alter table public.story_views enable row level security;
alter table public.blocked_users enable row level security;
alter table public.reports enable row level security;
alter table public.admin_roles enable row level security;
alter table public.moderation_actions enable row level security;

create policy "public profile access" on public.profiles
for select using (is_public = true or auth.uid() = id);

create policy "self profile write" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "self profile insert" on public.profiles
for insert with check (auth.uid() = id);

create policy "posts visible by access" on public.posts
for select using (
  visibility = 'public'
  or author_id = auth.uid()
  or exists (
    select 1 from public.friendships f
    where f.user_id = auth.uid()
      and f.friend_id = author_id
      and f.status = 'accepted'
  )
);

create policy "own posts create" on public.posts
for insert with check (author_id = auth.uid());

create policy "own posts modify" on public.posts
for update using (author_id = auth.uid()) with check (author_id = auth.uid());

create policy "own posts delete" on public.posts
for delete using (author_id = auth.uid());

create policy "comments readable on visible post" on public.comments
for select using (
  exists (
    select 1 from public.posts p
    where p.id = post_id
      and (
        p.visibility = 'public'
        or p.author_id = auth.uid()
        or exists (
          select 1 from public.friendships f
          where f.user_id = auth.uid() and f.friend_id = p.author_id and f.status = 'accepted'
        )
      )
  )
);

create policy "own comments create" on public.comments
for insert with check (author_id = auth.uid());

create policy "notifications private" on public.notifications
for select using (user_id = auth.uid());

create policy "notifications update own" on public.notifications
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "friend requests private" on public.friend_requests
for select using (sender_id = auth.uid() or receiver_id = auth.uid());

create policy "friendships private" on public.friendships
for select using (user_id = auth.uid() or friend_id = auth.uid());

create policy "messages visible to participants" on public.messages
for select using (
  exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = conversation_id and cp.user_id = auth.uid()
  )
);

create policy "messages insert if participant" on public.messages
for insert with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = conversation_id and cp.user_id = auth.uid()
  )
);

create policy "groups visible if public or member" on public.groups
for select using (
  is_private = false
  or exists (
    select 1 from public.group_members gm where gm.group_id = id and gm.user_id = auth.uid()
  )
);

create policy "pages visible if public or followed" on public.pages
for select using (
  is_public = true
  or exists (
    select 1 from public.page_followers pf where pf.page_id = id and pf.user_id = auth.uid()
  )
);

create policy "stories visible to owner and active users" on public.stories
for select using (
  user_id = auth.uid() or expires_at > now()
);

create policy "reports private" on public.reports
for select using (
  reporter_id = auth.uid()
  or exists (
    select 1 from public.admin_roles ar where ar.user_id = auth.uid()
  )
);

create policy "admin roles restricted" on public.admin_roles
for select using (
  exists (select 1 from public.admin_roles ar where ar.user_id = auth.uid())
);

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
