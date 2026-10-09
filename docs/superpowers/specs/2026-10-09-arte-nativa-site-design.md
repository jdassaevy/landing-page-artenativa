# Arte Nativa — Site e Painel Administrativo

**Data:** 2026-10-09
**Status:** Aprovado para implementação em 2026-10-09
**Projeto:** Reconstrução completa do site Arte Nativa
**Domínio existente:** artenativadancas.com.br

## 1. Objetivo

Reconstruir do zero o site da Arte Nativa com uma experiência pública moderna, rápida e responsiva, mantendo a logo atual e renovando a linguagem visual. O site deve priorizar a descoberta de aulas, horários e locais, divulgar bailes e eventos, e permitir que os proprietários atualizem o conteúdo sozinhos por um painel administrativo simples, sem editar código.

O produto deve resolver quatro problemas centrais:

1. Deixar dias, horários, modalidades e locais das aulas claros logo no início da navegação.
2. Permitir alterações trimestrais das aulas sem depender de um desenvolvedor.
3. Permitir criar e divulgar eventos/bailes, incluindo um aviso modal fechável na entrada do site.
4. Exibir locais de aulas e eventos com integração ao Google Maps e rotas.

## 2. Escopo da V1

### 2.1 Site público

- Home completa.
- Seção e página de aulas/horários.
- Seção e página de locais.
- Google Maps para locais e eventos, com carregamento sob demanda.
- Seção de próximos eventos.
- Página individual de evento.
- Página Sobre.
- Contato e CTA para WhatsApp.
- Modal/notificação de evento em destaque.
- SEO técnico e compartilhamento social.
- Responsividade completa para mobile, tablet e desktop.

### 2.2 Painel administrativo

- Login protegido.
- Dashboard resumido.
- CRUD de aulas.
- CRUD de locais.
- CRUD de eventos.
- Upload de imagens/banners.
- Publicar/despublicar conteúdo.
- Ativar/desativar aulas e locais.
- Arquivar eventos.
- Configurar evento em destaque e modal.
- Duplicar aulas/períodos para facilitar mudanças trimestrais.

### 2.3 Fora do escopo da V1

- Matrícula online.
- Pagamentos no site.
- Área do aluno.
- Lista de presença.
- Gestão financeira.
- Venda de ingressos integrada.
- Mapa interativo de escolha de mesas.
- Aplicativo mobile nativo.
- Notificações automáticas externas.

## 3. Direção visual

### 3.1 Conceito

**Rustic Premium**, com elementos cinematográficos em momentos de destaque.

A estética deve reinterpretar a cultura gaúcha/tradicional de forma contemporânea, evitando aparência de site antigo, excesso de texturas rústicas, ornamentos pesados ou visual temático caricato.

A logo atual da Arte Nativa será preservada.

### 3.2 Paleta base

- Marrom profundo: `#3A2418`
- Marrom médio: `#6B4935`
- Bege: `#C9AD8C`
- Areia: `#E3D4C1`
- Off-white: `#F6F1E9`
- Branco quente: `#FCFAF6`

A paleta poderá receber pequenos ajustes de contraste durante implementação e testes de acessibilidade, sem alterar a direção aprovada.

### 3.3 Tipografia

- Títulos: serif elegante/editorial.
- Interface, textos e formulários: sans-serif moderna, legível e de boa performance.
- Fontes deverão ser carregadas de forma otimizada e com fallback adequado.

### 3.4 Componentes visuais

- Cards com cantos discretamente arredondados.
- Sombras leves e pouco frequentes.
- Bastante respiro e hierarquia tipográfica.
- Fotografias reais da Arte Nativa como elemento de marca.
- Marrom profundo usado para contraste e seções especiais, não como fundo contínuo do site inteiro.

## 4. Arquitetura da Home

### 4.1 Header

- Logo à esquerda.
- Navegação: Início, Aulas, Locais, Eventos, Sobre e Contato.
- CTA destacado: **Encontrar minha turma**.
- Menu mobile compacto com abertura/fechamento suave.

### 4.2 Hero

- Foto ou vídeo forte da Arte Nativa.
- Overlay sutil para legibilidade.
- Headline editorial, com referência aprovada do tipo: “Tradição que se dança. Cultura que se vive.”
- Texto curto institucional.
- CTA primário: **Ver aulas e horários**.
- CTA secundário: **Conhecer a Arte Nativa**.

