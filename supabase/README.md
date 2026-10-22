# Supabase setup for darkbook

## 1. Create a project
1. Go to https://supabase.com
2. Sign in and create a new project
3. Give it a name such as `darkbook`
4. Choose a region
5. Save the project

## 2. Open the SQL editor
Run these files in order:
- `supabase/01_schema.sql`
- `supabase/02_rls.sql`
- `supabase/03_storage.sql`
- `supabase/04_seed.sql` (optional, only for a test project)

## 3. Add environment variables
In your app config, add:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Inside the frontend, update:
- `js/config.js`

## 4. Configure auth
In Supabase dashboard:
- Authentication > Settings
- Enable Email provider
- Ensure site URL points to your frontend domain
- Add localhost if testing locally

## 5. Configure storage buckets
Create or use these buckets:
- `avatars`
- `covers`
- `posts`
- `stories`
- `messages`

## 6. Important backend rules
- Never push supabase service-role key to frontend files
- Use RLS to restrict access
- Validate file types and uploads on backend
- Confirm user permissions match visibility rules

## 7. Deployment split
For Tor / OnionShare architecture:
- Keep the frontend static and host it over OnionShare
- Keep Supabase backend separate and reachable
- Auth and DB must remain active for registration and messaging to work
