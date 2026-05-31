# Quickstart — Spec 005 Shared UI do catálogo

## Objetivo desta spec

Documentar e implementar a consolidação de UI duplicada entre admin e loja **sem** unificar pages ou stores.

## Antes de codar

1. Ler `spec.md` — mapeamento completo do que vai e do que fica.
2. Ler `plan.md` — ordem: filtros → chip/empty → grid → utils.
3. Confirmar que nenhum arquivo em `shared/ui` importará `features/*`.

## Referências no código atual

| Duplicado | Caminhos |
|---|---|
| Filtros | `features/admin/products/components/product-filters/` · `features/store/catalog/ui/store-filters/` |
| Grid cards | `features/admin/products/components/product-card-list/` · `features/store/catalog/ui/store-product-grid/` |
| Empty filtrado | `products-list-page.html` · `catalog-page.html` |
| Chip | `features/admin/products/components/_category-chip.scss` · estilos inline na loja |

## Primeira task atômica

Implementar **`shared/ui/product-filters`** e migrar as duas pages — menor risco, validação rápida do padrão.

## Validação após cada fase

```bash
npm run lint
npm run test -- --watch=false
npm run build
```

Smoke manual:

- `/admin/products` — busca, categoria, limpar, lista e cards.
- `/store` — mesmos filtros e grid com Comprar.
