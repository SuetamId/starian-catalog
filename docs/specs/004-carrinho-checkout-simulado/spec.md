# Spec 004 — Carrinho e checkout simulado

## Status

**Concluída** (2026-05-31).

## Objetivo

Completar a experiência de e-commerce demonstrativa da loja pública com carrinho local persistente, fluxo de compra simulado e checkout sem pagamento real.

## Escopo

- `CartStoreService` com Signals e persistência em `localStorage`.
- `CartStorageAdapter` encapsulando leitura/escrita do storage.
- Botão **Comprar** no grid do catálogo e **Adicionar ao carrinho** na página de detalhes.
- Ícone de carrinho com badge no header do `StoreLayout`.
- Toast de feedback ao adicionar produtos.
- Rotas lazy-loaded `/store/cart`, `/store/checkout` e `/store/order-success`.
- Página de carrinho com ajuste de quantidade, remoção e resumo.
- Checkout simulado com Reactive Forms tipado.
- Correção de overflow no layout da loja (`height: 100vh`, scroll isolado no main).

## Fora de escopo

- Integração real com `POST /carts` da Fake Store API.
- Pagamento, frete ou impostos reais.
- Autenticação de cliente.
- Drawer/modal de carrinho (navegação dedicada para `/store/cart`).
- Bibliotecas externas de UI ou ícones.

## Critérios de aceite

- [x] Produtos podem ser adicionados ao carrinho a partir do catálogo e dos detalhes.
- [x] Header exibe ícone de carrinho com badge de quantidade.
- [x] Carrinho persiste em `localStorage` e sobrevive ao refresh.
- [x] `/store/cart` permite revisar itens, alterar quantidades e remover produtos.
- [x] `/store/checkout` valida formulário e redireciona para sucesso.
- [x] `/store/order-success` confirma pedido simulado e esvazia o carrinho.
- [x] Layout da loja rola corretamente com catálogo extenso.
- [x] Lint, testes e build passando.
- [x] Documentação atualizada.
