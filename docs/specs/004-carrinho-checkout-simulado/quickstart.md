# Quickstart — Spec 004 Carrinho e checkout simulado

## Pré-requisitos

- Spec 003 concluída (loja pública operacional).
- Aplicação executando com `npm start`.

## Fluxo manual sugerido

1. Acesse `/store`.
2. Clique em **Comprar** em dois ou mais produtos.
3. Observe o badge no ícone do carrinho no header.
4. Abra `/store/cart` pelo ícone.
5. Ajuste quantidades e remova um item.
6. Clique em **Finalizar compra**.
7. Preencha nome, e-mail e endereço no checkout.
8. Confirme e valide a tela de sucesso.
9. Recarregue a página — carrinho deve permanecer vazio.
10. Adicione um item, recarregue e confirme persistência em `localStorage`.

## Arquivos principais

| Área | Caminho |
|---|---|
| Store | `src/app/features/store/cart/store/cart-store.service.ts` |
| Storage | `src/app/features/store/cart/store/cart-storage.adapter.ts` |
| Carrinho | `src/app/features/store/cart/pages/cart-page/` |
| Checkout | `src/app/features/store/checkout/pages/checkout-page/` |
| Sucesso | `src/app/features/store/checkout/pages/order-success-page/` |
| Header | `src/app/core/layout/store-layout/` |

## Validação automatizada

```bash
npm run lint
npm run test -- --watch=false
npm run build
```
