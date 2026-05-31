# Review — Spec 005 Shared UI do catálogo

## Status

**Concluída** — 2026-05-31

---

## Resumo

Consolidação de duplicações entre painel administrativo e loja pública, respeitando a fronteira entre UI genérica (`shared/ui`) e UI de domínio (`features/catalog/components`). Comportamento de negócio preservado; rotas e ações permanecem nos wrappers contextuais.

---

## Entregas

### Models e utils

- [x] `features/catalog/models/product.model.ts`
- [x] `features/catalog/utils/filter-products.ts`

### Componentes de domínio

- [x] `features/catalog/components/product-filters`
- [x] `features/catalog/components/product-image` (movido de `shared/ui`)
- [x] `features/catalog/components/category-chip`
- [x] `features/catalog/components/product-card`

### UI genérica

- [x] `shared/ui/filtered-empty-state`

### Wrappers contextuais

- [x] `features/admin/products/components/product-card-grid`
- [x] `features/store/components/store-product-grid`

### Remoções

- [x] `admin/products/components/product-filters/`
- [x] `store/catalog/ui/store-filters/`
- [x] `admin/products/components/product-card-list/`
- [x] `store/catalog/ui/store-product-grid/` (local antigo)
- [x] `admin/products/components/_category-chip.scss`
- [x] `shared/ui/product-image/` (local antigo)

---

## Validação

| Check | Resultado | Observações |
|---|---|---|
| Lint | Passou | `npm run lint` |
| Testes | Passou | 202 testes |
| Build | Passou | Budget warnings SCSS pré-existentes |
| Regressão visual admin | Manual pendente | Smoke recomendado em `/admin/products` |
| Regressão visual loja | Manual pendente | Smoke recomendado em `/store` |

---

## Critérios de aceite

Conforme `spec.md` §10 — atendidos na implementação P1 + P2.

---

## Observações finais

- `ProductCard` é presentational puro; links e ações ficam nos wrappers.
- `ProductFilters` aceita `searchPlaceholder` e `fieldIdPrefix` para diferenciar admin e loja.
- ADR-024 documenta a consolidação do domínio compartilhado em `features/catalog`; ADR-025 documenta a separação entre `shared/ui` e `features/catalog/components`.
