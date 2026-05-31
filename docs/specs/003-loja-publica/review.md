# Review — Spec 003 Loja pública

Data da revisão: 2026-05-31

## Status

**Concluída**

---

## Resumo

Loja pública de demonstração com catálogo em grid, filtros isolados e página de detalhes, reutilizando o estado reconciliado do admin (`ProductStoreService`) e o design system visual da Spec 002.2.

---

## Entregas

### Fundação

- `StoreLayout` com header Starian, link para o painel admin e outlet principal
- Rotas lazy-loaded `/store` e `/store/products/:id`
- Botão **Visualizar loja** habilitado no admin

### Catálogo

- `CatalogStoreService` com busca e filtro por categoria independentes do painel
- `CatalogPage` com estados loading, empty, error e grid responsivo
- `StoreProductGrid` e `StoreFilters` com mixins de `_controls.scss`
- Cards com altura uniforme (25rem) e `ProductImage` com `deferUntilVisible`

### Detalhes

- `ProductDetailsPage` resolve produto via store reconciliada
- Estados de loading, erro e produto inexistente

---

## Validação

| Check | Resultado |
|---|---|
| `npm run lint` | Passou |
| `npm run test -- --watch=false` | 177 testes passando |
| `npm run build` | Passou (budget warnings SCSS esperados) |
| Acessibilidade | Foco visível, links semânticos, contraste preservado |

---

## Critérios de aceite

- [x] `/store` exibe grid de produtos com busca e filtro
- [x] `/store/products/:id` exibe detalhes do produto
- [x] Produtos criados/editados/excluídos no admin refletem na loja na mesma sessão
- [x] Visual alinhado ao design system (`_controls.scss`, tokens globais)
- [x] Botão **Visualizar loja** navega para `/store`
- [x] Lint, testes e build passando
- [x] Documentação atualizada

---

## Decisões

- **ADR-022** — loja pública com `CatalogStoreService` e reuso de `ProductStoreService`

---

## Limitações conhecidas

- Fake Store API não persiste mutações; reload restaura dados originais
- Carrinho e checkout permanecem na Spec 004
- `EmptyState`/`LoadingState` compartilhados usam textos padrão (sem mensagens customizadas)
- Budget warnings de SCSS em components com mixins expandidos

---

## Observações finais

Decisão final: **Spec 003 concluída.**

Próximo passo recomendado: **Spec 004 — carrinho e checkout simulado** (somente com aprovação explícita).
