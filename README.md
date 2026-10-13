# Arte Nativa

Novo site institucional e painel administrativo da Arte Nativa, com aulas, locais, eventos, mapa, chamadas para WhatsApp e gestão de conteúdo.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4 + Motion
- Supabase (Auth, Postgres e Storage)
- Vercel Analytics / Speed Insights
- Vitest, Playwright e pgTAP

## Requisitos locais

- Node.js 22 recomendado (mínimo `>=20.9.0`)
- Corepack + pnpm 10.18.3
- Docker
- Supabase CLI

## Desenvolvimento

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
supabase start
pnpm dev
```

Preencha `.env.local` com a URL e a chave pública retornadas pelo Supabase local. Nenhuma chave secreta deve ser commitada ou exposta em variável `NEXT_PUBLIC_*`.

### Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL pública do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave publicável usada pelo cliente e SSR |
| `NEXT_PUBLIC_SITE_URL` | URL canônica do ambiente atual |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` | Chave do Maps Embed, restrita por HTTP referrer |

O E2E usa uma service-role **somente da stack Supabase local** para preparar fixtures. Essa chave é injetada pelo CI e não faz parte da configuração pública da aplicação.

## Qualidade

Os comandos abaixo espelham os gates do CI:

```bash
pnpm lint
pnpm vitest run
supabase test db
pnpm build
pnpm test:e2e
```

Para os testes E2E, mantenha a stack local do Supabase ativa e configure as variáveis públicas para apontar para ela. O workflow do GitHub Actions faz essa preparação automaticamente.

## Estrutura de entrega

- `docs/superpowers/`: especificação e plano de implementação
- `docs/launch/arte-nativa-launch-checklist.md`: checklist de preview, conteúdo, migração e publicação
- `.github/workflows/ci.yml`: lint, testes, build e E2E
- `.github/workflows/database-tests.yml`: testes pgTAP do banco

O domínio `artenativadancas.com.br` só deve ser alterado depois da aprovação visual e funcional do preview. Consulte o checklist de lançamento antes de qualquer mudança de DNS ou promoção para produção.
