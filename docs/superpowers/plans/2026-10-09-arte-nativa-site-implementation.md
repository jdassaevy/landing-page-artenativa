# Arte Nativa Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir e publicar a V1 do novo site da Arte Nativa e seu painel administrativo, permitindo que visitantes encontrem aulas, locais e eventos com clareza e que os proprietários mantenham todo o conteúdo sem editar código.

**Architecture:** Uma única aplicação Next.js App Router hospedada na Vercel atende o site público e o `/admin`. Supabase fornece PostgreSQL, Auth e Storage; o conteúdo público é renderizado prioritariamente no servidor e cacheado por domínio, enquanto mutações administrativas usam Server Actions protegidas, RLS e invalidação de cache. A interface compartilha um design system Rustic Premium, componentes acessíveis locais e uma camada única de motion/loading states.

**Tech Stack:** Node.js >= 20.9, pnpm, Next.js 16.x App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui + Radix primitives, Motion (`motion/react`), Zod, React Hook Form, Sonner, Supabase (`@supabase/supabase-js` + `@supabase/ssr`), `tus-js-client`, Vitest + React Testing Library, Playwright + axe-core, pgTAP/Supabase CLI, Vercel Analytics + Speed Insights, Google Maps Embed API.

**Spec:** `docs/superpowers/specs/2026-10-09-arte-nativa-site-design.md`

## Global Constraints

- Preservar a logo atual da Arte Nativa; modernizar a linguagem visual em direção **Rustic Premium**.
- Paleta base: `#3A2418`, `#6B4935`, `#C9AD8C`, `#E3D4C1`, `#F6F1E9`, `#FCFAF6`.
- Hero visual na Home; **Aulas e horários** imediatamente abaixo.
- Mobile-first; site e painel administrativo devem ser plenamente utilizáveis no celular.
- Aulas não possuem campo separado de nível, professor ou ordem manual.
- Aulas públicas ordenam por `weekday ASC` (segunda=1 ... domingo=7) e `start_time ASC`.
- Mudanças trimestrais devem preservar histórico; duplicação cria registros novos.
- Eventos oferecem WhatsApp separado para **Reservar mesa** e **Comprar ingresso**.
- No máximo um evento é o pop-up principal ativo por vez.
- Pop-up deve ser fechável e o fechamento deve ser persistido por `event_id`; um novo destaque deve aparecer normalmente.
- Google Maps deve aparecer para locais/eventos sem bloquear o acesso ao endereço e à rota se o mapa falhar.
- Motion é funcional e performático: priorizar `transform`/`opacity`, animações de entrada/saída suaves e `prefers-reduced-motion`.
- Skeletons somente onde houver espera assíncrona perceptível; hero/LCP nunca deve ser lazy-loaded de forma prejudicial.
- Toda ação assíncrona relevante deve ter estados idle/loading/sucesso/erro/disabled; uploads devem expor progresso.
- RLS habilitado em todas as tabelas expostas; `anon` nunca pode alterar dados.
- Nunca expor Supabase secret/service key no cliente; usar publishable key pública e autorização real no banco.
- Autorização administrativa usa `app_metadata.role = 'admin'`, nunca `user_metadata`.
- Sem signup público na V1; administradores são provisionados fora do fluxo público.
- Preferir status/soft-delete a exclusão física.
- Mapas usam Google Maps Embed API com chave restrita aos domínios autorizados; CTA de rota usa URL do Google Maps cadastrada/gerada.
- Uploads V1 aceitam somente `image/jpeg`, `image/png` e `image/webp`, até 8 MB por arquivo; usar TUS resumível para progresso e retomada.
- Evento V1 usa endereço próprio (`venue_*`) em vez de obrigar vínculo com `locations`, porque bailes podem ocorrer em locais únicos.
- Silenciamento padrão do pop-up após fechamento: 24 horas para o mesmo `event_id`.
- Analytics V1: Vercel Web Analytics + Speed Insights; error boundaries + logs Vercel, sem Sentry obrigatório.
- Dependências devem ser fixadas pelo lockfile; não misturar `@supabase/auth-helpers-nextjs` com `@supabase/ssr`.

## Review Focus

