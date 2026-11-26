-- Mapa da Obra — configuração do banco (Supabase)
-- Rode uma vez no SQL Editor do projeto Supabase.

create table if not exists public.membros (
  email text primary key,          -- sempre em minúsculas
  nome  text not null
);

create table if not exists public.liberacoes (
  id      text primary key,        -- "<setor>__<servico>"
  setor   text not null,
  servico text not null,
  st      text check (st in ('C','NC','NA')),   -- null = pendente
  obs     text default '',
  por     text,
  em      bigint not null          -- data/hora em milissegundos
);

create table if not exists public.comentarios (
  id      uuid primary key default gen_random_uuid(),
  setor   text not null,
  servico text,
  tipo    text not null default 'nota' check (tipo in ('nota','status')),
  st      text,
  texto   text default '',
  foto    text,                    -- caminho no bucket "fotos"
  por     text,
  em      bigint not null
);
create index if not exists comentarios_setor on public.comentarios(setor);

-- quem pode escrever: e-mail logado cadastrado em membros
create or replace function public.is_membro() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.membros where email = lower(auth.jwt()->>'email'));
$$;

alter table public.membros     enable row level security;
alter table public.liberacoes  enable row level security;
alter table public.comentarios enable row level security;

-- leitura pública do andamento (quem tem o link vê); troque "anon, authenticated" por "authenticated" para exigir login
drop policy if exists le_lib on public.liberacoes;
create policy le_lib on public.liberacoes for select to anon, authenticated using (true);
drop policy if exists le_cmt on public.comentarios;
create policy le_cmt on public.comentarios for select to anon, authenticated using (true);

drop policy if exists escreve_lib on public.liberacoes;
create policy escreve_lib on public.liberacoes for all to authenticated using (public.is_membro()) with check (public.is_membro());
drop policy if exists escreve_cmt on public.comentarios;
create policy escreve_cmt on public.comentarios for insert to authenticated with check (public.is_membro());

-- cada pessoa só lê o próprio cadastro (os e-mails da equipe não ficam públicos)
drop policy if exists eu_membro on public.membros;
create policy eu_membro on public.membros for select to authenticated using (email = lower(auth.jwt()->>'email'));

-- tempo real
alter publication supabase_realtime add table public.liberacoes, public.comentarios;

-- fotos
insert into storage.buckets (id, name, public) values ('fotos','fotos', true) on conflict (id) do nothing;
drop policy if exists fotos_upload on storage.objects;
create policy fotos_upload on storage.objects for insert to authenticated with check (bucket_id = 'fotos' and public.is_membro());

-- cadastre a equipe (exemplo):
-- insert into public.membros (email, nome) values ('raphaelv.vilela@gmail.com', 'Raphael Vilela');
