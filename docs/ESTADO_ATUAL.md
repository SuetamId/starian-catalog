# Estado atual

Última atualização: CI GitHub Actions (2026-05-31)

## Concluído
- Spec 001 — fundação concluída.
- Spec 002 — CRUD administrativo de produtos concluída.
- Spec 002.1 — refinamento visual Starian e marketplace concluída.
- Spec 002.2 — design system visual do painel admin concluída (ADR-021).
- Spec 003 — loja pública concluída (ADR-022).
- Spec 004 — carrinho e checkout simulado concluída (ADR-023).
- Spec 005 — consolidação de componentes compartilhados do catálogo concluída (ADR-025).
- **Renomeação estrutural `features/products` → `features/catalog`:**
  - diretório movido sem alteração de conteúdo;
  - imports TypeScript e testes atualizados;
  - documentação e rules alinhadas;
  - comportamento funcional preservado;
  - **202 testes unitários** passando; lint e build passando;
  - ADR-024 registrada.
- **CI GitHub Actions** (`.github/workflows/ci.yml`):
  - dispara em push/PR para `main` e `master`;
  - job `quality`: `npm ci` → `audit:ci` → `lint` → `test --watch=false` → `build`;
  - job `docker`: `docker compose build`, após `quality`;
  - Node 22, cache de dependências npm e cache GHA para layers Docker;
  - validado localmente: **211 testes** passando; lint e build passando.

## Decisões confirmadas
- **Reactive Forms tipados** para CRUD e checkout simulado.
- **Reconciliar mutações no estado local após sucesso HTTP** (ADR-008).
- **Carrinho local com Signals e localStorage** (ADR-012).
- **Design system via mixins SCSS** (ADR-021).
- **Loja pública com filtros isolados** (ADR-022).
- **Checkout simulado sem POST /carts** (ADR-023).
- **Domínio compartilhado em `features/catalog`** (ADR-024).
- **UI genérica em `shared/ui`; UI de domínio em `features/catalog/components`** (ADR-025).

## Em andamento
- Nenhuma tarefa ativa.

## Próxima tarefa
Nenhuma spec pendente no backlog atual. Aguardar nova especificação aprovada.

## Problemas conhecidos
- Fake Store API não persiste mutações no servidor; **refresh do navegador** restaura dados originais.
- Listagem administrativa não refaz `GET /products` ao navegar de volta após criar/editar/excluir (ADR-008); mutações permanecem visíveis até refresh manual.
- Budget warnings de SCSS em components com mixins expandidos — aceitável nesta etapa.
- `features/catalog/services` e `features/catalog/store` ainda não existem; HTTP e estado permanecem em `features/admin/products` por design.

## Notas para handoff
- Autenticação permanece fora do escopo.
- Revisão em `docs/specs/005-shared-ui-catalogo/review.md`.
- Storage key do carrinho: `starian-store-cart`.
