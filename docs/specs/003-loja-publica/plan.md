# Plano — Spec 003 Loja pública

## Premissas

- Specs 002, 002.1 e 002.2 concluídas.
- `ProductStoreService` é singleton `providedIn: 'root'` com estado reconciliado.
- Design system em `_controls.scss` e tokens globais.

## Ordem de implementação

### 1. Fundação da loja
- `StoreLayout` em `core/layout/store-layout/`.
- `store.routes.ts` e registro em `app.routes.ts`.
- Habilitar **Visualizar loja** no `AdminLayout`.

### 2. Catálogo
- `CatalogStoreService` com filtros isolados do admin.
- `CatalogPage`, `StoreProductGrid`, `StoreFilters`.

### 3. Detalhes
- `ProductDetailsPage` em `/store/products/:id`.

### 4. Qualidade e docs
- Testes de store, catalog e details.
- ADR-022, `ESTADO_ATUAL`, `tasks.md`, `review.md`.

## Validação

```bash
npm run lint
npm run test -- --watch=false
npm run build
```
