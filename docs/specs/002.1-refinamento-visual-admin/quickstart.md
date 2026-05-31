# Início rápido — Spec 002.1 Refinamento visual do painel administrativo

## Antes de começar

1. Confirmar que a Spec 002 está concluída (`docs/specs/002-crud-produtos/review.md`).
2. Ler `AGENTS.md`.
3. Ler `docs/ESTADO_ATUAL.md`.
4. Ler `docs/STYLES.md` e `docs/SISTEMA_UI.md`.
5. Ler integralmente esta pasta de especificação (`spec.md`, `plan.md`, `tasks.md`).

## Ordem de leitura recomendada

```text
AGENTS.md
docs/ESTADO_ATUAL.md
docs/specs/002-crud-produtos/review.md
docs/specs/002.1-refinamento-visual-admin/spec.md
docs/specs/002.1-refinamento-visual-admin/plan.md
docs/specs/002.1-refinamento-visual-admin/tasks.md
```

## Regra de implementação

- Implementar **somente** refinamento visual do painel administrativo.
- **Não alterar** regras de negócio, store, serviços HTTP ou validações sem necessidade comprovada.
- **Não criar** `features/store/*`, carrinho, checkout ou autenticação.
- **Não instalar** bibliotecas externas (Material, CDK, toast/snackbar).
- **Não criar** pastas vazias ou abstrações genéricas sem uso concreto.
- Trabalhar na ordem definida em `plan.md`.
- Marcar uma tarefa por vez em `tasks.md`.

## Baseline existente (Spec 002)

Antes de reimplementar, verificar o que já pode existir:

- `ProductImage` e `product-placeholder.svg` (ADR-016);
- ajustes responsivos mínimos em `AdminLayout`;
- `ConfirmDialog` funcional (ADR-015).

Nesses casos, focar em **acabamento visual** e validação, não duplicação.

## Rotas para validação manual

| Rota | O que validar |
|---|---|
| `/admin/products` | Sidebar, header, contador, tabela/cards, chips, imagens, filtros |
| `/admin/products/new` | Formulário, preview, placeholder, responsividade |
| `/admin/products/:id/edit` | Mesmo formulário em modo edição; preview com imagem real |

Breakpoints obrigatórios: **375px**, **768px**, **1280px**.

## Comandos

```bash
npm install
npm start
```

Validação completa ao final:

```bash
npm run lint
npm run test -- --watch=false
npm run build
```

## Limites de escopo (checklist rápido)

Antes de encerrar cada sessão, confirmar:

- [ ] Nenhuma rota `/store` foi criada.
- [ ] Nenhuma dependência externa de UI foi adicionada.
- [ ] CRUD (criar, editar, excluir, buscar, filtrar) funciona como antes.
- [ ] Botão `Visualizar loja` permanece desabilitado.
- [ ] Apenas arquivos previstos em `spec.md` foram alterados.
- [ ] `docs/ESTADO_ATUAL.md` reflete o progresso real.

## Checklist rápido de entrega

- [ ] Logo definitivo na sidebar.
- [ ] Header com contador de produtos.
- [ ] Chips de categoria na tabela e nos cards.
- [ ] `ProductImage` com fallback local.
- [ ] Dialog e formulário visualmente refinados.
- [ ] Responsividade e acessibilidade revisadas.
- [ ] Quality gates passando.
- [ ] `review.md` preenchido.

## Próximo passo após conclusão

Avaliar início da **Spec 003 — Loja pública** somente após esta spec marcada como concluída. Não iniciar Spec 003 na mesma sessão desta implementação.
