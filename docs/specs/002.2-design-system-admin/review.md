# Review — Spec 002.2 Design system visual do painel admin

Data da revisão: 2026-05-31

## Status

**Concluída**

---

## Resumo

Elevação visual do painel administrativo CRUD para estética premium minimalista (Vercel/Linear) com padronização via mixins SCSS em `_controls.scss`, sem alteração de comportamento de negócio. Inclui refinamentos de UX e performance aplicados na mesma linha de entrega.

---

## Entregas

### Design system (ADR-021)

- Tokens refinados: bordas finas, radius compacto, tipografia, densidade de controles, sombras discretas
- Mixins em `_controls.scss`: botões, inputs, segmented control, page header, `interactive-row`, motion
- Layout admin flat; listagem, filtros, formulário, create/edit e shared UI padronizados
- Microinterações com `prefers-reduced-motion`

### UX da listagem

- Cards com **altura fixa uniforme** (25rem; imagem 10.5rem)
- **Linha e card clicáveis** (`Ver detalhes de …`) navegando para `/admin/products/:id/edit`
- Botões Editar/Excluir mantidos como ações explícitas

### Performance de imagens

- `ProductImage`: `deferUntilVisible` com `IntersectionObserver` na listagem
- `decoding="async"`, `fetchPriority="low"`, placeholder leve até intersectar
- `content-visibility: auto` em linhas e cards

---

## Validação

| Check | Resultado |
|---|---|
| `npm run lint` | Passou |
| `npm run test -- --watch=false` | 169 testes passando |
| `npm run build` | Passou (budget warnings SCSS esperados) |
| Acessibilidade | Foco visível, links com `aria-label`, contraste preservado |

---

## Decisões

- **ADR-021** — design system administrativo via mixins SCSS

---

## Limitações conhecidas

- Budget warnings de tamanho de SCSS em components que incluem mixins expandidos
- Fake Store API não persiste mutações
- URLs externas da Fake Store não possuem thumbnails dedicados; otimização limitada ao defer/lazy e dimensões de exibição

---

## Observações finais

Decisão final: **Spec 002.2 concluída.**

Próximo passo recomendado: **Spec 003 — loja pública** (somente com aprovação explícita).
