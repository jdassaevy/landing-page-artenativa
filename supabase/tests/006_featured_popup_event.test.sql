begin;

select plan(10);

insert into public.events (
  id, title, slug, event_date, status, show_as_popup, venue_name, venue_address, venue_city, venue_state
) values
  ('74000000-0000-0000-0000-000000000001', 'Evento A', 'evento-a', '2027-02-10T22:00:00Z', 'published', true, 'Sala A', 'Rua A', 'Santo Amaro da Imperatriz', 'SC'),
  ('74000000-0000-0000-0000-000000000002', 'Evento B', 'evento-b', '2027-03-10T22:00:00Z', 'published', false, 'Sala B', 'Rua B', 'Santo Amaro da Imperatriz', 'SC');

select ok(
  to_regprocedure('public.set_featured_popup_event(uuid)') is not null,
  'set_featured_popup_event exists with expected signature'
);
select is(
  (select prosecdef from pg_proc where oid = to_regprocedure('public.set_featured_popup_event(uuid)')),
  false,
  'set_featured_popup_event is security invoker'
);

select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"75000000-0000-0000-0000-000000000001","app_metadata":{"role":"admin"},"user_metadata":{}}',
  true
);
set local role authenticated;
select lives_ok(
  $$select public.set_featured_popup_event('74000000-0000-0000-0000-000000000002')$$,
  'admin can switch featured popup event atomically'
);
reset role;

select is(
  (select id from public.events where show_as_popup),
  '74000000-0000-0000-0000-000000000002'::uuid,
  'target event becomes the featured popup'
);
select is(
  (select count(*) from public.events where show_as_popup),
  1::bigint,
  'exactly one featured popup event remains'
);

select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"75000000-0000-0000-0000-000000000001","app_metadata":{"role":"admin"},"user_metadata":{}}',
  true
);
set local role authenticated;
select throws_like(
  $$select public.set_featured_popup_event('74000000-0000-0000-0000-000000000099')$$,
  '%not found%',
  'missing target is rejected before changing current highlight'
);
reset role;
select is(
  (select id from public.events where show_as_popup),
  '74000000-0000-0000-0000-000000000002'::uuid,
  'failed switch preserves previous featured event'
);

select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"75000000-0000-0000-0000-000000000002","app_metadata":{"role":"member"},"user_metadata":{}}',
  true
);
set local role authenticated;
select throws_like(
  $$select public.set_featured_popup_event('74000000-0000-0000-0000-000000000001')$$,
  '%row-level security%',
  'non-admin authenticated user cannot switch featured popup'
);
reset role;
select is(
  (select id from public.events where show_as_popup),
  '74000000-0000-0000-0000-000000000002'::uuid,
  'denied switch preserves featured event'
);

select set_config('request.jwt.claims', '{"role":"anon","app_metadata":{},"user_metadata":{}}', true);
set local role anon;
select throws_like(
  $$select public.set_featured_popup_event('74000000-0000-0000-0000-000000000001')$$,
  '%permission denied for function%',
  'anon cannot execute featured popup function'
);
reset role;

select * from finish();
rollback;
