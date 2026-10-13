# Checklist de lançamento — Arte Nativa

Documento operacional para levar o novo site da Arte Nativa do PR até `artenativadancas.com.br` sem cortar o site atual antes da aprovação do preview.

## 1. Identificação da release

- [ ] Branch de release confirmada: `feat/foundation-rustic-premium`
- [ ] SHA exato aprovado para publicação: `____________________________`
- [ ] URL do preview: `____________________________`
- [ ] URL de produção: `https://artenativadancas.com.br`
- [ ] Responsável pela aprovação visual/funcional registrado

> Regra de corte: não alterar DNS, domínio, aliases de produção ou promover deployment antes de o preview ser aprovado.

## 2. Gates automatizados

Executar no mesmo SHA que será publicado:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm vitest run
supabase test db
pnpm build
pnpm test:e2e
```

- [ ] `pnpm lint` aprovado
- [ ] suíte Vitest aprovada
- [ ] reduced-motion test aprovado
- [ ] pgTAP / RLS aprovado
- [ ] `next build` aprovado
- [ ] Playwright E2E aprovado
- [ ] job `quality` verde no GitHub Actions
- [ ] job `database` verde no GitHub Actions
- [ ] job `e2e` verde no GitHub Actions

## 3. Supabase dedicado da Arte Nativa

Não reutilizar banco de outro produto.

- [ ] Projeto Supabase próprio criado na organização aprovada
- [ ] Região definida conscientemente
- [ ] Migrations do repositório aplicadas sem edição manual divergente
- [ ] Bucket e políticas de Storage confirmados
- [ ] Redirect URLs de Auth configuradas para preview e produção
- [ ] Apenas contas administrativas necessárias provisionadas
- [ ] Papel administrativo definido em `app_metadata`, não em metadata editável pelo usuário
- [ ] Acesso anônimo validado apenas para leitura pública esperada
- [ ] Usuário autenticado sem papel admin continua bloqueado do painel
- [ ] Admin consegue acessar e editar somente o que a aplicação prevê
- [ ] RLS negativa testada novamente no ambiente de destino
- [ ] Security Advisor revisado após as migrations
- [ ] Performance Advisor revisado após as migrations
- [ ] Nenhuma service-role exposta no browser ou em `NEXT_PUBLIC_*`

## 4. Vercel preview

- [ ] Projeto Vercel dedicado ligado ao repositório correto
- [ ] Framework detectado/configurado como Next.js
- [ ] Node.js compatível com o CI
- [ ] Preview Deployments habilitados
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurada no Preview
- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` configurada no Preview
- [ ] `NEXT_PUBLIC_SITE_URL` aponta para a URL real do Preview
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` configurada e restrita por HTTP referrer
- [ ] Analytics / Speed Insights conferidos
- [ ] Build do preview sem warnings críticos ou secrets impressos em log

## 5. Conteúdo real aprovado

Importar manualmente conteúdo revisado; não copiar automaticamente o site legado.

- [ ] Período atual criado
- [ ] Aulas atuais cadastradas
- [ ] Ordem pública validada de segunda a domingo e por horário
- [ ] Modalidades básicas/avançadas revisadas
- [ ] Locais cadastrados com endereço e coordenadas quando disponíveis
- [ ] Links/rotas do Google Maps conferidos
- [ ] História e texto institucional revisados
- [ ] Contatos oficiais revisados
- [ ] Primeiro evento aplicável cadastrado
- [ ] Mensagens de reserva/ingresso via WhatsApp revisadas
- [ ] Imagens aprovadas, otimizadas e com texto alternativo adequado

## 6. Aceite funcional do preview

### Público

- [ ] Home aprovada em desktop
- [ ] Home aprovada em mobile
- [ ] Menu desktop e menu mobile funcionando
- [ ] `/aulas` carrega, filtra e mantém a ordem correta
- [ ] `/locais` carrega informações antes do iframe do mapa
- [ ] Mapa lazy carrega ao entrar em viewport
- [ ] Alternativa "Traçar rota" funciona sem depender do iframe
- [ ] `/eventos` mostra apenas eventos futuros publicados
- [ ] Detalhe de evento funciona por slug
- [ ] CTA "Reservar mesa" abre o WhatsApp correto
- [ ] CTA "Comprar ingresso" abre o WhatsApp correto
- [ ] Popup de evento em destaque abre quando configurado
- [ ] Popup pode ser fechado por mouse e teclado
- [ ] Silêncio de 24h do popup funciona no mesmo navegador
- [ ] `/sobre` revisado
- [ ] Footer e `/#contato` revisados

### Painel

