-- ============================================================
-- GrowBro Blog CMS + Mini-CRM — Supabase Migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID generation (pgcrypto provides gen_random_uuid())
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. BLOGS TABLE
-- ------------------------------------------------------------
create table if not exists public.blogs (
    id           uuid primary key default gen_random_uuid(),
    title        text not null,
    slug         text unique not null,
    summary      text,
    content      text not null,
    cover_image  text,
    category     text default 'Product Updates',
    author       text default 'GrowBro Team',
    status       text check (status in ('DRAFT', 'PUBLISHED')) default 'DRAFT',
    created_at   timestamptz default now(),
    updated_at   timestamptz default now()
);

create index if not exists idx_blogs_slug on public.blogs (slug);
create index if not exists idx_blogs_status on public.blogs (status);
create index if not exists idx_blogs_created_at on public.blogs (created_at desc);

-- Auto-update updated_at on row modification
create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists trg_blogs_updated_at on public.blogs;
create trigger trg_blogs_updated_at
    before update on public.blogs
    for each row
    execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 2. LEADS TABLE
-- ------------------------------------------------------------
create table if not exists public.leads (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    email       text,
    phone       text not null,
    channel     text check (channel in ('WHATSAPP', 'INSTAGRAM', 'WEBSITE', 'MESSENGER')) default 'WEBSITE',
    status      text check (status in ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST')) default 'NEW',
    notes       text,
    created_at  timestamptz default now()
);

create index if not exists idx_leads_status on public.leads (status);
create index if not exists idx_leads_channel on public.leads (channel);
create index if not exists idx_leads_created_at on public.leads (created_at desc);

-- ------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ------------------------------------------------------------
-- RLS is enabled here for safety. Since this backend uses the
-- Supabase Postgres connection string (service-role-level access
-- via SQLAlchemy/asyncpg from FastAPI, not the anon client key),
-- these policies mainly matter if you also expose the anon/public
-- Supabase API. Adjust/remove as needed for your access pattern.

alter table public.blogs enable row level security;
alter table public.leads enable row level security;

-- Public can read only published blogs
drop policy if exists "Public can read published blogs" on public.blogs;
create policy "Public can read published blogs"
    on public.blogs
    for select
    using (status = 'PUBLISHED');

-- Public (anon) can insert leads (e.g. from a public website form)
drop policy if exists "Public can insert leads" on public.leads;
create policy "Public can insert leads"
    on public.leads
    for insert
    with check (true);

-- NOTE: The FastAPI backend below connects directly via DATABASE_URL
-- (the Postgres connection string), which bypasses RLS entirely
-- (it authenticates as the postgres role). RLS above only applies
-- if you additionally query these tables through the Supabase
-- REST/JS client using the anon key.
