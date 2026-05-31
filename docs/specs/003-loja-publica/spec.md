# Spec 003 — Loja pública

## Status

**Concluída** (2026-05-31).

## Objetivo

Disponibilizar a loja pública de demonstração do catálogo Starian, reutilizando o estado reconciliado da sessão administrativa e aplicando o mesmo design system visual do painel (Spec 002.2).

## Escopo P1

- Rotas lazy-loaded `/store` e `/store/products/:id`.
- Layout público (`StoreLayout`) com identidade Starian e link de retorno ao admin.
- Catálogo em grid responsivo com busca e filtro por categoria.
- Página de detalhes do produto.
- Reutilizar `ProductStoreService` como fonte de produtos reconciliados.
- Filtros de catálogo isolados do painel admin (`CatalogStoreService`).
- Habilitar botão **Visualizar loja** no painel administrativo.
- Reutilizar `ProductImage`, estados compartilhados (`loading`, `empty`, `error`) e mixins SCSS globais.

## Fora de escopo

- Carrinho e checkout (Spec 004).
- Autenticação.
- Paginação e ordenação.
- Bibliotecas externas de UI.

## Critérios de aceite

- [x] `/store` exibe grid de produtos com busca e filtro.
- [x] `/store/products/:id` exibe detalhes do produto.
- [x] Produtos criados/editados/excluídos no admin refletem na loja na mesma sessão.
- [x] Visual alinhado ao design system (`_controls.scss`, tokens globais).
- [x] Botão **Visualizar loja** navega para `/store`.
- [x] Lint, testes e build passando.
- [x] Documentação atualizada.
