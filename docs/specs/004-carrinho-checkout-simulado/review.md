# Review — Spec 004 Carrinho e checkout simulado

Data da revisão: 2026-05-31

## Status

**Concluída**

---

## Resumo

Fluxo de e-commerce demonstrativo na loja pública: carrinho local persistente, ícone com badge no header, páginas de carrinho/checkout/sucesso e correção de overflow no layout da loja.

---

## Entregas

### Carrinho

- `CartStoreService` com add/remove/quantidade, subtotal e total de itens
- `CartStorageAdapter` persistindo snapshot de itens em `localStorage`
- Hidratação com produtos reconciliados do admin (`hydrateFromCatalog`)

### UX de compra

- **Comprar** nos cards do catálogo
- **Adicionar ao carrinho** na página de detalhes
- Toast de confirmação via `ToastContainer` no `StoreLayout`
- Ícone de carrinho com badge sobreposto no header

### Fluxo completo

- `/store/cart` — revisão, quantidade (+/−), remoção e resumo
- `/store/checkout` — formulário reativo (nome, e-mail, endereço)
- `/store/order-success` — confirmação simulada e limpeza do carrinho

### Layout

- `StoreLayout` com `height: 100vh`, `overflow: hidden` e scroll no main

---

## Validação

| Check | Resultado |
|---|---|
| `npm run lint` | Passou |
| `npm run test -- --watch=false` | 186 testes passando |
| `npm run build` | Passou (budget warnings SCSS esperados) |
| Acessibilidade | `aria-label` dinâmico no ícone do carrinho; labels no checkout |

---

## Critérios de aceite

- [x] Produtos adicionados ao carrinho a partir do catálogo e detalhes
- [x] Ícone de carrinho com badge no header
- [x] Persistência em `localStorage`
- [x] Páginas de carrinho, checkout e sucesso operacionais
- [x] Overflow do catálogo corrigido
- [x] Lint, testes e build passando
- [x] Documentação atualizada

---

## Decisões

- **ADR-012** — carrinho local (confirmado na implementação)
- **ADR-023** — checkout simulado sem integração remota de carrinho

---

## Limitações conhecidas

- Fake Store API não persiste mutações administrativas
- Checkout não envia dados a servidor externo
- Carrinho não utiliza endpoints remotos `/carts`

---

## Observações finais

Decisão final: **Spec 004 concluída.**

Próximo passo opcional: polimento visual ou testes E2E do fluxo de compra.
