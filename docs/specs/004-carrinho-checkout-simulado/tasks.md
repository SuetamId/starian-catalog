# Tarefas — Spec 004 Carrinho e checkout simulado

## Carrinho

- [x] Criar modelos e `CartStorageAdapter`.
- [x] Criar `CartStoreService` com Signals e persistência.
- [x] Hidratar carrinho com catálogo reconciliado.

## Compra

- [x] Botão **Comprar** no grid do catálogo.
- [x] Botão **Adicionar ao carrinho** nos detalhes.
- [x] Toast de feedback ao adicionar.
- [x] Ícone de carrinho com badge no `StoreLayout`.

## Fluxo

- [x] Criar `CartPage`.
- [x] Criar `CheckoutPage` com Reactive Forms.
- [x] Criar `OrderSuccessPage`.
- [x] Registrar rotas `/store/cart`, `/store/checkout`, `/store/order-success`.

## Layout

- [x] Corrigir overflow scroll no `StoreLayout`.

## Qualidade

- [x] Testes unitários relevantes.
- [x] ADR-023.
- [x] Atualizar `ESTADO_ATUAL.md`, `README.md`, `review.md`.
- [x] `npm run lint`
- [x] `npm run test -- --watch=false`
- [x] `npm run build`
