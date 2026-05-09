---
name: dailylog-conventions
description: Use this skill whenever working on the DailyLog Next.js app — any task involving the entries table, Supabase auth, RLS policies, Server Components, Server Actions, or middleware/proxy in this repo. Triggers include keywords entries, journal, RLS, supabase, auth, login, sign up, sign-up, server action, middleware, proxy, dailylog. Do NOT use for unrelated tasks.
---

# DailyLog Conventions

## Stack
- Next.js 15 App Router, TypeScript strict, Tailwind CSS
- `@supabase/ssr` (NOT `@supabase/auth-helpers-nextjs` — deprecated)
- Publishable key `sb_publishable_*`, never legacy `anon` key
- Service / secret keys never appear in any file under `app/` or `components/`
- No client-side data mutations — every write goes through a Server Action

## Database
- Single table: `entries` (plural)
- Columns:
  - `id uuid primary key default gen_random_uuid()`
  - `user_id uuid not null references auth.users(id) on delete cascade`
  - `title text not null check (length(title) between 1 and 120)`
  - `body text not null default ''`
  - `created_at timestamptz not null default now()`
  - `updated_at timestamptz not null default now()`
- RLS **enabled**, four policies (select / insert / update / delete) all scoped by `auth.uid() = user_id`
- Schema changes go in `supabase/migrations/` (timestamp-prefixed SQL files)
- Never bypass RLS from app code; the publishable key alone enforces it

## Auth
- Email + password, email confirmation **ON**
- Server Actions for `signIn` / `signUp` / `signOut` — never client-side `supabase.auth.signInWithPassword` from a `'use client'` component
- Auth callback at `/auth/confirm` (verifies the email OTP via `verifyOtp`)
- Proxy/middleware refreshes session via `supabase.auth.getUser()` (NOT `getSession()` and NOT `getClaims()`)
- After successful sign-in, redirect to `/entries`
- After sign-up, redirect to `/auth/sign-up-success` (waiting-for-email page)

## Files
- Supabase clients live ONLY in `lib/supabase/` (`client.ts`, `server.ts`, `proxy.ts`)
- Server actions live in `actions.ts` next to the page that uses them, with `'use server'` on the very first line
- Components default to **Server**; add `'use client'` only when you need interactivity (form submit pending state, confirm dialogs, theme toggle)
- Forms use `<form action={serverAction}>`, never `onSubmit={handler}` for data mutations

## TypeScript
- `strict: true`, no `any`
- DB types generated via Supabase MCP into `lib/supabase/database.types.ts`
- Server action return shape: `{ error: string } | { ok: true }` (or redirect on success)
- Use generated `Database['public']['Tables']['entries']['Row']` for entry row types

## UI
- Pending state on every async submit button (`useFormStatus` from `react-dom`)
- Every server action error is shown to the user (don't swallow)
- Empty state when the user has zero entries
- Loading skeleton during navigation (`app/entries/loading.tsx`)
- Error boundary (`app/entries/error.tsx`)

## MCP hygiene
- `.mcp.json` is gitignored. Only `.mcp.example.json` is committed (PAT redacted)
- Default `read_only=true` in the MCP URL. Flip to `false` only when applying schema, then flip back
- PAT lives in `headers.Authorization`, never in the URL querystring
- Never connect MCP to a production project

## Process
- After every change, run `npm run dev` and click the feature in the browser
- If something breaks, paste the **exact** error back into the prompt — "it doesn't work" is the worst possible debugging input
- Before declaring something done, run `npm run build` once
