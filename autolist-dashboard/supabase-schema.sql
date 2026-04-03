-- AutoList Dashboard — Supabase Schema
-- Run this in your Supabase SQL editor

-- ── PROFILES ─────────────────────────────────────────────────────────────────
-- Extended user data beyond Supabase auth
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'user', -- 'admin' | 'owner' | 'user'
  organization_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── ORGANIZATIONS ─────────────────────────────────────────────────────────────
-- Dealerships or individual accounts
create table public.organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  owner_id uuid references public.profiles(id),
  stripe_customer_id text unique,
  stripe_subscription_id text,
  subscription_status text default 'trialing', -- 'trialing' | 'active' | 'past_due' | 'canceled'
  subscription_plan text default 'pro', -- 'pro' | 'dealership'
  seat_count int default 1,
  trial_ends_at timestamptz default (now() + interval '14 days'),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add org foreign key back to profiles
alter table public.profiles
  add constraint profiles_organization_id_fkey
  foreign key (organization_id) references public.organizations(id);

-- ── LICENSE KEYS ──────────────────────────────────────────────────────────────
-- Each active user gets a license key that the Chrome extension validates
create table public.license_keys (
  id uuid default gen_random_uuid() primary key,
  key text unique not null default encode(gen_random_bytes(32), 'hex'),
  user_id uuid references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  is_active boolean default true,
  last_used_at timestamptz,
  created_at timestamptz default now()
);

-- ── LISTINGS ──────────────────────────────────────────────────────────────────
-- Every listing created via the extension
create table public.listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  title text not null,
  year text,
  make text,
  model text,
  trim text,
  price integer,
  miles integer,
  vin text,
  color text,
  interior text,
  engine text,
  transmission text,
  condition text,
  ai_description text,
  image_urls text[],
  source_url text,
  status text default 'active', -- 'active' | 'sold' | 'pending' | 'removed'
  fb_listing_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.license_keys enable row level security;
alter table public.listings enable row level security;

-- Profiles: users can read/update their own
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Orgs: members can view their org
create policy "Org members can view org"
  on public.organizations for select
  using (id in (select organization_id from public.profiles where id = auth.uid()));

-- Listings: users see their org's listings
create policy "Users can view org listings"
  on public.listings for select
  using (organization_id in (select organization_id from public.profiles where id = auth.uid()));
create policy "Users can insert own listings"
  on public.listings for insert
  with check (user_id = auth.uid());
create policy "Users can update own listings"
  on public.listings for update
  using (user_id = auth.uid());

-- License keys: users see own keys
create policy "Users can view own license keys"
  on public.license_keys for select
  using (user_id = auth.uid());

-- ── FUNCTIONS ─────────────────────────────────────────────────────────────────
-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at();
create trigger update_organizations_updated_at before update on public.organizations
  for each row execute function update_updated_at();
create trigger update_listings_updated_at before update on public.listings
  for each row execute function update_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
