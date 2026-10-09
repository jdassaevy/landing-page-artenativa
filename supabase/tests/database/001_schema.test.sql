begin;

create extension if not exists pgtap with schema extensions;
select plan(20);

select has_table('public', 'locations', 'locations table exists');
select has_table('public', 'class_periods', 'class_periods table exists');
select has_table('public', 'classes', 'classes table exists');
select has_table('public', 'events', 'events table exists');

select has_column('public', 'locations', 'maps_url', 'locations exposes a maps URL');
select has_column('public', 'class_periods', 'is_current', 'class periods track the current period');
select has_column('public', 'classes', 'weekday', 'classes store weekday ordering');
select has_column('public', 'classes', 'start_time', 'classes store start time');
select has_column('public', 'events', 'slug', 'events have a shareable slug');
select has_column('public', 'events', 'venue_name', 'events keep their own venue name');
select has_column('public', 'events', 'venue_address', 'events keep their own venue address');
select has_column('public', 'events', 'promotion_starts_at', 'events define promotion start');
select has_column('public', 'events', 'promotion_ends_at', 'events define promotion end');

insert into public.locations (id, name, address, city, state)
values ('00000000-0000-0000-0000-000000000101', 'Local teste', 'Rua Teste, 1', 'Santo Amaro da Imperatriz', 'SC');

insert into public.class_periods (id, name, starts_at, ends_at, is_current)
values ('00000000-0000-0000-0000-000000000201', 'Período atual', '2026-10-01', '2026-12-31', true);

select throws_ok(
  $$insert into public.classes (period_id, location_id, modality, weekday, start_time, end_time)
    values ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'Danças Gaúchas', 0, '19:00', '20:00')$$,
  '23514',
  null,
  'weekday rejects values below Monday'
);

select throws_ok(
  $$insert into public.classes (period_id, location_id, modality, weekday, start_time, end_time)
    values ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'Danças Gaúchas', 8, '19:00', '20:00')$$,
  '23514',
  null,
  'weekday rejects values above Sunday'
);

select throws_ok(
  $$insert into public.classes (period_id, location_id, modality, weekday, start_time, end_time)
    values ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'Danças Gaúchas', 2, '20:00', '19:00')$$,
  '23514',
  null,
  'class end time must be after start time'
);

select throws_ok(
  $$insert into public.class_periods (name, starts_at, ends_at) values ('Inválido', '2027-04-01', '2027-03-01')$$,
  '23514',
  null,
  'period end date must not precede start date'
);

insert into public.events (slug, title, event_date, venue_name, venue_address, venue_city, venue_state, status)
values ('baile-teste', 'Baile teste', '2027-01-20', 'Salão teste', 'Rua do Baile, 10', 'Santo Amaro da Imperatriz', 'SC', 'draft');

select throws_ok(
  $$insert into public.events (slug, title, event_date, venue_name, venue_address, venue_city, venue_state, status)
    values ('baile-teste', 'Outro baile', '2027-02-20', 'Salão teste', 'Rua do Baile, 10', 'Santo Amaro da Imperatriz', 'SC', 'published')$$,
  '23505',
  null,
  'event slug is unique'
);

select throws_ok(
  $$insert into public.events (slug, title, event_date, venue_name, venue_address, venue_city, venue_state, status)
    values ('evento-status-invalido', 'Evento inválido', '2027-03-20', 'Salão teste', 'Rua do Baile, 10', 'Santo Amaro da Imperatriz', 'SC', 'deleted')$$,
  '23514',
  null,
  'event status is restricted to draft published or archived'
);

select throws_ok(
  $$insert into public.class_periods (name, starts_at, ends_at, is_current)
    values ('Outro período atual', '2027-01-01', '2027-03-31', true)$$,
  '23505',
  null,
  'only one class period can be current'
);

select * from finish();
rollback;
