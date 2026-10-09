begin;

select plan(18);

select ok(
  exists(select 1 from storage.buckets where id = 'event-covers'),
  'event-covers bucket exists'
);
select ok(
  exists(select 1 from storage.buckets where id = 'location-images'),
  'location-images bucket exists'
);
select is(
  (select public from storage.buckets where id = 'event-covers'),
  true,
  'event-covers bucket is public'
);
select is(
  (select public from storage.buckets where id = 'location-images'),
  true,
  'location-images bucket is public'
);
select is(
  (select file_size_limit from storage.buckets where id = 'event-covers'),
  8388608::bigint,
  'event-covers enforces an 8 MiB limit'
);
select is(
  (select file_size_limit from storage.buckets where id = 'location-images'),
  8388608::bigint,
  'location-images enforces an 8 MiB limit'
);
select is(
  (select array_to_string(allowed_mime_types, ',') from storage.buckets where id = 'event-covers'),
  'image/jpeg,image/png,image/webp,image/avif',
  'event-covers only accepts supported image MIME types'
);
select is(
  (select array_to_string(allowed_mime_types, ',') from storage.buckets where id = 'location-images'),
  'image/jpeg,image/png,image/webp,image/avif',
  'location-images only accepts supported image MIME types'
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('event-covers', 'event-covers', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif']),
  ('location-images', 'location-images', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;

select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"71000000-0000-0000-0000-000000000001","app_metadata":{"role":"member"},"user_metadata":{}}',
  true
);
set local role authenticated;
select throws_like(
  $$insert into storage.objects (bucket_id, name) values ('event-covers', 'member.jpg')$$,
  '%row-level security%',
  'non-admin authenticated user cannot upload'
);
reset role;

select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"71000000-0000-0000-0000-000000000002","app_metadata":{},"user_metadata":{"role":"admin"}}',
  true
);
set local role authenticated;
select throws_like(
  $$insert into storage.objects (bucket_id, name) values ('event-covers', 'fake-admin.jpg')$$,
  '%row-level security%',
  'user_metadata admin cannot upload'
);
reset role;

select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"71000000-0000-0000-0000-000000000003","app_metadata":{"role":"admin"},"user_metadata":{}}',
  true
);
set local role authenticated;
select lives_ok(
  $$insert into storage.objects (bucket_id, name) values ('event-covers', 'events/festa.jpg')$$,
  'admin can upload an allowed event cover'
);
select lives_ok(
  $$insert into storage.objects (bucket_id, name) values ('location-images', 'locais/matriz.webp')$$,
  'admin can upload an allowed location image'
);
select throws_like(
  $$insert into storage.objects (bucket_id, name) values ('event-covers', 'events/arquivo.exe')$$,
  '%row-level security%',
  'admin upload rejects unsupported extensions'
);
select is(
  (select count(*) from storage.objects where bucket_id in ('event-covers', 'location-images')),
  2::bigint,
  'admin can select managed storage objects'
);
select lives_ok(
  $$update storage.objects set name = 'events/festa-editada.png' where bucket_id = 'event-covers' and name = 'events/festa.jpg'$$,
  'admin can update an object to another allowed image extension'
);
select throws_like(
  $$update storage.objects set name = 'events/festa-editada.svg' where bucket_id = 'event-covers' and name = 'events/festa-editada.png'$$,
  '%row-level security%',
  'admin update rejects unsupported extensions'
);
reset role;

select ok(
  exists(
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and cmd = 'DELETE'
      and policyname = 'admins can delete managed storage objects'
  ),
  'admin delete policy exists for Storage API deletion'
);

select set_config('request.jwt.claims', '{"role":"anon","app_metadata":{},"user_metadata":{}}', true);
set local role anon;
select throws_like(
  $$insert into storage.objects (bucket_id, name) values ('event-covers', 'anon.jpg')$$,
  '%row-level security%',
  'anon cannot upload into public buckets'
);
reset role;

select * from finish();
rollback;