O hero deve ser visualmente marcante, mas a descoberta de aulas não pode ficar escondida.

### 4.3 Aulas e horários

A seção vem imediatamente abaixo do hero e é a principal área funcional da Home.

Cada card deverá mostrar:

- Modalidade.
- Dia da semana.
- Horário inicial e final.
- Local.
- CTA **Ver localização**.

Não haverá campo separado de nível. Se necessário, básico/avançado será representado na própria modalidade.

Não haverá professor.

A ordenação deve ser automática por dia da semana:

1. Segunda-feira
2. Terça-feira
3. Quarta-feira
4. Quinta-feira
5. Sexta-feira
6. Sábado
7. Domingo

Dentro do mesmo dia, ordenar por horário inicial crescente.

A interface poderá oferecer filtros por dia e, quando útil, por local/cidade.

### 4.4 Locais

Cada local deverá apresentar:

- Nome.
- Endereço.
- Cidade.
- Aulas vinculadas, quando relevante.
- Preview/mapa carregado sob demanda.
- CTA **Abrir no Google Maps / Traçar rota**.

### 4.5 Próximos eventos

- Cards com banner, data, título, local e CTA.
- Apenas eventos publicados e válidos devem aparecer.
- Eventos encerrados deixam automaticamente a área de próximos eventos, sem serem apagados.

### 4.6 Sobre

- História resumida da Arte Nativa.
- Foto real.
- CTA para página completa Sobre.

### 4.7 CTA final e footer

- CTA final direcionando para turmas/aulas.
- Footer com logo, WhatsApp, Instagram, contatos e links úteis.

## 5. Painel administrativo

### 5.1 Princípio de UX

O painel deve ser utilizável pelos proprietários sem conhecimento técnico, inclusive pelo celular.

As ações devem ser explícitas, com feedback de carregamento, sucesso, erro e confirmação quando houver risco de perda.

### 5.2 Dashboard

Exibir de forma resumida:

- Quantidade de aulas ativas.
- Quantidade de locais ativos.
- Próximos eventos.
- Evento atualmente em destaque.
- Ações rápidas: Nova aula, Novo local, Novo evento.

### 5.3 Gestão de aulas

Campos:

- Modalidade/nome da turma.
- Dia da semana.
- Horário inicial.
- Horário final.
- Local vinculado.
- Status ativo/inativo.
- Período/trimestre opcional para organização interna.

Não incluir:

- Campo de nível separado.
- Professor.
- Ordem manual de exibição.

Ações:

- Criar.
- Editar.
- Duplicar.
- Ativar/desativar.
- Excluir somente com confirmação explícita, preferencialmente evitando exclusão física.

### 5.4 Duplicação de período

Deve existir um fluxo para copiar uma grade vigente para um novo período, por exemplo:

- Janeiro–Março 2027
- duplicar para Abril–Junho 2027

Após duplicar, o administrador poderá alterar apenas local, dia, horário ou modalidade das aulas que mudaram.

A funcionalidade deve evitar que mudanças no novo período alterem registros históricos do período anterior.

### 5.5 Gestão de locais

Campos:

- Nome.
- Endereço completo.
- Cidade.
- Estado, se necessário.
- Link ou identificador do Google Maps.
- Latitude/longitude quando necessário para integração.
- Foto opcional.
- Status ativo/inativo.

Aulas se relacionam ao local por `location_id`, evitando duplicação de endereço.

Ao tentar desativar um local usado por aulas ativas, mostrar aviso com a quantidade de aulas afetadas antes de confirmar.

### 5.6 Gestão de eventos

Campos:

- Título.
- Slug amigável.
- Banner/capa.
- Descrição.
- Data.
- Horário.
- Local vinculado ou endereço específico, conforme modelagem final.
- Número de WhatsApp.
- Mensagem para reserva de mesas.
- Mensagem para compra de ingressos.
- Status: rascunho/publicado/arquivado.
- Mostrar na Home.
- Mostrar como pop-up.
- Data/hora inicial de divulgação.
- Data/hora final de divulgação.

Ações:

- Criar.
- Editar.
- Duplicar.
- Publicar/despublicar.
- Arquivar.
- Definir/remover destaque.

## 6. Eventos, WhatsApp e pop-up

### 6.1 CTAs do evento

Cada evento pode oferecer dois CTAs:

- **Reservar mesa**.
- **Comprar ingresso**.

