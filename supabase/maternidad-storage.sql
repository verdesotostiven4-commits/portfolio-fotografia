-- Ejecuta este archivo una sola vez en Supabase > SQL Editor.
-- Crea el bucket público para que los clientes puedan ver la galería,
-- pero restringe las subidas y cambios a usuarios autenticados.

insert into storage.buckets (id, name, public, allowed_mime_types)
values (
  'client-galleries',
  'client-galleries',
  true,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
    'application/json',
    'application/zip'
  ]
)
on conflict (id) do update
set public = excluded.public,
    allowed_mime_types = excluded.allowed_mime_types;

-- Las previews y originales pueden verse públicamente porque el bucket es público.
-- Solo un usuario autenticado puede administrar la carpeta maternidad-playa.

drop policy if exists "maternity authenticated insert" on storage.objects;
create policy "maternity authenticated insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'client-galleries'
  and (storage.foldername(name))[1] = 'maternidad-playa'
);

drop policy if exists "maternity authenticated select" on storage.objects;
create policy "maternity authenticated select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'client-galleries'
  and (storage.foldername(name))[1] = 'maternidad-playa'
);

drop policy if exists "maternity authenticated update" on storage.objects;
create policy "maternity authenticated update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'client-galleries'
  and (storage.foldername(name))[1] = 'maternidad-playa'
)
with check (
  bucket_id = 'client-galleries'
  and (storage.foldername(name))[1] = 'maternidad-playa'
);

drop policy if exists "maternity authenticated delete" on storage.objects;
create policy "maternity authenticated delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'client-galleries'
  and (storage.foldername(name))[1] = 'maternidad-playa'
);
