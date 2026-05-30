---
name: angular-sdd-feature
description: Implementar ou revisar uma feature Angular seguindo Specification-Driven Development, arquitetura moderna, quality gate e memória entre sessões.
---

# Angular SDD Feature Workflow

## Quando utilizar esta skill

Utilizar esta skill quando a solicitação envolver:

- implementar uma feature Angular;
- continuar uma feature iniciada anteriormente;
- revisar uma implementação Angular;
- corrigir uma feature;
- executar tasks de uma spec;
- validar se uma feature atende aos critérios de aceite;
- preparar handoff para outra sessão ou agente.

Não utilizar para responder dúvidas conceituais simples.

---

## Objetivo

Implementar somente o necessário para atender à spec ativa, preservando:

- escopo controlado;
- arquitetura moderna;
- rastreabilidade;
- qualidade;
- testes;
- memória entre sessões;
- facilidade de revisão.

---

## Etapa 1 — Recuperar contexto

Antes de editar código:

1. Ler `AGENTS.md`.
2. Ler `docs/ESTADO_ATUAL.md`.
3. Identificar a spec ativa.
4. Ler integralmente:
   - `spec.md`;
   - `plan.md`;
   - `tasks.md`;
   - `quickstart.md`;
   - `review.md`.
5. Ler `docs/ARQUITETURA.md`.
6. Ler `docs/DECISOES.md`.
7. Ler `docs/CONTRATO_API.md` quando houver integração HTTP.
8. Identificar a primeira task ainda não concluída.
9. Não implementar tasks posteriores sem solicitação explícita.

---

## Etapa 2 — Consultar contexto Angular atualizado

Utilizar o MCP oficial do Angular antes de tomar decisões sobre APIs, padrões modernos ou geração de código.

Quando aplicável:

1. Executar `get_best_practices`.
2. Executar `list_projects`.
3. Utilizar `search_documentation` para confirmar APIs.
4. Utilizar `find_examples` quando houver dúvida de implementação.
5. Não confiar apenas em memória interna quando o Angular MCP puder confirmar o padrão atual.

Não habilitar ferramentas experimentais nem adotar APIs experimentais sem justificativa registrada.

---

## Etapa 3 — Planejar a menor implementação útil

Antes de alterar arquivos:

1. Resumir a task ativa.
2. Identificar arquivos que serão criados ou modificados.
3. Confirmar dependências existentes.
4. Procurar componentes reutilizáveis já presentes.
5. Identificar riscos.
6. Evitar abstrações antecipadas.
7. Definir testes necessários.

Não gerar dezenas de arquivos automaticamente.

Não criar camadas que ainda não resolvem um problema concreto.

---

## Etapa 4 — Implementar

Durante a implementação:

- seguir `.cursor/rules/00-angular-oficial.mdc`;
- seguir `.cursor/rules/10-arquitetura-projeto.mdc`;
- manter components pequenos;
- separar page, UI, store e integração HTTP;
- manter estado com Signals;
- utilizar `computed()` para valores derivados;
- utilizar Reactive Forms tipados;
- utilizar interceptor funcional para erros;
- manter URLs centralizadas;
- preservar acessibilidade;
- evitar código morto;
- evitar duplicação;
- não adicionar features fora da spec.

---

## Etapa 5 — Testar

Executar testes relacionados à task.

Para integração HTTP, validar:

- verbo;
- URL;
- payload;
- resposta;
- erro.

Para estado, validar:

- loading;
- sucesso;
- erro;
- reconciliação local;
- preservação do estado anterior em falha.

Para forms, validar:

- campos obrigatórios;
- validações;
- submissão inválida;
- submissão válida;
- preservação de dados após falha.

Para UI, validar:

- loading state;
- empty state;
- error state;
- navegação por teclado;
- labels;
- mensagens acessíveis.

---

## Etapa 6 — Executar quality gate

Ler e cumprir:

```text
.cursor/rules/20-quality-gate.mdc
```

Executar os comandos disponíveis:

```bash
npm run lint
npm run test
npm run build
```

Não ocultar falhas.

Não informar sucesso sem evidência.

---

## Etapa 7 — Atualizar memória

Antes de encerrar a sessão:

1. Marcar a task concluída em `tasks.md`.
2. Atualizar `docs/ESTADO_ATUAL.md`.
3. Registrar:
   - concluído;
   - em andamento;
   - próxima tarefa;
   - limitações;
   - falhas conhecidas;
   - testes executados.
4. Atualizar `docs/DECISOES.md` somente quando houver nova decisão arquitetural relevante.
5. Não registrar detalhes temporários irrelevantes.

---

## Formato obrigatório do resumo final

Ao concluir uma task, responder com:

```md
## Entregue
- ...

## Arquivos alterados
- ...

## Validações executadas
- ...

## Limitações ou pendências
- ...

## Próxima tarefa recomendada
- ...
```