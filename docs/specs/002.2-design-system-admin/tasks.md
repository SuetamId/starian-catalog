# Tarefas — Spec 002.2 Design system visual do painel admin

## Tokens e controles

- [x] Atualizar `_variables.scss` (bordas, radius, tipografia, densidade, sombra).
- [x] Atualizar `_theme.scss` com novos CSS custom properties.
- [x] Criar `_controls.scss` com mixins de botão, input, surface, page-header, motion.
- [x] Forward `_controls.scss` em `_index.scss`.
- [x] Refatorar `surface-card` para usar `surface-panel`.

## Layout

- [x] Refinar `admin-layout` (nav flat, marca, transições).

## Listagem

- [x] Aplicar mixins em `products-list-page`.
- [x] Aplicar mixins em `product-list` e `product-card-list`.
- [x] Aplicar mixins em `product-filters` e `_category-chip`.

## Formulário

- [x] Aplicar mixins em `product-form`.
- [x] Unificar headers em `product-create-page` e `product-edit-page`.

## Shared UI

- [x] Atualizar `confirm-dialog`, `toast`, `empty-state`, `error-state`, `loading-state`.

## UX e performance (encerramento)

- [x] Cards com altura uniforme e conteúdo truncado.
- [x] Linha e card clicáveis para edição/detalhe admin.
- [x] `ProductImage` com `deferUntilVisible` e otimizações na listagem.

## Documentação e validação

- [x] Registrar ADR-021.
- [x] Atualizar `docs/SISTEMA_UI.md` e `docs/ESTADO_ATUAL.md`.
- [x] Preencher `review.md` e marcar spec como concluída.
- [x] `npm run lint`
- [x] `npm run test -- --watch=false`
- [x] `npm run build`