1. **Conteúdo temporal:** evento fora da janela de divulgação, evento passado ou período não vigente não pode aparecer como atual; testes de domínio e E2E cobrem limites de data/hora.
2. **Autorização:** usuário autenticado sem `app_metadata.role=admin` não pode mutar banco/Storage nem acessar ações administrativas; pgTAP + integração cobrem casos negativos.
3. **Duplicação trimestral:** duplicar um período deve ser atômico e jamais alterar aulas do período origem; teste de banco compara IDs e valores antes/depois.
4. **Local em uso:** desativar local com aulas ativas deve exigir confirmação explícita e não quebrar aulas existentes; testes de ação e E2E cobrem cancelamento/confirmação.
5. **Falhas parciais de mídia/Maps:** falha de upload ou iframe do mapa não pode apagar formulário nem bloquear endereço/WhatsApp/rota; testes de componente/E2E simulam falha.

---

## File Structure

```text
.
├── .env.example
├── .github/workflows/ci.yml
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── playwright.config.ts
├── vitest.config.ts
├── proxy.ts
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── manifest.ts
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── aulas/page.tsx
│   │   │   ├── locais/page.tsx
│   │   │   ├── eventos/page.tsx
│   │   │   ├── eventos/[slug]/page.tsx
│   │   │   └── sobre/page.tsx
│   │   └── admin/
│   │       ├── login/page.tsx
│   │       ├── recuperar-senha/page.tsx
│   │       └── (protected)/
│   │           ├── layout.tsx
│   │           ├── page.tsx
│   │           ├── aulas/page.tsx
│   │           ├── locais/page.tsx
│   │           ├── eventos/page.tsx
│   │           └── configuracoes/page.tsx
│   ├── components/
│   │   ├── ui/                 # componentes locais shadcn/Radix
│   │   ├── motion/
│   │   ├── site/
│   │   └── admin/
│   ├── lib/
│   │   ├── actions/admin/
│   │   ├── cache/tags.ts
│   │   ├── domain/
│   │   ├── maps.ts
│   │   ├── queries/
│   │   ├── supabase/
│   │   ├── uploads/tus.ts
│   │   └── utils.ts
│   ├── schemas/
│   ├── test/setup.ts
│   └── types/
│       ├── database.ts
│       └── domain.ts
├── supabase/
│   ├── config.toml
│   ├── migrations/<generated-by-cli>_initial_content_schema.sql
│   └── tests/database/
│       ├── 001_schema.test.sql
│       ├── 002_rls.test.sql
│       └── 003_storage.test.sql
└── tests/e2e/
    ├── public.spec.ts
    ├── admin.spec.ts
    └── accessibility.spec.ts
```

**Responsabilidades:** `src/lib/domain` contém regras puras testáveis; `src/lib/queries` contém leitura/cache Supabase; `src/lib/actions/admin` concentra mutações e invalidação; `src/components/site` e `src/components/admin` não acessam banco diretamente; `src/lib/supabase` é a única fábrica de clientes; `schemas` valida entrada de formulário tanto no client quanto no server.

---

### Task 1: Foundation, Design System, Motion and Test Harness

