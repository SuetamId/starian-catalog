# Plano — Spec 002.2 Design system visual do painel admin

## Premissas

- Spec 002.1 concluída; CRUD funcional intacto.
- Implementação **somente visual** via SCSS e HTML mínimo.
- Mixins SCSS em `_controls.scss`; sem componente Angular `Button`.
- Respeitar ADR-013 (sem biblioteca externa).

## Ordem de implementação

### 1. Tokens e controles

- Atualizar `_variables.scss` e `_theme.scss`.
- Criar `_controls.scss`; forward em `_index.scss`.
- Refatorar `surface-card` para delegar a `surface-panel`.

### 2. Layout admin

- Nav flat, transições discretas, marca refinada.

### 3. Listagem

- `products-list-page`, `product-list`, `product-card-list`, `product-filters`, `_category-chip`.

### 4. Formulário e páginas

- `product-form`, `product-create-page`, `product-edit-page`.

### 5. Shared UI

- `confirm-dialog`, `toast`, `empty-state`, `error-state`, `loading-state`.

### 6. Quality gate e docs

- Lint, test, build.
- ADR-021, `ESTADO_ATUAL`, `SISTEMA_UI`, `tasks.md`, `review.md`.

## Riscos

- Testes que assertam classes CSS — revisar se renomeadas.
- Regressão visual mobile — validar 375px / 768px / 1280px manualmente.

## Validação

```bash
npm run lint
npm run test -- --watch=false
npm run build
```
