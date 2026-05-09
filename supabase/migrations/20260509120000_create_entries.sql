-- DailyLog: entries table with per-user RLS.
-- All four policies scope rows by auth.uid() = user_id.

create table if not exists public.entries (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null check (length(title) between 1 and 120),
    body text not null default '',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists entries_user_id_created_at_idx
    on public.entries (user_id, created_at desc);

-- Keep updated_at fresh on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists entries_set_updated_at on public.entries;
create trigger entries_set_updated_at
    before update on public.entries
    for each row
    execute function public.set_updated_at();

alter table public.entries enable row level security;

drop policy if exists "entries_select_own" on public.entries;
create policy "entries_select_own"
    on public.entries
    for select
    to authenticated
    using (auth.uid() = user_id);

drop policy if exists "entries_insert_own" on public.entries;
create policy "entries_insert_own"
    on public.entries
    for insert
    to authenticated
    with check (auth.uid() = user_id);

drop policy if exists "entries_update_own" on public.entries;
create policy "entries_update_own"
    on public.entries
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

drop policy if exists "entries_delete_own" on public.entries;
create policy "entries_delete_own"
    on public.entries
    for delete
    to authenticated
    using (auth.uid() = user_id);
