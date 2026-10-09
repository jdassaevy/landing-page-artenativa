begin;

select plan(10);

insert into public.class_periods (id, name, starts_at, ends_at, is_current) values
  ('72000000-0000-0000-0000-000000000001', 'Periodo atual', '2027-01-01', '2027-03-31', true),
  ('72000000-0000-0000-0000-000000000002', 'Proximo periodo', '2027-04-01', '2027-06-30', false);

select ok(
  to_regprocedure('public.set_current_class_period(uuid)') is not null,
  'set_current_class_period exists with the expected signature'
);
select is(
  (select prosecdef from pg_proc where oid = to_regprocedure('public.set_current_class_period(uuid)')),
  false,
  'set_current_class_period is security invoker'
);

select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"73000000-0000-0000-0000-000000000001","app_metadata":{"role":"admin"},"user_metadata":{}}',
  true
);
set local role authenticated;
select lives_ok(
  $$select public.set_current_class_period('72000000-0000-0000-0000-000000000002')$$,
  'admin can switch the current period atomically'
);
reset role;

select is(
  (select id from public.class_periods where is_current),
  '72000000-0000-0000-0000-000000000002'::uuid,
  'target period becomes current'
);
select is(
  (select count(*) from public.class_periods where is_current),
  1::bigint,
  'exactly one current period remains'
);

select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"73000000-0000-0000-0000-000000000001","app_metadata":{"role":"admin"},"user_metadata":{}}',
  true
);
set local role authenticated;
select throws_like(
  $$select public.set_current_class_period('72000000-0000-0000-0000-000000000099')$$,
  '%not found%',
  'missing target is rejected before changing the current period'
);
reset role;
select is(
  (select id from public.class_periods where is_current),
  '72000000-0000-0000-0000-000000000002'::uuid,
  'failed switch preserves the previous current period'
);

select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"73000000-0000-0000-0000-000000000002","app_metadata":{"role":"member"},"user_metadata":{}}',
  true
);
set local role authenticated;
select throws_like(
  $$select public.set_current_class_period('72000000-0000-0000-0000-000000000001')$$,
  '%row-level security%',
  'non-admin authenticated user cannot switch periods'
);
reset role;
select is(
  (select id from public.class_periods where is_current),
  '72000000-0000-0000-0000-000000000002'::uuid,
  'denied non-admin switch preserves current period'
);

select set_config('request.jwt.claims', '{"role":"anon","app_metadata":{},"user_metadata":{}}', true);
set local role anon;
select throws_like(
  $$select public.set_current_class_period('72000000-0000-0000-0000-000000000001')$$,
  '%permission denied for function%',
  'anon cannot execute the switch function'
);
reset role;

select * from finish();
rollback;
