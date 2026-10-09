begin;

create extension if not exists pgtap with schema extensions;
select plan(10);

select results_eq(
  $$select id || '|' || public::text || '|' || file_size_limit::text
    from storage.buckets where id = 'event-covers'$$,
  $$values ('event-covers|true|8388608'::text)$$,
  'event covers bucket is public with an 8 MB limit'
);

select results_eq(
  $$select id || '|' || public::text || '|' || file_size_limit::text
    from storage.buckets where id = 'location-images'$$,
  $$values ('location-images|true|8388608'::text)$$,
  'location images bucket is public with an 8 MB limit'
);

select results_eq(
  $$select allowed_mime_types from storage.buckets where id = 'event-covers'$$,
  $$values (array['image/jpeg','image/png','image/webp']::text[])$$,
  'event covers only accept JPEG PNG and WebP'
);

select results_eq(
  $$select allowed_mime_types from storage.buckets where id = 'location-images'$$,
  $$values (array['image/jpeg','image/png','image/webp']::text[])$$,
  'location images only accept JPEG PNG and WebP'
);

select results_eq(
  $$select cmd from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Arte Nativa admins select images'$$,
  $$values ('SELECT'::text)$$,
  'admin storage select policy exists'
);

select results_eq(
  $$select cmd from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Arte Nativa admins insert images'$$,
  $$values ('INSERT'::text)$$,
  'admin storage insert policy exists'
);

select results_eq(
  $$select cmd from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Arte Nativa admins update images'$$,
  $$values ('UPDATE'::text)$$,
  'admin storage update policy exists'
);

select results_eq(
  $$select cmd from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Arte Nativa admins delete images'$$,
  $$values ('DELETE'::text)$$,
  'admin storage delete policy exists'
);

select ok(
  coalesce((select with_check ilike '%app_metadata%' and with_check ilike '%storage.extension%' and with_check ilike '%event-covers%' and with_check ilike '%location-images%'
    from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Arte Nativa admins insert images'), false),
  'upload policy requires admin app metadata allowed buckets and image extensions'
);

select ok(
  coalesce((select qual ilike '%app_metadata%' and with_check ilike '%storage.extension%'
    from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Arte Nativa admins update images'), false),
  'update policy validates both current ownership scope and replacement extension'
);

select * from finish();
rollback;
