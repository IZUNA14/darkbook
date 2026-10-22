-- Optional demo seed data for local testing only.
-- Use in a fresh database for smoke testing, not production.

insert into public.profiles (id, email, username, full_name, avatar_url, bio, location, is_public, is_active)
values (
  '11111111-1111-1111-1111-111111111111',
  'admin@darkbook.test',
  'admin',
  'Dark Admin',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'Platform operator',
  'London, UK',
  true,
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'nyx@darkbook.test',
  'nyxvoss',
  'Nyx Voss',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  'Private thinker. Public signal.',
  'Berlin, DE',
  true,
  true
),
(
  '33333333-3333-3333-3333-333333333333',
  'vesper@darkbook.test',
  'vesper',
  'Vesper',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'Night strategist',
  'Paris, FR',
  true,
  true
)
on conflict (id) do nothing;

insert into public.posts (id, author_id, content, visibility)
values (
  '44444444-4444-4444-4444-444444444444',
  '22222222-2222-2222-2222-222222222222',
  'The city is loud. The signal is clearer after midnight.',
  'public'
),
(
  '55555555-5555-5555-5555-555555555555',
  '33333333-3333-3333-3333-333333333333',
  'Private rooms. Public masks. We can still build a more honest internet.',
  'friends'
)
on conflict (id) do nothing;

insert into public.comments (id, post_id, author_id, text)
values (
  '66666666-6666-6666-6666-666666666666',
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333333',
  'Every signal matters.'
)
on conflict (id) do nothing;

insert into public.friend_requests (id, sender_id, receiver_id, status)
values (
  '77777777-7777-7777-7777-777777777777',
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'pending'
)
on conflict (id) do nothing;

insert into public.notifications (id, user_id, source_user_id, type, message, is_read)
values (
  '88888888-8888-8888-8888-888888888888',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  'like',
  'Vesper liked your post.',
  false
)
on conflict (id) do nothing;