O sistema deverá gerar automaticamente os links do WhatsApp a partir do número e da mensagem cadastrados, evitando que o administrador precise montar `wa.me` manualmente.

### 6.2 Modal de evento em destaque

Quando houver evento publicado, dentro da janela de divulgação e marcado para pop-up:

- Mostrar um modal ao visitante na entrada do site.
- Exibir banner/imagem, título, data, local e CTA **Ver evento**.
- Permitir fechar no `X`.
- Aplicar animação suave de entrada e saída.
- Persistir o fechamento no navegador para evitar repetição excessiva.

A chave de persistência deve identificar o evento. Um novo evento em destaque deve poder aparecer mesmo que o visitante tenha fechado um evento anterior.

A duração do silenciamento após fechar será configurada na implementação com um padrão razoável; a escolha não deve impedir que um novo destaque seja exibido.

### 6.3 Regras de encerramento

Após a data de término/divulgação:

- O pop-up deixa de ser exibido.
- O evento sai de “Próximos eventos”.
- O registro é preservado.
- O administrador pode arquivá-lo.

## 7. Google Maps

### 7.1 Princípios

- Evitar carregar múltiplos mapas pesados imediatamente.
- Mostrar endereço e CTA imediatamente.
- Carregar mapa apenas quando entrar em viewport ou após interação, conforme impacto de performance observado.
- CTA de rota abre Google Maps.

### 7.2 Relação com locais

Locais de aula devem ser entidades reutilizáveis.

Uma alteração no endereço de um local deve refletir automaticamente em todas as aulas vinculadas, sem editar cada aula.

## 8. Arquitetura técnica

### 8.1 Stack aprovada

- **Next.js** para site público e painel administrativo.
- **Supabase** para PostgreSQL, autenticação e armazenamento de mídia.
- **Vercel** para hospedagem e deploy.

Evitar decisões dependentes de versões específicas nesta especificação. Versões e APIs atuais serão confirmadas na fase de implementação.

### 8.2 Rotas previstas

```text
/
/aulas
/locais
/eventos
/eventos/[slug]
/sobre
/contato (opcional; poderá ser seção da Home)
/admin
/admin/login
/admin/aulas
/admin/locais
/admin/eventos
/admin/configuracoes
```

A estrutura final pode usar route groups/layouts internos do Next.js sem alterar URLs públicas.

## 9. Modelo de dados conceitual

### 9.1 `locations`

Campos conceituais:

- `id`
- `name`
- `address`
- `city`
- `state`
- `maps_url`
- `latitude`
- `longitude`
- `image_path`
- `is_active`
- `created_at`
- `updated_at`

### 9.2 `class_periods`

Entidade recomendada para agrupar ciclos trimestrais e preservar histórico.

- `id`
- `name`
- `starts_at`
- `ends_at`
- `is_current`
- `created_at`

### 9.3 `classes`

- `id`
- `period_id`
- `modality`
- `weekday` (valor estruturado 1–7)
- `start_time`
- `end_time`
- `location_id`
- `is_active`
- `created_at`
- `updated_at`

Regra de ordenação pública: `weekday ASC`, depois `start_time ASC`.

### 9.4 `events`

- `id`
- `title`
- `slug`
- `description`
- `cover_image_path`
- `event_date`
- `start_time`
- `location_id` ou campos específicos de endereço quando necessário
- `whatsapp_number`
- `table_reservation_message`
- `ticket_purchase_message`
- `status`
- `show_on_home`
- `show_popup`
- `promotion_starts_at`
- `promotion_ends_at`
- `created_at`
- `updated_at`

Regra: no máximo um evento pode ser tratado como destaque de pop-up principal por vez, salvo decisão futura explícita de suportar fila/carrossel de anúncios.

### 9.5 Administradores

Autenticação via Supabase Auth.

Autorização deve usar dados seguros de aplicação/roles próprios e políticas no banco. Não usar metadados editáveis pelo usuário como fonte de autorização.

## 10. Segurança e permissões

- RLS habilitado em tabelas expostas pela Data API.
- Visitantes anônimos: apenas leitura de conteúdo público necessário.
- Administradores autenticados e autorizados: CRUD conforme função.
- Nenhuma chave privilegiada no cliente.
- Storage com políticas específicas de leitura/escrita.
- Validação de tipo e tamanho de arquivo em uploads.
- Confirmação antes de operações destrutivas.
- Preferir soft delete/status a exclusão física.
- `/admin` fora de indexação de mecanismos de busca.
- Recuperação de senha segura.
- Sessões protegidas.
- Auditoria mínima via timestamps; log de ações administrativas pode ser adicionado se necessário no plano de implementação.

