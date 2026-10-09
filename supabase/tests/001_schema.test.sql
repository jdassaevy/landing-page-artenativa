begin;

select plan(65);

select has_table('public', 'locations', 'locations table exists');
select has_table('public', 'class_periods', 'class_periods table exists');
select has_table('public', 'classes', 'classes table exists');
select has_table('public', 'events', 'events table exists');

select has_column('public', 'locations', 'id', 'locations.id exists');
select has_column('public', 'locations', 'name', 'locations.name exists');
select has_column('public', 'locations', 'address', 'locations.address exists');
select has_column('public', 'locations', 'city', 'locations.city exists');
select has_column('public', 'locations', 'state', 'locations.state exists');
select has_column('public', 'locations', 'maps_url', 'locations.maps_url exists');
select has_column('public', 'locations', 'latitude', 'locations.latitude exists');
select has_column('public', 'locations', 'longitude', 'locations.longitude exists');
select has_column('public', 'locations', 'image_path', 'locations.image_path exists');
select has_column('public', 'locations', 'is_active', 'locations.is_active exists');
select has_column('public', 'locations', 'created_at', 'locations.created_at exists');
select has_column('public', 'locations', 'updated_at', 'locations.updated_at exists');

select has_column('public', 'class_periods', 'id', 'class_periods.id exists');
select has_column('public', 'class_periods', 'name', 'class_periods.name exists');
select has_column('public', 'class_periods', 'starts_at', 'class_periods.starts_at exists');
select has_column('public', 'class_periods', 'ends_at', 'class_periods.ends_at exists');
select has_column('public', 'class_periods', 'is_current', 'class_periods.is_current exists');
select has_column('public', 'class_periods', 'created_at', 'class_periods.created_at exists');
select has_column('public', 'class_periods', 'updated_at', 'class_periods.updated_at exists');

select has_column('public', 'classes', 'id', 'classes.id exists');
select has_column('public', 'classes', 'period_id', 'classes.period_id exists');
select has_column('public', 'classes', 'location_id', 'classes.location_id exists');
select has_column('public', 'classes', 'modality', 'classes.modality exists');
select has_column('public', 'classes', 'weekday', 'classes.weekday exists');
select has_column('public', 'classes', 'start_time', 'classes.start_time exists');
select has_column('public', 'classes', 'end_time', 'classes.end_time exists');
select has_column('public', 'classes', 'is_active', 'classes.is_active exists');
select has_column('public', 'classes', 'created_at', 'classes.created_at exists');
select has_column('public', 'classes', 'updated_at', 'classes.updated_at exists');

select has_column('public', 'events', 'id', 'events.id exists');
select has_column('public', 'events', 'title', 'events.title exists');
select has_column('public', 'events', 'slug', 'events.slug exists');
select has_column('public', 'events', 'cover_path', 'events.cover_path exists');
select has_column('public', 'events', 'description', 'events.description exists');
select has_column('public', 'events', 'event_date', 'events.event_date exists');
select has_column('public', 'events', 'venue_name', 'events.venue_name exists');
select has_column('public', 'events', 'venue_address', 'events.venue_address exists');
select has_column('public', 'events', 'venue_city', 'events.venue_city exists');
select has_column('public', 'events', 'venue_state', 'events.venue_state exists');
select has_column('public', 'events', 'maps_url', 'events.maps_url exists');
select has_column('public', 'events', 'latitude', 'events.latitude exists');
select has_column('public', 'events', 'longitude', 'events.longitude exists');
select has_column('public', 'events', 'whatsapp_phone', 'events.whatsapp_phone exists');
select has_column('public', 'events', 'reservation_message', 'events.reservation_message exists');
select has_column('public', 'events', 'ticket_message', 'events.ticket_message exists');
select has_column('public', 'events', 'status', 'events.status exists');
select has_column('public', 'events', 'show_on_home', 'events.show_on_home exists');
select has_column('public', 'events', 'show_as_popup', 'events.show_as_popup exists');
select has_column('public', 'events', 'promotion_starts_at', 'events.promotion_starts_at exists');
select has_column('public', 'events', 'promotion_ends_at', 'events.promotion_ends_at exists');
select has_column('public', 'events', 'created_at', 'events.created_at exists');
select has_column('public', 'events', 'updated_at', 'events.updated_at exists');

select lives_ok(
  $$insert into public.locations (name, address, city, state) values ('Matriz', 'Rua Teste, 1', 'Santo Amaro da Imperatriz', 'SC')$$,
  'a valid location can be inserted'
);

select lives_ok(
  $$insert into public.class_periods (name, starts_at, ends_at, is_current) values ('2027 T1', '2027-01-01', '2027-03-31', true)$$,
  'a valid current class period can be inserted'
);

select throws_ok(
  $$insert into public.classes (period_id, location_id, modality, weekday, start_time, end_time)
    select p.id, l.id, 'Danca teste', 0, '18:00', '19:00'
    from public.class_periods p cross join public.locations l limit 1$$,
  '23514', null, 'weekday below 1 is rejected'
);

select throws_ok(
  $$insert into public.classes (period_id, location_id, modality, weekday, start_time, end_time)
    select p.id, l.id, 'Danca teste', 8, '18:00', '19:00'
    from public.class_periods p cross join public.locations l limit 1$$,
  '23514', null, 'weekday above 7 is rejected'
);

select throws_ok(
  $$insert into public.classes (period_id, location_id, modality, weekday, start_time, end_time)
    select p.id, l.id, 'Danca teste', 2, '19:00', '18:00'
    from public.class_periods p cross join public.locations l limit 1$$,
  '23514', null, 'end_time must be after start_time'
);

select lives_ok(
  $$insert into public.events (title, slug, event_date, status) values ('Evento teste', 'evento-teste', '2027-02-10 20:00:00-03', 'published')$$,
  'a valid event can be inserted'
);

select throws_ok(
  $$insert into public.events (title, slug, event_date, status) values ('Outro evento', 'evento-teste', '2027-02-11 20:00:00-03', 'draft')$$,
  '23505', null, 'event slug is unique'
);

select throws_like(
  $$insert into public.events (title, slug, event_date, status) values ('Invalido', 'evento-invalido', '2027-02-12 20:00:00-03', 'invalid')$$,
  '%status%', 'event status rejects values outside draft, published and archived'
);

select throws_ok(
  $$insert into public.class_periods (name, starts_at, ends_at, is_current) values ('2027 T2', '2027-04-01', '2027-06-30', true)$$,
  '23505', null, 'only one class period can be current'
);

select * from finish();
rollback;
