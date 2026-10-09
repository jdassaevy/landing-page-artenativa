create table public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  state text not null default 'SC',
  maps_url text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  image_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint locations_name_not_blank check (btrim(name) <> ''),
  constraint locations_address_not_blank check (btrim(address) <> ''),
  constraint locations_city_not_blank check (btrim(city) <> ''),
  constraint locations_state_not_blank check (btrim(state) <> ''),
  constraint locations_latitude_check check (latitude is null or latitude between -90 and 90),
  constraint locations_longitude_check check (longitude is null or longitude between -180 and 180)
);

create table public.class_periods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_at date not null,
  ends_at date not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint class_periods_name_not_blank check (btrim(name) <> ''),
  constraint class_periods_dates_check check (ends_at >= starts_at)
);

create unique index class_periods_single_current_idx
  on public.class_periods ((is_current))
  where is_current;

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references public.class_periods(id) on delete restrict,
  location_id uuid not null references public.locations(id) on delete restrict,
  modality text not null,
  weekday smallint not null,
  start_time time not null,
  end_time time not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint classes_modality_not_blank check (btrim(modality) <> ''),
  constraint classes_weekday_check check (weekday between 1 and 7),
  constraint classes_time_check check (end_time > start_time)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  cover_path text,
  description text,
  event_date timestamptz not null,
  venue_name text,
  venue_address text,
  venue_city text,
  venue_state text,
  maps_url text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  whatsapp_phone text,
  reservation_message text,
  ticket_message text,
  status text not null default 'draft',
  show_on_home boolean not null default false,
  show_as_popup boolean not null default false,
  promotion_starts_at timestamptz,
  promotion_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_title_not_blank check (btrim(title) <> ''),
  constraint events_slug_not_blank check (btrim(slug) <> ''),
  constraint events_status_check check (status in ('draft', 'published', 'archived')),
  constraint events_promotion_window_check check (
    promotion_starts_at is null
    or promotion_ends_at is null
    or promotion_ends_at > promotion_starts_at
  ),
  constraint events_latitude_check check (latitude is null or latitude between -90 and 90),
  constraint events_longitude_check check (longitude is null or longitude between -180 and 180)
);

create index locations_public_list_idx
  on public.locations (is_active, city, name);

create index classes_public_schedule_idx
  on public.classes (period_id, is_active, weekday, start_time);

create index events_public_list_idx
  on public.events (status, event_date, promotion_starts_at, promotion_ends_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger locations_set_updated_at
before update on public.locations
for each row execute function public.set_updated_at();

create trigger class_periods_set_updated_at
before update on public.class_periods
for each row execute function public.set_updated_at();

create trigger classes_set_updated_at
before update on public.classes
for each row execute function public.set_updated_at();

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();
