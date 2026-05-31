# Plano — Spec 005 Consolidação de componentes compartilhados do catálogo

## Objetivo

Eliminar duplicações admin/loja criando a camada `features/catalog/` (models + components dumb de domínio), extraindo apenas `FilteredEmptyState` para `shared/ui`, e mantendo wrappers contextuais em admin e store.

## Fases executadas

### Phase 0 — Models

- `features/catalog/models/product.model.ts`
- Migração de imports; remoção de `admin/products/models/`

### Phase 1 — Componentes

1. `ProductFilters` unificado em `features/catalog/components/product-filters/`
2. `ProductImage` movido de `shared/ui` para `features/catalog/components/product-image/`
3. `CategoryChip` em `features/catalog/components/category-chip/`
4. `FilteredEmptyState` em `shared/ui/filtered-empty-state/`
5. `ProductCard` presentational em `features/catalog/components/product-card/`
6. Wrappers: `product-card-grid` (admin), `store-product-grid` (`features/store/components/`)

### Phase 2 — Util

- `features/catalog/utils/filter-products.ts` usado em `ProductStoreService` e `CatalogStoreService`

### Phase 3 — Documentação e QA

- ADR-024, `ARQUITETURA.md`, `tasks.md`, `review.md`, `ESTADO_ATUAL.md`
- lint / test / build verdes

## Regra arquitetural

`shared/ui` nunca importa `ApiProduct`. Componentes em `features/catalog/components` são dumb (sem store, sem rotas, sem services).

## Status

**Concluído** — 2026-05-31
