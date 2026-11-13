-- QURO: akun & progres di Supabase.
-- Cara pakai: Supabase Dashboard -> SQL Editor -> New query -> tempel seluruh isi berkas ini -> Run. Aman dijalankan ulang.
-- Keamanan: Row Level Security (RLS) aktif. Setiap pengguna hanya bisa membaca/menulis barisnya sendiri;
-- peran "anon" (pengunjung tanpa login) tidak punya akses sama sekali ke tabel ini.

-- 1) Profil (nama panggilan + jenis kelamin; nomor HP sengaja tidak disimpan)
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 20),
  gender     text check (gender in ('L', 'P')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Progres belajar: satu dokumen JSON per pengguna (halaman Iqro, bintang kuis, waktu belajar, bookmark, koin, absen, dll.)
create table if not exists public.progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb check (pg_column_size(data) < 200000),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;

revoke all on public.profiles from anon;
revoke all on public.progress from anon;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.progress to authenticated;

drop policy if exists "profil: baca milik sendiri" on public.profiles;
create policy "profil: baca milik sendiri" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "profil: tambah milik sendiri" on public.profiles;
create policy "profil: tambah milik sendiri" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "profil: ubah milik sendiri" on public.profiles;
create policy "profil: ubah milik sendiri" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "progres: baca milik sendiri" on public.progress;
create policy "progres: baca milik sendiri" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "progres: tambah milik sendiri" on public.progress;
create policy "progres: tambah milik sendiri" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "progres: ubah milik sendiri" on public.progress;
create policy "progres: ubah milik sendiri" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "progres: hapus milik sendiri" on public.progress;
create policy "progres: hapus milik sendiri" on public.progress
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 3) Saat akun baru dibuat, profil dibuat otomatis dari data pendaftaran (name, g).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  nm text := left(btrim(coalesce(new.raw_user_meta_data ->> 'name', '')), 20);
  gd text := new.raw_user_meta_data ->> 'g';
begin
  if nm = '' then
    nm := 'Pengguna';
  end if;
  insert into public.profiles (id, name, gender)
  values (new.id, nm, case when gd in ('L', 'P') then gd else null end)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
