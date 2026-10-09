begin;

create extension if not exists pgtap with schema extensions;
select plan(15);

select ok((select relrowsecurity from pg_class where oid = 'public.locations'::regclass), 'locations has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.class_periods'::regclass), 'class_periods has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.classes'::regclass), 'classes has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.events'::regclass), 'events has RLS enabled');

insert into public.locations (id, name, address, city, state, is_active) values
  ('00000000-0000-0000-0000-000000001101', 'Local ativo', 'Rua A, 1', 'Santo Amaro da Imperatriz', 'SC', true),
  ('00000000-0000-0000-0000-000000001102', 'Local inativo', 'Rua B, 2', 'Santo Amaro da Imperatriz', 'SC', false);

insert into public.class_periods (id, name, starts_at, ends_at, is_current) values
  ('00000000-0000-0000-0000-000000001201', 'Atual', '2026-10-01', '2026-12-31', true),
  ('00000000-0000-0000-0000-000000001202', 'Histórico', '2026-07-01', '2026-09-30', false);

insert into public.classes (id, period_id, location_id, modality, weekday, start_time, end_time, is_active) values
  ('00000000-0000-0000-0000-000000001301', '00000000-0000-0000-0000-000000001201', '00000000-0000-0000-0000-000000001101', 'Danças Gaúchas Básico', 2, '19:00', '20:00', true),
  ('00000000-0000-0000-0000-000000001302', '00000000-0000-0000-0000-000000001201', '00000000-0000-0000-0000-000000001101', 'Danças Gaúchas Avançado', 3, '20:00', '21:00', false),
  ('00000000-0000-0000-0000-000000001303', '00000000-0000-0000-0000-000000001202', '00000000-0000-0000-0000-000000001101', 'Turma antiga', 4, '19:00', '20:00', true),
  ('00000000-0000-0000-0000-000000001304', '00000000-0000-0000-0000-000000001201', '00000000-0000-0000-0000-000000001102', 'Local inativo', 5, '19:00', '20:00', true);

insert into public.events (id, slug, title, event_date, venue_name, venue_address, venue_city, venue_state, status) values
  ('00000000-0000-0000-0000-000000001401', 'evento-publicado', 'Evento publicado', '2027-01-10', 'Salão A', 'Rua C, 3', 'Santo Amaro da Imperatriz', 'SC', 'published'),
  ('00000000-0000-0000-0000-000000001402', 'evento-rascunho', 'Evento rascunho', '2027-02-10', 'Salão B', 'Rua D, 4', 'Santo Amaro da Imperatriz', 'SC', 'draft');

set local role anon;
set local "request.jwt.claims" = '{"role":"anon"}';

select results_eq('select count(*) from public.locations', array[1::bigint], 'anonymous visitors see only active locations');
select results_eq('select count(*) from public.class_periods', array[1::bigint], 'anonymous visitors see only the current class period');
select results_eq('select count(*) from public.classes', array[1::bigint], 'anonymous visitors see only active classes in the current period and an active location');
select results_eq('select count(*) from public.events', array[1::bigint], 'anonymous visitors see only published events');
select throws_ok(
  $$insert into public.locations (name, address, city, state) values ('Ataque anon', 'Rua X', 'Cidade X', 'SC')$$,
  '42501', null, 'anonymous visitors cannot insert content'
);

reset role;
set local role authenticated;
set local "request.jwt.claims" = '{"role":"authenticated","sub":"00000000-0000-0000-0000-000000009001","user_metadata":{"role":"admin"},"app_metadata":{}}';

select throws_ok(
  $$insert into public.locations (name, address, city, state) values ('User metadata não vale', 'Rua Y', 'Cidade Y', 'SC')$$,
  '42501', null, 'user_metadata admin claim never grants write access'
);
select is_empty(
  $$update public.locations set name = 'Alterado por comum' where id = '00000000-0000-0000-0000-000000001101' returning 1$$,
  'authenticated non-admin cannot update content'
);

reset role;
set local role authenticated;
set local "request.jwt.claims" = '{"role":"authenticated","sub":"00000000-0000-0000-0000-000000009002","app_metadata":{"role":"admin"}}';

select lives_ok(
  $$insert into public.locations (id, name, address, city, state) values ('00000000-0000-0000-0000-000000001199', 'Admin criou', 'Rua Admin', 'Cidade Admin', 'SC')$$,
  'app_metadata admin can insert content'
);
select results_eq(
  $$update public.locations set name = 'Admin alterou' where id = '00000000-0000-0000-0000-000000001199' returning name$$,
  $$values ('Admin alterou'::text)$$,
  'app_metadata admin can update content'
);
select lives_ok(
  $$delete from public.locations where id = '00000000-0000-0000-0000-000000001199'$$,
  'app_metadata admin can delete content'
);
select results_eq('select count(*) from public.locations', array[2::bigint], 'admin can read inactive and active locations');

select * from finish();
rollback;