## 11. Motion, loading e estados de interface

Os princípios de movimento são requisito global, tanto no site público quanto no painel.

### 11.1 Direção de motion

- Movimento polido, expressivo e funcional.
- Evitar animação constante sem propósito.
- Priorizar `transform` e `opacity` para performance.
- Usar entradas escalonadas com moderação em hero, cards e seções.
- Modais e menus devem ter animações de entrada e saída.
- Microinterações em botões, tabs, filtros e feedbacks.
- Respeitar `prefers-reduced-motion`.

### 11.2 Skeletons

Usar skeleton quando uma área depende de consulta assíncrona e sua geometria é conhecida, por exemplo:

- Cards de aulas.
- Lista de eventos.
- Dashboard administrativo.
- Listagens do admin.

Evitar skeleton meramente decorativo em conteúdo já renderizado no servidor/cachê quando não há espera perceptível.

### 11.3 Lazy loading

- Imagens fora da primeira dobra.
- Mapas.
- Componentes pesados.
- Conteúdo secundário quando houver benefício real.

Hero/LCP deve ser priorizado, não lazy-loaded de forma que piore Core Web Vitals.

### 11.4 Estados obrigatórios

Toda ação assíncrona relevante deve possuir:

- Idle.
- Loading/progresso.
- Sucesso.
- Erro recuperável.
- Disabled quando não puder ser acionada.

Uploads devem mostrar progresso quando tecnicamente disponível.

Exemplo:

`Salvar` → `Salvando…` → `✓ Salvo` ou erro com ação de tentar novamente.

## 12. Performance

- Imagens otimizadas e responsivas.
- Formatos modernos quando suportados.
- Lazy loading fora da primeira dobra.
- Mapas carregados sob demanda.
- Cache do conteúdo público apropriado ao ritmo de atualização.
- Fonts otimizadas.
- Minimizar JavaScript desnecessário no site público.
- Server Components/SSR/SSG/ISR escolhidos por rota conforme benefício e atualização necessária, sem dogmatismo.
- Evitar hidratação de componentes puramente estáticos.
- Monitorar Core Web Vitals.

## 13. SEO e compartilhamento

- Metadata por rota.
- Títulos e descrições específicos.
- Sitemap.
- `robots.txt`.
- URLs amigáveis.
- Canonicals quando necessário.
- Open Graph e metadata para WhatsApp/redes sociais.
- Imagem de compartilhamento para eventos.
- Dados estruturados para organização/local/evento quando compatíveis com o conteúdo real.
- Páginas públicas indexáveis; admin não indexável.
- Estratégia local visando pesquisas de aulas de dança e Arte Nativa na região atendida.

## 14. Acessibilidade

- Contraste mínimo adequado.
- Navegação completa por teclado.
- Focus visível.
- Labels e mensagens de erro em formulários.
- `aria` apenas quando HTML semântico não for suficiente.
- Modais com foco controlado e Escape para fechar quando apropriado.
- Imagens com `alt` adequado.
- `prefers-reduced-motion`.
- Tamanhos de toque confortáveis no mobile.

## 15. Responsividade

Prioridade mobile-first.

Fluxos críticos no celular:

1. Site → aulas → local → Google Maps.
2. Site → evento → reservar mesa/comprar ingresso → WhatsApp.
3. Admin → login → editar aula/evento → salvar.

O painel deve ser plenamente utilizável no celular, não apenas “adaptado”.

## 16. Tratamento de erros

- Erros públicos devem ter mensagem amigável e possibilidade de tentar novamente quando aplicável.
- Erros administrativos devem preservar o conteúdo digitado sempre que possível.
- Falha de upload não deve apagar os demais campos do formulário.
- Falha de mapa não deve impedir acesso ao endereço/link de rota.
- Falha ao carregar pop-up não deve bloquear o restante da página.
- Estados vazios devem explicar o próximo passo (ex.: “Nenhum evento publicado”).

## 17. Regras de integridade

- `end_time > start_time` para aulas.
- Evento publicado exige título, data e informações mínimas de local/contato.
- Slug de evento deve ser único.
- Não permitir aula ativa associada a local inexistente.
- Desativação de local com aulas ativas requer aviso.
- Duplicar período cria novos registros; não reutiliza registros do período anterior.
- Novo evento em destaque deve substituir ou exigir remoção do destaque anterior para manter regra de um destaque principal.

