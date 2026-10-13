begin;

select plan(25);

insert into public.locations (id, name, address, city, state, is_active) values
  ('10000000-0000-0000-0000-000000000001', 'Local ativo', 'Rua A, 1', 'Santo Amaro da Imperatriz', 'SC', true),
  ('10000000-0000-0000-0000-000000000002', 'Local inativo', 'Rua B, 2', 'Santo Amaro da Imperatriz', 'SC', false);

insert into public.class_periods (id, name, starts_at, ends_at, is_current) values
  ('20000000-0000-0000-0000-000000000001', 'Periodo atual', '2027-01-01', '2027-03-31', true),
  ('20000000-0000-0000-0000-000000000002', 'Periodo antigo', '2026-10-01', '2026-12-31', false);

insert into public.classes (id, period_id, location_id, modality, weekday, start_time, end_time, is_active) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Danca publica', 1, '18:00', '19:00', true),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Danca inativa', 2, '18:00', '19:00', false),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Danca antiga', 3, '18:00', '19:00', true),
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Danca local inativo', 4, '18:00', '19:00', true);

insert into public.events (id, title, slug, event_date, status) values
  ('40000000-0000-0000-0000-000000000001', 'Evento publicado', 'evento-publicado', '2027-02-10 20:00:00-03', 'published'),
  ('40000000-0000-0000-0000-000000000002', 'Evento rascunho', 'evento-rascunho', '2027-02-11 20:00:00-03', 'draft'),
  ('40000000-0000-0000-0000-000000000003', 'Evento arquivado', 'evento-arquivado', '2027-02-12 20:00:00-03', 'archived');

select is(
  (select relrowsecurity from pg_class where oid = 'public.locations'::regclass),
  true,
  'RLS is enabled on locations'
);
select is(
  (select relrowsecurity from pg_class where oid = 'public.class_periods'::regclass),
  true,
  'RLS is enabled on class_periods'
);
select is(
  (select relrowsecurity from pg_class where oid = 'public.classes'::regclass),
  true,
  'RLS is enabled on classes'
);
select is(
  (select relrowsecurity from pg_class where oid = 'public.events'::regclass),
  true,
  'RLS is enabled on events'
);

select set_config('request.jwt.claims', '{"role":"anon","app_metadata":{},"user_metadata":{}}', true);
set local role anon;

select results_eq(
  $$select id from public.locations order by id$$,
  $$values ('10000000-0000-0000-0000-000000000001'::uuid)$$,
  'anon reads only active locations'
);
select results_eq(
  $$select id from public.class_periods order by id$$,
  $$values ('20000000-0000-0000-0000-000000000001'::uuid)$$,
  'anon reads only the current class period'
);
select results_eq(
  $$select id from public.classes order by id$$,
  $$values ('30000000-0000-0000-0000-000000000001'::uuid)$$,
  'anon reads only active current classes at active locations'
);
select results_eq(
  $$select id from public.events order by id$$,
  $$values ('40000000-0000-0000-0000-000000000001'::uuid)$$,
  'anon reads only published events'
);
select throws_like(
  $$insert into public.locations (name, address, city, state) values ('Anon insert', 'Rua X', 'Cidade', 'SC')$$,
  '%permission denied%',
  'anon insert is denied'
);
select throws_like(
  $$update public.locations set name = 'Anon update' where id = '10000000-0000-0000-0000-000000000001'$$,
  '%permission denied%',
  'anon update is denied'
);
select throws_like(
  $$delete from public.locations where id = '10000000-0000-0000-0000-000000000001'$$,
  '%permission denied%',
  'anon delete is denied'
);

reset role;
select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"50000000-0000-0000-0000-000000000001","app_metadata":{"role":"member"},"user_metadata":{}}',
  true
);
set local role authenticated;

select results_eq(
  $$select id from public.locations order by id$$,
  $$values ('10000000-0000-0000-0000-000000000001'::uuid)$$,
  'non-admin authenticated user keeps public read access'
);
select throws_like(
  $$insert into public.locations (name, address, city, state) values ('Member insert', 'Rua M', 'Cidade', 'SC')$$,
  '%row-level security%',
  'non-admin authenticated insert is denied by RLS'
);
select lives_ok(
  $$update public.locations set name = 'Member update' where id = '10000000-0000-0000-0000-000000000001'$$,
  'non-admin update is filtered by RLS without privilege escalation'
);
select lives_ok(
  $$delete from public.locations where id = '10000000-0000-0000-0000-000000000001'$$,
  'non-admin delete is filtered by RLS without privilege escalation'
);

reset role;
select is(
  (select name from public.locations where id = '10000000-0000-0000-0000-000000000001'),
  'Local ativo',
  'non-admin update changed no row'
);
select ok(
  exists(select 1 from public.locations where id = '10000000-0000-0000-0000-000000000001'),
  'non-admin delete changed no row'
);

select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"50000000-0000-0000-0000-000000000002","app_metadata":{},"user_metadata":{"role":"admin"}}',
  true
);
set local role authenticated;
select throws_like(
  $$insert into public.locations (name, address, city, state) values ('Fake admin', 'Rua F', 'Cidade', 'SC')$$,
  '%row-level security%',
  'user_metadata admin claim does not grant admin mutation rights'
);

reset role;
select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"50000000-0000-0000-0000-000000000003","app_metadata":{"role":"admin"},"user_metadata":{}}',
  true
);
set local role authenticated;

select is((select count(*) from public.locations), 2::bigint, 'admin can read inactive locations');
select is((select count(*) from public.events), 3::bigint, 'admin can read draft and archived events');
select lives_ok(
  $$insert into public.locations (id, name, address, city, state) values ('10000000-0000-0000-0000-000000000099', 'Admin insert', 'Rua Admin', 'Cidade', 'SC')$$,
  'admin can insert'
);
select lives_ok(
  $$update public.locations set name = 'Local inativo editado' where id = '10000000-0000-0000-0000-000000000002'$$,
  'admin can update rows outside public visibility'
);
select lives_ok(
  $$delete from public.locations where id = '10000000-0000-0000-0000-000000000099'$$,
  'admin can delete'
);

reset role;
select is(
  (select name from public.locations where id = '10000000-0000-0000-0000-000000000002'),
  'Local inativo editado',
  'admin update persisted'
);
select ok(
  not exists(select 1 from public.locations where id = '10000000-0000-0000-0000-000000000099'),
  'admin delete persisted'
);

select * from finish();
rollback;