**Files:**
- Create: `package.json`, `pnpm-lock.yaml`, `next.config.ts`, `.env.example`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/(public)/layout.tsx`, `src/app/(public)/page.tsx`
- Create: `src/components/motion/motion-provider.tsx`, `src/components/site/site-header.tsx`, `src/components/site/site-footer.tsx`
- Create: `src/components/ui/*` only for primitives needed by V1
- Create: `vitest.config.ts`, `src/test/setup.ts`, `src/components/motion/motion-provider.test.tsx`
- Modify: `README.md` if scaffold creates it

**Interfaces:**
- Consumes: approved palette/visual direction from spec.
- Produces: `MotionProvider({ children }: PropsWithChildren)`, global CSS tokens (`--brown-900`, `--brown-700`, `--beige-400`, `--sand-200`, `--offwhite-100`, `--warm-white`), `SiteHeader`, `SiteFooter`, shared button/card/dialog/form primitives.

- [ ] **Step 1: Scaffold the application and pin the resolved dependency graph**

Run `pnpm create next-app` with TypeScript, App Router, `src/` directory, ESLint and Tailwind enabled; configure package manager metadata and commit `pnpm-lock.yaml`. Add `motion`, Supabase packages, Zod/RHF, Sonner, Lucide, test packages and local shadcn/Radix primitives only as they become required.

Verification: `pnpm lint` and `pnpm build` both succeed on the untouched scaffold.

- [ ] **Step 2: Write the failing reduced-motion test**

```tsx
it('applies user reduced-motion preference globally', () => {
  render(<MotionProvider><div>content</div></MotionProvider>)
  expect(screen.getByText('content')).toBeInTheDocument()
  expect(MotionConfig).toHaveBeenConfiguredWith({ reducedMotion: 'user' })
})
```

Use a mock/spying strategy appropriate to Motion rather than asserting internal DOM implementation.

Run: `pnpm vitest run src/components/motion/motion-provider.test.tsx`
Expected: FAIL because `MotionProvider` does not exist.

- [ ] **Step 3: Implement global visual tokens, fonts and MotionProvider**

Use `Cormorant Garamond` for editorial headings and `Manrope` for UI/body via `next/font/google`. Configure `MotionConfig reducedMotion="user"`; define reusable motion durations/easings in one module, with fast interaction, standard enter/exit and slow cinematic presets rather than ad-hoc values throughout components.

- [ ] **Step 4: Implement the public shell and initial Rustic Premium skeleton page**

Create semantic header/footer, skip link, responsive nav, focus-visible styling and baseline Home placeholders that establish section geometry without hardcoding CMS content.

- [ ] **Step 5: Verify foundation**

Run: `pnpm lint && pnpm vitest run && pnpm build`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: establish Arte Nativa design system and app foundation"
```

---

### Task 2: Supabase Schema, RLS, Storage and Database Tests

**Files:**
- Create: `supabase/config.toml`
- Create: migration via `supabase migration new initial_content_schema` (do not invent the timestamp filename)
- Create: `supabase/tests/database/001_schema.test.sql`
- Create: `supabase/tests/database/002_rls.test.sql`
- Create: `supabase/tests/database/003_storage.test.sql`
- Create/Generate: `src/types/database.ts`
- Modify: `.env.example`

**Interfaces:**
- Consumes: `app_metadata.role = 'admin'` as the authorization claim.
- Produces DB tables: `locations`, `class_periods`, `classes`, `events`; enum/check constraints; indexes; Storage buckets `event-covers`, `location-images`; function `duplicate_class_period(source_period_id uuid, new_name text, new_starts_at date, new_ends_at date) returns uuid` running as security invoker.
- Produces TS type: generated `Database` from Supabase schema.

- [ ] **Step 1: Initialize Supabase CLI and create the migration shell**

Use CLI `--help` before commands. Initialize local Supabase files, then create migration with `supabase migration new initial_content_schema`.

- [ ] **Step 2: Write failing schema tests**

`001_schema.test.sql` must assert all four tables/required columns exist, `weekday` is constrained to 1..7, `classes.end_time > classes.start_time`, event slug is unique, event status is restricted to `draft|published|archived`, and only one `class_periods.is_current=true` can exist.

Run: `supabase test db`
Expected: FAIL before migration schema is implemented.

- [ ] **Step 3: Implement schema and integrity constraints**

Final event location model for V1:

```text
venue_name, venue_address, venue_city, venue_state,
maps_url, latitude, longitude
```

Do not require `events.location_id`. Add `created_at`/`updated_at`; create practical indexes for public list filtering/order, including classes `(period_id, is_active, weekday, start_time)` and events `(status, event_date, promotion_starts_at, promotion_ends_at)`.

- [ ] **Step 4: Write failing RLS tests**

`002_rls.test.sql` must cover:

```text
anon: SELECT only public/active/published content needed by site
anon: INSERT/UPDATE/DELETE denied
non-admin authenticated: mutation denied
admin authenticated with app_metadata.role=admin: allowed CRUD
UPDATE policies have matching SELECT/USING/WITH CHECK behavior
```

Include negative test proving `user_metadata.role='admin'` does not grant admin powers.

Run: `supabase test db`
Expected: schema tests PASS, RLS tests FAIL.

- [ ] **Step 5: Implement least-privilege grants and RLS**

Enable RLS on every `public` table. Use `TO anon`/`TO authenticated` clauses and `(select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'` for admin authorization. Public policies expose only current/active classes/locations and published event data needed for the site; admin can manage full rows. No `service_role` use in browser code.

- [ ] **Step 6: Write and implement atomic period duplication**

Test first: source period and its classes remain unchanged; destination period receives distinct new IDs with copied values; failure on invalid dates rolls back all destination records. Implement `duplicate_class_period(...)` as security invoker, revoke execute from `PUBLIC`, grant only to `authenticated`, and rely on the same admin authorization/RLS conditions.

- [ ] **Step 7: Write failing Storage policy tests**

Assert public read is allowed for image objects; only admin can insert/update/delete; disallowed extension/bucket path is rejected where policy can enforce it. Application validation covers MIME/8MB limits as a second layer.

- [ ] **Step 8: Create Storage buckets and policies**

Buckets: `event-covers`, `location-images`. Public read; admin write. Avoid object overwrite in normal flow: generate a new path on replacement to avoid CDN stale-content issues.

- [ ] **Step 9: Generate database types and verify DB**

Run current CLI type generation into `src/types/database.ts`, then `supabase test db`.
Expected: all pgTAP tests PASS.

- [ ] **Step 10: Commit**

```bash
git add supabase src/types/database.ts .env.example
git commit -m "feat: add secure content schema and storage policies"
```

---

### Task 3: Supabase Clients, Admin Authentication and Protected Shell

**Files:**
- Create: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/proxy.ts`, `proxy.ts`
- Create: `src/lib/auth/require-admin.ts`, `src/lib/actions/admin/auth.ts`
- Create: `src/schemas/auth.ts`
- Create: `src/app/admin/login/page.tsx`, `src/app/admin/recuperar-senha/page.tsx`
- Create: `src/app/admin/(protected)/layout.tsx`, `src/app/admin/(protected)/page.tsx`
- Create: `src/app/admin/error.tsx`, `src/app/admin/loading.tsx`
- Test: `src/lib/auth/require-admin.test.ts`, `tests/e2e/admin.spec.ts` (auth baseline)

**Interfaces:**
- Consumes: generated `Database`, env `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Produces: `createBrowserClient(): SupabaseClient<Database>`, `createServerClient(): Promise<SupabaseClient<Database>>`, `updateSession(request: NextRequest): Promise<NextResponse>`, `requireAdmin(): Promise<AdminIdentity>`, `loginAdmin(input)`, `requestPasswordReset(email)`, `logoutAdmin()`.

- [ ] **Step 1: Write failing authorization unit tests**

Cases: no session redirects/rejects; authenticated user without admin role rejects; admin app metadata passes. Explicitly test that user metadata cannot satisfy authorization.

Run: `pnpm vitest run src/lib/auth/require-admin.test.ts`
Expected: FAIL.

- [ ] **Step 2: Implement current Supabase SSR clients and proxy**

Use `@supabase/ssr`, cookie-based server/browser clients, and Next.js 16 `proxy.ts`. Use `auth.getClaims()` in the refresh proxy and `getUser()` or equivalently fresh server-confirmed identity in `requireAdmin()` before privileged page/action access; never authorize from unverified client state.

- [ ] **Step 3: Implement admin login/logout/password recovery**

No signup UI. Validate form input with Zod. Login errors are human-readable but do not disclose whether a particular email is an admin account. Password-reset redirect must target a configured application origin.

- [ ] **Step 4: Write failing protected-route E2E tests**

Assertions:

```text
/admin -> /admin/login when logged out
non-admin session cannot enter protected admin
admin session loads dashboard shell
logout returns to login
```

- [ ] **Step 5: Implement protected admin layout and loading/error states**

Responsive sidebar/sheet navigation, mobile-first; include Dashboard, Aulas, Locais, Eventos, Configurações. Admin pages include `noindex` metadata.

- [ ] **Step 6: Verify auth**

Run: `pnpm vitest run src/lib/auth/require-admin.test.ts && pnpm playwright test tests/e2e/admin.spec.ts && pnpm build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src proxy.ts tests/e2e/admin.spec.ts
git commit -m "feat: protect Arte Nativa admin with Supabase auth"
```

---

### Task 4: Domain Rules, Public Queries, Cache and Shared Helpers

**Files:**
- Create: `src/types/domain.ts`
- Create: `src/lib/domain/classes.ts`, `src/lib/domain/events.ts`, `src/lib/domain/whatsapp.ts`, `src/lib/domain/popup.ts`
- Create: `src/lib/cache/tags.ts`
- Create: `src/lib/queries/classes.ts`, `src/lib/queries/locations.ts`, `src/lib/queries/events.ts`, `src/lib/queries/dashboard.ts`
- Test: matching `*.test.ts` files under `src/lib/domain/` and query integration tests where useful
- Modify: `next.config.ts` to enable current stable cache primitives if supported by installed Next.js version

**Interfaces:**
- Produces `sortClasses(classes: DanceClass[]): DanceClass[]`.
- Produces `isEventUpcoming(event, now): boolean`, `isEventInPromotionWindow(event, now): boolean`, `selectPopupEvent(events, now): Event | null`.
- Produces `buildWhatsAppUrl({ phone, message }): string`.
- Produces `popupStorageKey(eventId: string): string` and `POPUP_SILENCE_MS = 86_400_000`.
- Produces cached queries: `getCurrentClasses()`, `getActiveLocations()`, `getUpcomingEvents()`, `getEventBySlug(slug)`, `getPopupEvent()`.
- Cache tags: `classes`, `locations`, `events`, `dashboard`.

- [ ] **Step 1: Write failing domain tests for class order**

```ts
expect(sortClasses(input).map(x => x.id)).toEqual([
  'mon-18', 'mon-20', 'wed-19', 'sun-17'
])
```

Also assert input array is not mutated.

- [ ] **Step 2: Write failing temporal event tests**

Use fixed timestamps and test inclusive/exclusive boundaries for publication, event date and promotion window, including missing promotion start/end where business rule permits.

- [ ] **Step 3: Write failing WhatsApp/popup tests**

Assert E.164-ish normalization for Brazilian numbers, `encodeURIComponent` semantics for message text, event-specific storage key, 24h silence and distinct event IDs.

- [ ] **Step 4: Implement pure domain helpers**

No Supabase calls in domain modules. Clock-dependent functions receive `now` explicitly to keep tests deterministic.

- [ ] **Step 5: Implement cached public queries**

Server-only modules select only required columns. Use current stable Next.js cache tags/lifetimes after verifying installed APIs; target approximately minute-level freshness for public content and invalidate immediately after admin mutation. Queries reapply explicit filters even though RLS also filters.

- [ ] **Step 6: Verify helpers/queries**

Run: `pnpm vitest run src/lib/domain`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib src/types next.config.ts
git commit -m "feat: add Arte Nativa domain rules and cached content queries"
```

---

### Task 5: Public Home, Classes, Locations and Lazy Google Maps

**Files:**
- Create: `src/components/site/hero.tsx`, `classes-section.tsx`, `class-card.tsx`, `class-filters.tsx`
- Create: `src/components/site/locations-section.tsx`, `location-card.tsx`, `lazy-map.tsx`, `section-reveal.tsx`
- Create: `src/lib/maps.ts`
- Create/Modify: `src/app/(public)/page.tsx`, `aulas/page.tsx`, `locais/page.tsx`, `sobre/page.tsx`
- Create: route/loading UI as needed under public pages
- Test: `src/lib/maps.test.ts`, component tests, `tests/e2e/public.spec.ts`

**Interfaces:**
- Consumes: public query functions from Task 4.
- Produces `buildMapsEmbedUrl(location, apiKey): string`, `LazyMap({ query, title })`, public class/location sections and filters.

- [ ] **Step 1: Write failing map URL tests**

Assert URL encodes address or coordinates, includes restricted Embed API key parameter, and rejects missing query/key with a controlled fallback rather than malformed iframe URL.

- [ ] **Step 2: Write failing public-flow E2E tests**

Cover mobile + desktop:

```text
Home hero -> “Ver aulas e horários” scroll/navigation works
classes show Monday→Sunday and time order
filter does not reorder incorrectly
location address remains visible before map load
map is not loaded before viewport/interaction threshold
“Traçar rota” remains usable even if iframe request fails
```

- [ ] **Step 3: Implement Home through Locais**

Hero uses prioritized responsive image (or approved video later) with reserved dimensions and overlay. Render classes immediately after hero. Use Server Components for data-first sections; hydrate only filters/map interactions.

- [ ] **Step 4: Implement lazy map**

Use Google Maps Embed API `iframe`, `loading="lazy"`, `referrerPolicy="strict-origin-when-cross-origin"`, minimum supported dimensions, and IntersectionObserver or explicit click-to-load. API key is browser-visible by design and must be referrer-restricted to preview/production domains.

- [ ] **Step 5: Implement motion and loading states**

Section reveals use transform/opacity only; filter transitions are short; skeletons match card geometry only when navigation/data fetch produces perceptible delay. Reduced-motion collapses nonessential transforms.

- [ ] **Step 6: Verify public class/location flows**

Run: `pnpm vitest run src/lib/maps.test.ts && pnpm playwright test tests/e2e/public.spec.ts && pnpm build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src tests/e2e/public.spec.ts
git commit -m "feat: build public classes and locations experience"
```

---

### Task 6: Events, WhatsApp CTAs and Dismissible Featured Popup

**Files:**
- Create: `src/components/site/events-section.tsx`, `event-card.tsx`, `event-popup.tsx`, `whatsapp-cta.tsx`
- Create/Modify: `src/app/(public)/eventos/page.tsx`, `src/app/(public)/eventos/[slug]/page.tsx`, Home event section
- Create: `src/app/(public)/eventos/[slug]/opengraph-image.tsx` or equivalent dynamic OG strategy
- Test: `src/components/site/event-popup.test.tsx`, event cases in `tests/e2e/public.spec.ts`

**Interfaces:**
- Consumes: `getUpcomingEvents`, `getEventBySlug`, `getPopupEvent`, `buildWhatsAppUrl`, popup key/silence helpers.
- Produces: `EventPopup({ event })`, event pages, two WhatsApp CTAs.

- [ ] **Step 1: Write failing popup component tests**

Cases: open for eligible event; close button and Escape; focus returns correctly; dismissal saved with timestamp; same event stays silent within 24h; new event ID still appears; corrupt localStorage value fails open safely; reduced motion avoids nonessential transform.

- [ ] **Step 2: Write failing event E2E tests**

Cover published/upcoming visibility, past event exclusion from upcoming list, direct event page, popup close, new featured event behavior, and exact WhatsApp message URLs for table/ticket buttons.

- [ ] **Step 3: Implement event list/detail and structured content**

Event page includes cover, date/time, venue, lazy map, accessible description and CTAs. Preserve archived records but exclude them from public upcoming queries.

- [ ] **Step 4: Implement popup**

Use accessible dialog primitive, focus trap, Escape, X, overlay, smooth enter/exit and 24h event-ID-scoped dismissal. Popup failure must never block Home rendering.

- [ ] **Step 5: Implement social preview metadata**

Generate route metadata and event-specific Open Graph image/cover behavior so WhatsApp sharing shows title/date/visual.

- [ ] **Step 6: Verify events**

Run: `pnpm vitest run src/components/site/event-popup.test.tsx src/lib/domain && pnpm playwright test tests/e2e/public.spec.ts && pnpm build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src tests/e2e/public.spec.ts
git commit -m "feat: add events whatsapp flows and featured popup"
```

---

### Task 7: Admin Classes, Periods and Locations Management

**Files:**
- Create: `src/schemas/class.ts`, `src/schemas/period.ts`, `src/schemas/location.ts`
- Create: `src/lib/actions/admin/classes.ts`, `periods.ts`, `locations.ts`
- Create: `src/components/admin/class-form.tsx`, `period-dialog.tsx`, `location-form.tsx`, `entity-table.tsx`, `save-button.tsx`
- Modify: `src/app/admin/(protected)/aulas/page.tsx`, `locais/page.tsx`, dashboard page
- Test: action/unit tests plus relevant `tests/e2e/admin.spec.ts`

**Interfaces:**
- Produces schemas `classSchema`, `periodSchema`, `locationSchema`.
- Produces actions `createClass`, `updateClass`, `setClassActive`, `duplicateClass`, `createPeriod`, `duplicatePeriod`, `createLocation`, `updateLocation`, `setLocationActive`.
- All successful mutations call immediate cache invalidation for the affected domain and return a typed `{ ok, message, fieldErrors? }` result.

- [ ] **Step 1: Write failing validation tests**

Assert invalid weekday, `end_time <= start_time`, missing active location, invalid period range and malformed Google Maps URL fail with field-specific errors.

- [ ] **Step 2: Write failing action authorization tests**

Call each mutation path without admin and assert no write occurs. Add successful admin cases against isolated test data.

- [ ] **Step 3: Implement class/period/location Server Actions**

Every action calls `requireAdmin()` first, validates server-side with Zod, writes through authenticated Supabase server client, and invalidates exact cache tags only after success.

- [ ] **Step 4: Write failing period-duplication E2E flow**

Admin duplicates a current period, edits one copied class and verifies source period remains unchanged; classes in destination keep weekday/time/location until edited.

- [ ] **Step 5: Implement responsive admin UIs**

Desktop table + mobile cards; explicit active/inactive badges; actions Create/Edit/Duplicate/Activate/Deactivate. No manual order field. Weekday labels always render Monday→Sunday using shared domain mapping.

- [ ] **Step 6: Implement location-in-use warning**

Before deactivation, query active class count for that location and show: “Este local está sendo usado por N aulas ativas.” Cancel makes no mutation. Confirmation performs soft deactivation but retains references/history.

- [ ] **Step 7: Add complete async feedback**

Submit button idle→saving→success/error; destructive confirm dialogs; preserve typed form data on server error; list skeletons; toasts via Sonner; mobile touch targets.

- [ ] **Step 8: Verify admin class/location flows**

Run: `pnpm vitest run src/schemas src/lib/actions/admin && pnpm playwright test tests/e2e/admin.spec.ts`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src tests/e2e/admin.spec.ts
git commit -m "feat: add class period and location administration"
```

---

### Task 8: Admin Events and Resumable Media Uploads

**Files:**
- Create: `src/schemas/event.ts`
- Create: `src/lib/actions/admin/events.ts`
- Create: `src/lib/uploads/tus.ts`
- Create: `src/components/admin/event-form.tsx`, `image-upload.tsx`, `upload-progress.tsx`
- Modify: `src/app/admin/(protected)/eventos/page.tsx`, dashboard
- Test: `src/lib/uploads/tus.test.ts`, event action tests, admin E2E event/upload cases

**Interfaces:**
- Produces `eventSchema`.
- Produces `createEvent`, `updateEvent`, `duplicateEvent`, `setEventStatus`, `setFeaturedPopupEvent`.
- Produces `uploadImageResumable({ bucket, file, objectPath, accessToken, onProgress }): Promise<{ path: string }>`.
- Upload progress callback receives integer percentage `0..100`.

- [ ] **Step 1: Write failing event validation tests**

Published event requires title, unique slug, event date, venue information and at least one usable contact CTA when commerce CTA is enabled. Promotion end cannot precede promotion start. Image validation rejects >8MB and MIME outside JPEG/PNG/WebP.

- [ ] **Step 2: Write failing featured-event transaction tests**

When event B becomes popup highlight, event A loses `show_popup`; operation must not produce two active popup highlights. Failure must preserve previous valid highlight.

- [ ] **Step 3: Implement event actions and highlight rule**

Use one database transaction/RPC for exclusive highlight switch if multiple row updates are needed. Preserve archived event data. Mutation invalidates `events` and `dashboard` cache tags.

- [ ] **Step 4: Write failing upload helper tests**

Mock TUS client and assert progress is forwarded, retry errors surface without clearing form state, successful path resolves, and replacement chooses a new object path rather than overwriting old CDN URL.

- [ ] **Step 5: Implement resumable upload**

Use `tus-js-client` against Supabase direct storage hostname, authenticated with current access token solely for upload transport. Follow current Supabase chunk-size/retry guidance at implementation time; expose visible progress bar and retryable failure UI.

- [ ] **Step 6: Implement event admin UI**

Cover preview, upload progress, title/slug, description, date/time, `venue_*`, Maps URL/coordinates, WhatsApp number, separate table/ticket messages, publish state, Home toggle, popup toggle and promotion window.

- [ ] **Step 7: Write/complete E2E event administration tests**

Create draft → upload cover → publish → verify public page → feature popup → verify Home → archive → verify removed from upcoming but preserved in admin.

- [ ] **Step 8: Verify event admin**

Run: `pnpm vitest run src/schemas/event.test.ts src/lib/uploads/tus.test.ts src/lib/actions/admin/events.test.ts && pnpm playwright test tests/e2e/admin.spec.ts tests/e2e/public.spec.ts`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src tests/e2e
git commit -m "feat: add event administration and resumable media uploads"
```

---

### Task 9: SEO, Accessibility, Analytics and Performance Hardening

**Files:**
- Create/Modify: `src/app/layout.tsx`, public route metadata, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/manifest.ts`
- Create: `src/components/site/analytics-events.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Modify: public/admin components for discovered accessibility/performance issues
- Modify: `next.config.ts`

**Interfaces:**
- Produces metadata/canonical/OG for public routes.
- Produces structured data helpers for Organization/Event only when real data exists.
- Produces analytics functions/events for `view_classes`, `open_maps`, `reserve_table`, `buy_ticket`, `view_event`.

- [ ] **Step 1: Write failing metadata/robots tests**

Assert sitemap includes public routes/event slugs, excludes `/admin`; robots disallows admin crawling; event metadata includes title/description/OG image; canonical host uses production site URL env.

- [ ] **Step 2: Write failing accessibility E2E checks**

Use axe against Home, Aulas, Evento, Admin Login and one protected form. Also manually assert keyboard navigation, visible focus, dialog focus trap/Escape, form labels/errors and reduced-motion behavior.

- [ ] **Step 3: Implement SEO and structured data**

Organization/local/event JSON-LD only for factual fields available in database/config. No fabricated ratings, prices or attendance data. Add sitemap/robots/canonicals and social previews.

- [ ] **Step 4: Add Vercel Analytics and Speed Insights**

Track page views plus the five agreed meaningful interaction events without collecting message contents or personal form data.

- [ ] **Step 5: Perform performance hardening**

Audit LCP image priority/sizes, image formats, font subsets, client component boundaries, map laziness, motion properties and bundle size. Ensure public content remains useful before interactive JS finishes.

- [ ] **Step 6: Verify accessibility/performance baseline**

Run: `pnpm lint && pnpm vitest run && pnpm playwright test && pnpm build`.
Then run Lighthouse/Web Vitals check against a production-like preview and record any remaining non-blocking observations in `README.md` or launch checklist.

- [ ] **Step 7: Commit**

```bash
git add src tests next.config.ts README.md
git commit -m "feat: harden SEO accessibility analytics and performance"
```

---

### Task 10: CI, Vercel Preview, Production Data and Domain Cutover

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `.env.example`, `README.md`
- Create: `docs/launch/arte-nativa-launch-checklist.md`
- Vercel/Supabase project configuration: no secrets committed

**Interfaces:**
- Consumes: all tasks 1–9.
- Produces: required CI checks, Vercel project/deployment, production Supabase configuration, seeded real Arte Nativa content, verified `artenativadancas.com.br` cutover checklist.

- [ ] **Step 1: Add CI as a failing gate before merge**

Workflow runs install with frozen lockfile, lint, unit tests, local Supabase DB tests, production build and Playwright critical-path tests. Cache dependency store but never cache secrets.

- [ ] **Step 2: Verify CI locally-equivalent commands**

Run:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm vitest run
supabase test db
pnpm build
pnpm playwright test
```

Expected: PASS.

- [ ] **Step 3: Configure production Supabase safely**

Apply reviewed migrations, configure Auth redirect origins, provision only the owners/admin accounts needed, set admin role in safe app metadata, create buckets/policies, and test anon/non-admin/admin permissions against production configuration before importing content.

- [ ] **Step 4: Configure Vercel preview/production environment**

Set publishable Supabase vars, site URL, restricted Google Maps Embed key and required analytics config. Never set a secret key as `NEXT_PUBLIC_*`. Verify preview deployment before touching the public domain.

- [ ] **Step 5: Seed/rewrite approved real content manually**

Import current classes, locations, Arte Nativa story/contact details and first applicable event only after human review. Do not automatically scrape/import content from the compromised legacy site.

- [ ] **Step 6: Run launch acceptance checklist**

Check every V1 criterion from the spec, especially mobile flows, RLS negative cases, popup behavior, WhatsApp URLs, Maps, upload progress, OG preview, HTTPS, sitemap e robots.

- [ ] **Step 7: Audit old URLs before DNS cutover**

Identify legitimate legacy URLs worth redirecting; do not reproduce spam/compromised URLs. Add only intentional permanent redirects. Verify Google indexing controls and Search Console steps if account access is available.

- [ ] **Step 8: Cut over `artenativadancas.com.br` only after preview approval**

Point DNS/domain to Vercel, verify HTTPS and both apex/`www` canonical behavior, then rerun smoke tests against production.

- [ ] **Step 9: Final verification before completion**

Run all automated checks against the final branch/production-like environment, inspect CI status and deployment logs, and record the exact commit deployed in the launch checklist.

- [ ] **Step 10: Commit launch configuration/docs**

```bash
git add .github README.md .env.example docs/launch
git commit -m "chore: add CI and Arte Nativa launch checklist"
```

---

## Implementation Order and Review Gates

1. Foundation/design system.
2. Database/RLS/Storage.
3. Authentication/admin shell.
4. Domain/query/cache layer.
5. Public classes/locations.
6. Public events/popup.
7. Admin classes/periods/locations.
8. Admin events/uploads.
9. SEO/a11y/analytics/performance.
10. CI/preview/domain launch.

Each task is a reviewable, independently testable increment. Do not start domain cutover before all prior tasks pass their verification commands. Do not point the real domain at preview code.

## Self-Review Results

- **Spec coverage:** all V1 public/admin features, quarterly periods, Maps, WhatsApp, popup, motion/loading, security, SEO, accessibility, analytics, migration and launch criteria map to Tasks 1–10.
- **Deferred decisions resolved:** shadcn/Radix + Tailwind, Motion, Cormorant Garamond/Manrope, current Next cache primitives, 24h popup silence, 8MB JPEG/PNG/WebP, Vercel analytics/logs, event-specific venue fields.
- **Type/interface consistency:** all later tasks consume named helpers/actions introduced by prior tasks; public components never mutate Supabase directly.
- **Review Focus coverage:** temporal filtering (Tasks 4/6), authorization (Tasks 2/3/7/8), atomic period duplication (Tasks 2/7), location-in-use warning (Task 7), upload/Maps degradation (Tasks 5/8).
- **Security check:** authorization does not rely on editable user metadata; public signup omitted; RLS tests include negative paths; secret keys remain server-only/out of repo.
- **Proportion check:** plan defines signatures, tests, commands and boundaries without transcribing component implementations.
