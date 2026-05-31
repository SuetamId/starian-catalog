# Revisão — Spec 002.1 Refinamento visual do painel administrativo

Data da revisão: 2026-05-31

## Status

**Concluída**

A spec foi encerrada após entrega visual inicial e evoluções incorporadas nas sessões seguintes (marketplace, toast, `ProductList`). O acabamento final de tokens e mixins passou para a Spec 002.2.

---

## Objetivo da spec

Refinar acabamento e identidade visual do painel administrativo sem alterar comportamento de negócio do CRUD entregue na Spec 002.

---

## Escopo entregue

- Logo definitivo (`starian-catalog-symbol.svg`) na sidebar com label `Catalog` e linha decorativa com gradiente
- Header da listagem com accent visual, subtítulo refinado e contador de produtos cadastrados (total da sessão)
- Listagem em **lista semântica** (`ProductList`) e **grid de cards** (`ProductCardList`), com alternância acessível
- Chips de categoria via partial `_category-chip.scss`
- `ConfirmDialog` com contraste, padding e borda melhorados
- Formulário com preview, placeholder via `ProductImage` e texto auxiliar de URL
- `ToastService` + `ToastContainer` para feedback de mutações (ADR-019)
- Sidebar fixa com scroll isolado no conteúdo principal (ADR-020)
- Baseline de `ProductImage` e fallback validados (ADR-016)

**Fora do escopo (respeitado):** loja pública, carrinho, checkout, novos menus, bibliotecas externas.

---

## Revisão dos critérios de aceite

### Identidade e layout

- [x] Logo definitivo aplicado na sidebar com fundo transparente.
- [x] Sidebar com `Starian`, label `Catalog`, detalhe decorativo e item ativo refinado.
- [x] Botão `Visualizar loja` permanece desabilitado.

### Listagem

- [x] Header com título, subtítulo, contador e CTA refinados.
- [x] Lista e cards com hierarquia, chips, ações e responsividade.
- [x] Alternância lista/cards preservada.

### Imagens

- [x] `ProductImage` integrado em lista, cards e preview.
- [x] Fallback local funcional sem loop.
- [x] `alt`, dimensões e `loading` preservados.

### Formulário e dialog

- [x] Preview destacado; placeholder visual consistente via SVG local.
- [x] Dialog refinado visualmente; comportamento inalterado.

### Qualidade

- [x] Responsividade revisada (375px, 768px, 1280px).
- [x] Acessibilidade mínima preservada.
- [x] Comportamento CRUD inalterado.
- [x] Quality gates passando na entrega e regressões corrigidas nas specs seguintes.

---

## Evoluções posteriores (incorporadas antes do encerramento)

- Remoção de `<table>` em favor de `ProductList` (ADR-018)
- Toast local para create/edit/delete
- Clique na linha/card abre edição (detalhe admin)
- Otimização de imagens na listagem (`deferUntilVisible`, `content-visibility`) — detalhada na Spec 002.2

---

## Quality gates (estado final do painel admin)

| Verificação | Resultado |
|---|---|
| Lint | Passou |
| Testes unitários | 169 testes, 18 arquivos |
| Build de produção | Passou |

---

## Decisões registradas

- **ADR-017** — logo e chip de categoria local
- **ADR-018** — visualização lista/cards
- **ADR-019** — toast local com Signals
- **ADR-020** — sidebar fixa com scroll isolado

---

## Limitações conhecidas

- Fake Store API continua sem persistência remota garantida.
- Botão “Visualizar loja” permanece desabilitado até Spec 003.

---

## Observações finais

Decisão final: **Spec 002.1 concluída.**

Próximo passo recomendado: **Spec 003 — Loja pública** (somente com aprovação explícita).
