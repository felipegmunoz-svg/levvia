-- Tabela para o Diário de Leveza
-- Cada entrada é um registro qualitativo da usuária, associada ao seu user_id
-- Os dados são usados no relatório médico final em PDF

create table if not exists public.diary_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  content     text not null check (char_length(content) > 0 and char_length(content) <= 5000),
  created_at  timestamptz not null default now()
);

-- Índice para buscar entradas de uma usuária por data
create index if not exists diary_entries_user_created_idx
  on public.diary_entries (user_id, created_at desc);

-- RLS: cada usuária só vê e escreve as próprias entradas
alter table public.diary_entries enable row level security;

create policy "Users can insert own diary entries"
  on public.diary_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can read own diary entries"
  on public.diary_entries for select
  using (auth.uid() = user_id);

create policy "Users can delete own diary entries"
  on public.diary_entries for delete
  using (auth.uid() = user_id);
