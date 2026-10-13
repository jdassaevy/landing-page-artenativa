begin;

select plan(15);

insert into public.locations (id, name, address, city, state, is_active)
values ('61000000-0000-0000-0000-000000000001', 'Local duplicacao', 'Rua D, 1', 'Santo Amaro da Imperatriz', 'SC', true);

insert into public.class_periods (id, name, starts_at, ends_at, is_current)
values ('62000000-0000-0000-0000-000000000001', '2027 T1 origem', '2027-01-01', '2027-03-31', true);

insert into public.classes (id, period_id, location_id, modality, weekday, start_time, end_time, is_active) values
  ('63000000-0000-0000-0000-000000000001', '62000000-0000-0000-0000-000000000001', '61000000-0000-0000-0000-000000000001', 'Danca A', 1, '18:00', '19:00', true),
  ('63000000-0000-0000-0000-000000000002', '62000000-0000-0000-0000-000000000001', '61000000-0000-0000-0000-000000000001', 'Danca B', 3, '20:00', '21:00', false);

select ok(
  to_regprocedure('public.duplicate_class_period(uuid,text,date,date)') is not null,
  'duplicate_class_period exists with the expected signature'
);
select is(
  (select prosecdef from pg_proc where oid = to_regprocedure('public.duplicate_class_period(uuid,text,date,date)')),
  false,
  'duplicate_class_period is security invoker'
);
select is(
  pg_get_function_result(to_regprocedure('public.duplicate_class_period(uuid,text,date,date)')),
  'uuid',
  'duplicate_class_period returns uuid'
);

select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"64000000-0000-0000-0000-000000000001","app_metadata":{"role":"admin"},"user_metadata":{}}',
  true
);
set local role authenticated;
select lives_ok(
  $$select public.duplicate_class_period(
    '62000000-0000-0000-0000-000000000001',
    '2027 T2 copia',
    '2027-04-01',
    '2027-06-30'
  )$$,
  'admin can duplicate a class period atomically'
);
reset role;

select is(
  (select count(*) from public.class_periods where name = '2027 T2 copia'),
  1::bigint,
  'one destination period is created'
);
select isnt(
  (select id from public.class_periods where name = '2027 T2 copia'),
  '62000000-0000-0000-0000-000000000001'::uuid,
  'destination period receives a distinct id'
);
select is(
  (select count(*) from public.classes where period_id = '62000000-0000-0000-0000-000000000001'),
  2::bigint,
  'source classes remain unchanged'
);
select is(
  (
    select count(*)
    from public.classes
    where period_id = (select id from public.class_periods where name = '2027 T2 copia')
  ),
  2::bigint,
  'destination receives every source class'
);
select is(
  (
    select count(*)
    from public.classes source
    join public.classes copied on copied.id = source.id
    where source.period_id = '62000000-0000-0000-0000-000000000001'
      and copied.period_id = (select id from public.class_periods where name = '2027 T2 copia')
  ),
  0::bigint,
  'copied classes receive distinct ids'
);
select results_eq(
  $$
    select modality || '|' || weekday::text || '|' || start_time::text || '|' || end_time::text || '|' || is_active::text
    from public.classes
    where period_id = (select id from public.class_periods where name = '2027 T2 copia')
    order by weekday, start_time
  $$,
  $$values
    ('Danca A|1|18:00:00|19:00:00|true'),
    ('Danca B|3|20:00:00|21:00:00|false')
  $$,
  'duplicated classes preserve schedule, modality and active state'
);

select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"64000000-0000-0000-0000-000000000001","app_metadata":{"role":"admin"},"user_metadata":{}}',
  true
);
set local role authenticated;
select throws_like(
  $$select public.duplicate_class_period(
    '62000000-0000-0000-0000-000000000001',
    'Periodo invalido',
    '2027-09-30',
    '2027-07-01'
  )$$,
  '%new_ends_at%',
  'invalid destination dates are rejected'
);
reset role;
select is(
  (select count(*) from public.class_periods where name = 'Periodo invalido'),
  0::bigint,
  'invalid duplication leaves no partial destination period'
);

select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"64000000-0000-0000-0000-000000000002","app_metadata":{"role":"member"},"user_metadata":{}}',
  true
);
set local role authenticated;
select throws_like(
  $$select public.duplicate_class_period(
    '62000000-0000-0000-0000-000000000001',
    'Copia membro',
    '2027-07-01',
    '2027-09-30'
  )$$,
  '%row-level security%',
  'non-admin authenticated user cannot duplicate periods'
);
reset role;
select is(
  (select count(*) from public.class_periods where name = 'Copia membro'),
  0::bigint,
  'denied non-admin duplication leaves no partial data'
);

select set_config('request.jwt.claims', '{"role":"anon","app_metadata":{},"user_metadata":{}}', true);
set local role anon;
select throws_like(
  $$select public.duplicate_class_period(
    '62000000-0000-0000-0000-000000000001',
    'Copia anon',
    '2027-07-01',
    '2027-09-30'
  )$$,
  '%permission denied for function%',
  'anon cannot execute the duplication function'
);
reset role;

select * from finish();
rollback;
