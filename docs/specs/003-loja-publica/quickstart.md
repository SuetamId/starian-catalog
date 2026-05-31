# Início rápido — Spec 003 Loja pública

## Antes de começar

Leia `AGENTS.md`, `docs/ESTADO_ATUAL.md`, `docs/ARQUITETURA.md`, `docs/CONTRATO_API.md` (§7.2) e esta spec.

## Objetivo

Implementar P1 da loja pública (`/store`, `/store/products/:id`) com o mesmo design system do admin.

## Estado compartilhado

- Produtos vêm de `ProductStoreService` (singleton).
- Filtros do catálogo ficam em `CatalogStoreService` — não reutilizar `searchTerm`/`selectedCategory` do admin.

## Validação manual

1. Abrir `/admin/products` e carregar produtos.
2. Criar ou editar um produto.
3. Clicar **Visualizar loja** → `/store`.
4. Confirmar grid, busca, filtro e detalhe.
5. Excluir produto no admin e confirmar remoção na loja (mesma sessão).

## Quality gates

```bash
npm run lint
npm run test -- --watch=false
npm run build
```
