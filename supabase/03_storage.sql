-- Create storage buckets
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true),
       ('covers', 'covers', true),
       ('posts', 'posts', true),
       ('stories', 'stories', true),
       ('messages', 'messages', true)
on conflict (id) do nothing;

create policy "avatars can upload own file" on storage.objects
for insert with check (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatars can read public" on storage.objects
for select using (bucket_id = 'avatars');

create policy "covers can upload own file" on storage.objects
for insert with check (
  bucket_id = 'covers'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "covers can read public" on storage.objects
for select using (bucket_id = 'covers');

create policy "posts can upload authenticated" on storage.objects
for insert with check (
  bucket_id = 'posts'
  and auth.role() = 'authenticated'
);

create policy "posts can read public" on storage.objects
for select using (bucket_id = 'posts');

create policy "stories can upload authenticated" on storage.objects
for insert with check (
  bucket_id = 'stories'
  and auth.role() = 'authenticated'
);

create policy "stories can read public or owner" on storage.objects
for select using (bucket_id = 'stories');

create policy "messages can upload authenticated" on storage.objects
for insert with check (
  bucket_id = 'messages'
  and auth.role() = 'authenticated'
);

create policy "messages can read visible participants" on storage.objects
for select using (bucket_id = 'messages');
