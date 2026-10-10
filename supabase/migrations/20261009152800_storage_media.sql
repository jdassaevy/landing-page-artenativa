insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'event-covers',
    'event-covers',
    true,
    8388608,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'location-images',
    'location-images',
    true,
    8388608,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  )
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "admins can read managed storage objects"
on storage.objects
for select
to authenticated
using (
  bucket_id in ('event-covers', 'location-images')
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

create policy "admins can upload managed storage objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('event-covers', 'location-images')
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp', 'avif')
);

create policy "admins can update managed storage objects"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('event-covers', 'location-images')
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  bucket_id in ('event-covers', 'location-images')
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp', 'avif')
);

create policy "admins can delete managed storage objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('event-covers', 'location-images')
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