## 18. Migração do site antigo

O código do site antigo não será utilizado como base técnica.

O domínio `artenativadancas.com.br` será preservado e apontado para a nova aplicação após validação.

Conteúdo histórico útil poderá ser migrado manualmente ou reescrito, mas não será importado automaticamente sem revisão.

Antes da troca de DNS/deploy final:

- Validar domínio.
- Validar HTTPS.
- Conferir redirects necessários de URLs antigas relevantes.
- Conferir sitemap/robots.
- Confirmar que conteúdo indevido ou URLs antigas comprometidas não sejam reproduzidos na aplicação nova.

## 19. Observabilidade e analytics

Na V1:

- Analytics básico de tráfego.
- Monitoramento de erros de aplicação recomendado.
- Logs de deploy/runtime disponíveis pela plataforma.

Métricas úteis:

- Cliques em “Ver aulas”.
- Cliques em Google Maps/rota.
- Cliques em reservar mesa.
- Cliques em comprar ingresso.
- Visualizações de páginas de evento.

## 20. Critérios de aceite da V1

A V1 será considerada pronta quando:

1. Visitante encontrar aulas, horários e locais com clareza no mobile e desktop.
2. Aulas estiverem ordenadas de segunda a domingo e por horário.
3. Proprietários conseguirem criar/editar/desativar aulas sem código.
4. Proprietários conseguirem cadastrar locais e reutilizá-los nas aulas.
5. Proprietários conseguirem criar/publicar/arquivar eventos.
6. Um evento configurado como pop-up aparecer conforme sua janela de divulgação e puder ser fechado.
7. Novo evento em destaque puder aparecer mesmo após fechamento de destaque anterior.
8. CTAs de mesa/ingresso abrirem WhatsApp com mensagens corretas.
9. Links/mapas permitirem chegar aos locais sem ambiguidade.
10. Interface possuir estados de loading, erro e sucesso coerentes.
11. Motion respeitar reduced motion e não prejudicar usabilidade/performance.
12. Visitantes não conseguirem alterar dados do banco.
13. Apenas administradores autorizados acessarem operações do painel.
14. Site possuir metadata, sitemap, robots e previews sociais válidos.
15. Fluxos críticos funcionarem no celular.
16. Deploy em produção usar o domínio oficial com HTTPS válido.

## 21. Estratégia de testes a detalhar no plano de implementação

- Testes unitários para regras de domínio e helpers.
- Testes de integração para banco/policies e ações administrativas críticas.
- Testes E2E dos fluxos principais públicos e administrativos.
- Teste de responsividade em breakpoints representativos.
- Testes de acessibilidade automatizados + revisão manual dos fluxos críticos.
- Teste de performance/Core Web Vitals antes do lançamento.
- Verificação específica de RLS e Storage policies antes de produção.

## 22. Decisões aprovadas

- Refazer do zero, sem reutilizar o código antigo.
- Preservar a logo atual.
- Modernizar identidade visual.
- Paleta marrom + off-white/gelo + bege.
- Direção Rustic Premium com momentos cinematográficos.
- Hero visual + aulas imediatamente abaixo.
- Painel próprio de administração.
- Stack Next.js + Supabase + Vercel.
- Sem campo de professor.
- Sem campo de nível separado.
- Ordenação automática de aulas por dia da semana.
- Eventos com WhatsApp para mesas e ingressos.
- Pop-up de evento fechável.
- Google Maps para aulas e eventos.
- Motion, skeletons, lazy loading e estados completos como requisitos globais.

## 23. Questões deliberadamente adiadas para implementação

Estas escolhas não alteram o design de produto e serão definidas/validadas no plano técnico:

- Biblioteca de componentes e formulários.
- Biblioteca de animação específica, caso necessária.
- Fonte tipográfica final.
- Estratégia exata SSR/ISR/cache por rota.
- Duração padrão do silenciamento do pop-up após fechamento.
- Limites exatos de tamanho/formato de upload.
- Provedor/forma exata de analytics e error tracking.
- Modelagem final de evento com `location_id` obrigatório vs. endereço customizável.

Essas decisões devem privilegiar simplicidade, segurança, performance e facilidade de manutenção, sem expandir o escopo da V1.
