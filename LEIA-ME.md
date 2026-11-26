# Mapa da Obra — site externo

O banco (Supabase, projeto `mapa-obra-gbm`, região São Paulo) já está criado e configurado em `config.js`.

## Colocar no ar (GitHub Pages, grátis)
1. Crie um repositório (ex.: `mapa-obra`) e envie todos estes arquivos para a raiz.
2. Settings → Pages → Source: "Deploy from a branch", branch `main`, pasta `/ (root)`.
3. O site fica em https://SEU-USUARIO.github.io/mapa-obra/

## Liberar o login por e-mail (uma vez)
No painel do Supabase → Authentication → URL Configuration:
- **Site URL:** o endereço do site (ex.: https://SEU-USUARIO.github.io/mapa-obra/)
- **Redirect URLs:** adicione o mesmo endereço.

## Equipe
Só e-mails cadastrados na tabela `membros` podem liberar serviços. Para incluir alguém, peça ao Claude ou rode no SQL Editor:
`insert into membros (email, nome) values ('email@exemplo.com','Nome');` (e-mail em minúsculas)

## Uso
- Qualquer pessoa com o link vê o andamento. Para editar: **Entrar** → e-mail cadastrado → abrir o link recebido.
- Link direto para um setor: `#id-do-setor` no fim do endereço (ex.: `#casa01-comando-25-29`).
