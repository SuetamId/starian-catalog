# Spec 002.2 — Design system visual do painel administrativo

## Status

**Concluída** (2026-05-31).

## Contexto

A Spec 002.1 entregou identidade Starian, sidebar refinada, listagem lista/cards, toast, preview de formulário e quality gates validados (164 testes).

A interface permanece visualmente inconsistente: botões com tamanhos e estilos duplicados, superfícies com sombras pesadas, hierarquia tipográfica variável entre páginas e gradientes decorativos em excesso — sensação “arcaica” em relação a produtos modernos como Vercel e Linear.

Esta spec trata **padronização visual e microinterações** do painel admin CRUD, **sem alterar comportamento de negócio**.

## Objetivo

Elevar listagem, criação e edição de produtos para uma estética premium minimalista:

- fundo quase preto;
- superfícies discretas com bordas finas;
- botões compactos e previsíveis;
- tipografia clara com hierarquia forte;
- microinterações suaves;
- assinatura Starian discreta (símbolo, nome, label Catalog, gradientes raros, foco azul).

## Direção visual obrigatória

- Minimalismo premium inspirado em Vercel/Linear (não cópia literal).
- Sem logos ou assets proprietários de terceiros.
- Sem visual gamer, neon excessivo ou dashboard corporativo tradicional.
- Sem tabela visual estilo ERP.
- Sem dependências externas de UI.

## Escopo

### Tokens globais

- Refinar cores de borda e superfície.
- Compactar radius (6px / 8px / 10px).
- Reduzir sombras; cards border-only por padrão.
- Tokens de tipografia, densidade de controles e motion.

### Mixins de controles (`src/styles/_controls.scss`)

- `control-transition`, `input-control`
- `button-base`, `button-primary`, `button-secondary`, `button-ghost`, `button-danger`
- `button-size-sm`, `button-size-md`
- `segmented-control`, `page-header`, `surface-panel`

### Layout admin

- Sidebar flat; nav ativo sem inset shadow ERP.
- Tipografia de marca consistente.

### Listagem

- Header unificado; toolbar alinhada (toggle + CTA).
- Filtros com inputs padronizados.
- Lista e cards com hover sutil, ações ghost/danger sm.

### Formulário e páginas create/edit

- Campos alinhados aos filtros.
- Preview discreto.
- Headers espelhando listagem.

### Shared UI

- ConfirmDialog, toast, empty/error/loading states com `surface-panel` e botões via mixins.

### Microinterações

- Transições discretas em hover/focus.
- Toast com fade/slide leve.
- Respeitar `prefers-reduced-motion`.

## Fora de escopo

- Loja pública (Spec 003).
- Componente Angular genérico de botão.
- Material, Tailwind ou bibliotecas externas.
- Alteração de store, HTTP, validações ou rotas.

## Critérios de aceite

- Botões primários, secundários, ghost e danger com alturas e padding consistentes em todo o painel admin.
- Cards e painéis sem sombra pesada; bordas finas visíveis.
- Headers de listagem, criação e edição com mesma hierarquia tipográfica.
- Microinterações presentes e desativadas com `prefers-reduced-motion`.
- Acessibilidade WCAG AA preservada (foco, contraste, labels).
- `npm run lint`, `npm run test -- --watch=false` e `npm run build` passando.
- Documentação atualizada (`ESTADO_ATUAL`, `DECISOES`, `SISTEMA_UI`).
