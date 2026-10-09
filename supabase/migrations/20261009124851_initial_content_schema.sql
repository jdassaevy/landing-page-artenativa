create table public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  address text not null check (char_length(trim(address)) > 0),
  city text not null check (char_length(trim(city)) > 0),
  state text not null check (char_length(trim(state)) > 0),
  maps_url text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  image_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.class_periods (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  starts_at date not null,
  ends_at date not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint class_periods_valid_dates check (ends_at >= starts_at)
);

create unique index class_periods_single_current_idx
  on public.class_periods (is_current)
  where is_current;

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references public.class_periods(id) on delete restrict,
  location_id uuid not null references public.locations(id) on delete restrict,
  modality text not null check (char_length(trim(modality)) > 0),
  weekday smallint not null,
  start_time time not null,
  end_time time not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint classes_valid_weekday check (weekday between 1 and 7),
  constraint classes_valid_time_range check (end_time > start_time)
);

create index classes_period_active_weekday_time_idx
  on public.classes (period_id, is_active, weekday, start_time);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (char_length(trim(slug)) > 0),
  title text not null check (char_length(trim(title)) > 0),
  description text,
  cover_path text,
  event_date date not null,
  start_time time,
  end_time time,
  venue_name text not null check (char_length(trim(venue_name)) > 0),
  venue_address text not null check (char_length(trim(venue_address)) > 0),
  venue_city text not null check (char_length(trim(venue_city)) > 0),
  venue_state text not null check (char_length(trim(venue_state)) > 0),
  maps_url text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  whatsapp_number text,
  table_message text,
  ticket_message text,
  status text not null default 'draft',
  show_on_home boolean not null default false,
  show_popup boolean not null default false,
  promotion_starts_at timestamptz,
  promotion_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_valid_status check (status in ('draft', 'published', 'archived')),
  constraint events_valid_time_range check (end_time is null or start_time is null or end_time > start_time),
  constraint events_valid_promotion_window check (
    promotion_ends_at is null or promotion_starts_at is null or promotion_ends_at >= promotion_starts_at
  )
);

create index events_status_date_promotion_idx
  on public.events (status, event_date, promotion_starts_at, promotion_ends_at);
