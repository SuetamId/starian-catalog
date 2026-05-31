# Tarefas — Spec 005 Shared UI do catálogo

## Fase 0 — Models

- [x] Criar `features/catalog/models/product.model.ts`.
- [x] Migrar imports e remover `admin/products/models/`.

## Fase 1 — Componentes de domínio

- [x] Criar `features/catalog/components/product-filters`.
- [x] Migrar `products-list-page` e `catalog-page`.
- [x] Remover `ProductFilters` e `StoreFilters` duplicados.
- [x] Mover `ProductImage` para `features/catalog/components/product-image`.
- [x] Criar `features/catalog/components/category-chip`.
- [x] Criar `shared/ui/filtered-empty-state`.
- [x] Substituir usos em admin e store.
- [x] Remover `_category-chip.scss` obsoleto.
- [x] Criar `features/catalog/components/product-card`.
- [x] Refatorar `product-card-grid` (admin).
- [x] Mover/refatorar `store-product-grid` (`features/store/components`).
- [x] Preservar testes de ações (delete / comprar).

## Fase 2 — Utilitário (P2)

- [x] Criar `features/catalog/utils/filter-products.ts`.
- [x] Usar nos stores admin e catalog.

## Qualidade

- [x] ADR-024.
- [x] Atualizar `docs/ARQUITETURA.md`.
- [x] Preencher `review.md`.
- [x] Atualizar `docs/ESTADO_ATUAL.md`.
- [x] `npm run lint`
- [x] `npm run test -- --watch=false`
- [x] `npm run build`
