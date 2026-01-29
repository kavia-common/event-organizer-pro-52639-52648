# Supabase integration (Event Organizer Pro)

This app is **Supabase-first** for:
- Email/password authentication
- Event CRUD via Supabase Postgres

## Required environment variables

The frontend expects these variables to be set (provided by the platform `.env`):

- `NG_APP_SUPABASE_URL` – Supabase project URL
- `NG_APP_SUPABASE_KEY` – Supabase anon/public key
- `NG_APP_FRONTEND_URL` – used as `emailRedirectTo` during sign-up (recommended)

Optional (future backend switching):
- `NG_APP_API_BASE`
- `NG_APP_BACKEND_URL`
- `NG_APP_WS_URL`

## Supabase schema

Create a table called `events` with at least:

- `id` uuid primary key default `gen_random_uuid()`
- `user_id` uuid not null
- `title` text not null
- `description` text null
- `location` text null
- `starts_at` timestamptz not null
- `ends_at` timestamptz not null
- `all_day` boolean not null default false
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz null

Recommended indexes:
- index on `(user_id, starts_at)`

## Row Level Security (RLS)

Enable RLS on `events` and use policies:

- SELECT: `auth.uid() = user_id`
- INSERT: `auth.uid() = user_id`
- UPDATE: `auth.uid() = user_id`
- DELETE: `auth.uid() = user_id`

## Notes on notifications

Notifications are currently **UX-only** (in-app toasts + bell list). They are triggered on create/update/delete actions.
This provides the expected product experience and can later be extended to real background notifications.