- [ ] Login administrativo funciona
- [ ] Recuperação de senha funciona com URL do ambiente atual
- [ ] Conta sem `app_metadata` admin é rejeitada
- [ ] Gestão de períodos funciona
- [ ] Gestão de aulas funciona sem campos de professor ou nível
- [ ] Gestão de locais funciona
- [ ] Gestão de eventos funciona
- [ ] Upload mostra progresso, sucesso e erro de forma clara
- [ ] Logout invalida o acesso protegido esperado

### UX, acessibilidade e performance

- [ ] Skeletons aparecem nas rotas de carregamento
- [ ] Imagens/iframes pesados usam carregamento tardio quando aplicável
- [ ] Entradas/saídas e estados de progresso são suaves, sem bloquear interação
- [ ] `prefers-reduced-motion` respeitado
- [ ] Navegação por teclado revisada
- [ ] Foco visível revisado
- [ ] Axe sem violações sérias/críticas nos fluxos cobertos
- [ ] Layout conferido em 390px e larguras desktop comuns
- [ ] Sem overflow horizontal inesperado

## 7. SEO e metadados

- [ ] `NEXT_PUBLIC_SITE_URL` usa a URL correta do ambiente
- [ ] Title/description conferidos
- [ ] Open Graph conferido em home e evento
- [ ] `sitemap.xml` acessível
- [ ] `robots.txt` acessível e coerente com o ambiente
- [ ] Manifest acessível
- [ ] Canonical final definido para o domínio escolhido
- [ ] Preview não é usado como URL canônica final

## 8. URLs do site legado

Rotas públicas identificadas no site anterior e destino proposto:

| URL antiga | Destino proposto | Status |
| --- | --- | --- |
| `/curso-presencial/` | `/aulas` | [ ] confirmar |
| `/curriculo` | `/sobre` | [ ] confirmar |
| `/tradicao` | `/sobre` | [ ] confirmar |
| `/noticias` | `/eventos` | [ ] confirmar |
| `/contato` | `/#contato` | [ ] confirmar |
| `/fotos` | decisão manual — não há galeria V1 equivalente | [ ] decidir |

- [ ] Confirmar quais URLs antigas possuem valor legítimo de tráfego/SEO
- [ ] Implementar apenas redirects intencionais e permanentes
- [ ] Não reproduzir URLs de spam ou páginas comprometidas do legado
- [ ] Testar redirects antes do corte do domínio

## 9. Aprovação do preview — gate obrigatório

- [ ] Conteúdo aprovado pela Arte Nativa
- [ ] Visual aprovado pela Arte Nativa
- [ ] Fluxos mobile aprovados
- [ ] Fluxos administrativos aprovados
- [ ] WhatsApp e Maps aprovados com dados reais
- [ ] Autorização explícita para iniciar o cutover registrada

**Sem todos os itens acima, parar aqui.**

## 10. Cutover do domínio

Antes da alteração:

- [ ] Registrar os valores DNS atuais para rollback
- [ ] Confirmar acesso ao provedor DNS
- [ ] Confirmar projeto/deployment de produção correto na Vercel
- [ ] Confirmar variáveis de produção independentes das de Preview
- [ ] Confirmar Supabase production Auth URLs para domínio final

Durante o corte:

- [ ] Adicionar `artenativadancas.com.br` ao projeto correto
- [ ] Adicionar `www.artenativadancas.com.br` ao projeto correto
- [ ] Escolher apex como canonical e redirecionar `www` para ele, salvo decisão diferente
- [ ] Aplicar os registros DNS indicados pela Vercel
- [ ] Aguardar/confirmar verificação do domínio
- [ ] HTTPS válido no apex
- [ ] HTTPS válido no `www`
- [ ] Redirect canonical funcionando

## 11. Smoke test em produção

- [ ] `/`
- [ ] `/aulas`
- [ ] `/locais`
- [ ] `/eventos`
- [ ] `/sobre`
- [ ] `/admin/login`
- [ ] login/logout administrativo
- [ ] leitura pública do Supabase
- [ ] mutação administrativa do Supabase
- [ ] Maps
- [ ] WhatsApp
- [ ] popup em destaque
- [ ] uploads
- [ ] sitemap/robots
- [ ] redirects do legado
- [ ] logs de runtime sem erros novos relevantes

## 12. Rollback

Se houver regressão grave após o corte:

- [ ] Parar novas alterações de conteúdo
- [ ] Registrar o erro e o horário
- [ ] Se a falha for de código, voltar para o último deployment Vercel estável
- [ ] Se a falha for de DNS/projeto incorreto, restaurar os valores DNS registrados antes do corte
- [ ] Se a falha for de dados/migration, não executar rollback destrutivo sem backup e plano explícito
- [ ] Reexecutar smoke tests após o rollback

## 13. Registro final

- SHA publicado: `____________________________`
- Deployment Vercel: `____________________________`
- Projeto Supabase: `____________________________`
- Data/hora do cutover: `____________________________`
- Responsável pela aprovação: `____________________________`
- Observações pós-lançamento: `____________________________`
