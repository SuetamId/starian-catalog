# Plano — Spec 004 Carrinho e checkout simulado

## Sequência de implementação

### Fase 1 — Store de carrinho
- Modelos `StoreCartItem` e `StoreCartState`.
- `CartStorageAdapter` com chave `starian-store-cart`.
- `CartStoreService` com `computed()` para totais e `effect()` para persistência.

### Fase 2 — UX de compra
- Botão **Comprar** no `StoreProductGrid`.
- **Adicionar ao carrinho** na `ProductDetailsPage`.
- Toast via `ToastService` e `ToastContainer` no `StoreLayout`.
- Ícone de carrinho com badge no header.

### Fase 3 — Páginas do fluxo
- `CartPage` com lista, quantidade e resumo.
- `CheckoutPage` com formulário reativo.
- `OrderSuccessPage` após confirmação simulada.
- Rotas em `store.routes.ts`.

### Fase 4 — Layout e qualidade
- Overflow corrigido no `StoreLayout`.
- Testes de store, storage, grid e rotas.
- Lint, build e documentação.

## Comandos de validação

```bash
npm run lint
npm run test -- --watch=false
npm run build
```

## Riscos

- Produtos removidos no admin permanecem no storage até hidratação — mitigado por `hydrateFromCatalog()`.
- Budget de SCSS em páginas com muitos mixins — mitigado com estilos enxutos onde necessário.
