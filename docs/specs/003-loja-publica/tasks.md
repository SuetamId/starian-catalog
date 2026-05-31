# Tarefas — Spec 003 Loja pública

## Fundação

- [x] Criar `StoreLayout` (header, main, identidade Starian).
- [x] Criar `features/store/store.routes.ts`.
- [x] Registrar rota `/store` em `app.routes.ts`.
- [x] Habilitar botão **Visualizar loja** no admin.

## Catálogo

- [x] Criar `CatalogStoreService` com filtros isolados.
- [x] Criar `CatalogPage` com estados loading/empty/error.
- [x] Criar `StoreProductGrid` e `StoreFilters`.

## Detalhes

- [x] Criar `ProductDetailsPage` com resolução via store.

## Qualidade

- [x] Testes unitários relevantes.
- [x] ADR-022.
- [x] Atualizar `ESTADO_ATUAL.md`, `README.md`, `review.md`.
- [x] `npm run lint`
- [x] `npm run test -- --watch=false`
- [x] `npm run build`
