begin;

create extension if not exists pgtap with schema extensions;
select plan(8);

select has_function('public', 'duplicate_class_period', 'duplicate_class_period function exists');

insert into public.locations (id, name, address, city, state)
values ('00000000-0000-0000-0000-000000002101', 'Local duplicação', 'Rua Dup, 1', 'Santo Amaro da Imperatriz', 'SC');

insert into public.class_periods (id, name, starts_at, ends_at, is_current)
values ('00000000-0000-0000-0000-000000002201', 'Jan-Mar 2027', '2027-01-01', '2027-03-31', false);

insert into public.classes (id, period_id, location_id, modality, weekday, start_time, end_time, is_active) values
  ('00000000-0000-0000-0000-000000002301', '00000000-0000-0000-0000-000000002201', '00000000-0000-0000-0000-000000002101', 'Básico', 2, '19:00', '20:00', true),
  ('00000000-0000-0000-0000-000000002302', '00000000-0000-0000-0000-000000002201', '00000000-0000-0000-0000-000000002101', 'Avançado', 4, '20:00', '21:00', true);

create temporary table duplicate_result (id uuid not null);

set local role authenticated;
set local "request.jwt.claims" = '{"role":"authenticated","sub":"00000000-0000-0000-0000-000000009102","app_metadata":{"role":"admin"}}';

insert into duplicate_result (id)
select public.duplicate_class_period(
  '00000000-0000-0000-0000-000000002201',
  'Abr-Jun 2027',
  '2027-04-01',
  '2027-06-30'
);

select results_eq(
  $$select name || '|' || starts_at::text || '|' || ends_at::text || '|' || is_current::text
    from public.class_periods where id = (select id from duplicate_result)$$,
  $$values ('Abr-Jun 2027|2027-04-01|2027-06-30|false'::text)$$,
  'duplicated period receives the requested metadata and is not current'
);
select results_eq(
  $$select count(*) from public.classes where period_id = '00000000-0000-0000-0000-000000002201'$$,
  array[2::bigint],
  'source period classes remain unchanged'
);
select results_eq(
  $$select count(*) from public.classes where period_id = (select id from duplicate_result)$$,
  array[2::bigint],
  'destination period receives all source classes'
);
select results_eq(
  $$select count(*) from public.classes copied
    join public.classes source on copied.id = source.id
    where copied.period_id = (select id from duplicate_result)
      and source.period_id = '00000000-0000-0000-0000-000000002201'$$,
  array[0::bigint],
  'copied classes use distinct identifiers'
);

select throws_ok(
  $$select public.duplicate_class_period('00000000-0000-0000-0000-000000002201', 'Datas inválidas', '2027-09-30', '2027-07-01')$$,
  '22023', null,
  'invalid destination dates are rejected atomically'
);
select results_eq(
  $$select count(*) from public.class_periods where name = 'Datas inválidas'$$,
  array[0::bigint],
  'failed duplication leaves no destination period behind'
);

reset role;
set local role authenticated;
set local "request.jwt.claims" = '{"role":"authenticated","sub":"00000000-0000-0000-0000-000000009103","app_metadata":{}}';
select throws_ok(
  $$select public.duplicate_class_period('00000000-0000-0000-0000-000000002201', 'Não autorizado', '2027-07-01', '2027-09-30')$$,
  '42501', null,
  'non-admin users cannot duplicate a period'
);

select * from finish();
rollback;
