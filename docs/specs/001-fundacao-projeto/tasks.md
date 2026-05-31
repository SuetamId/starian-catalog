# Tarefas — Spec 001 Fundação do projeto

## Inicialização
- [x] Inicializar projeto standalone em Angular 21.
- [x] Confirmar versões de pacotes e scripts.
- [x] Configurar lint caso não esteja incluído no setup escolhido do CLI.
- [x] Selecionar abordagem de UI (decisão: sem biblioteca externa).

## Estrutura
- [x] Criar `core/config`.
- [x] Criar `core/http`.
- [x] Criar `core/layout/admin-layout` (shell administrativo mínimo).
- [ ] Criar `shared/ui` (somente quando necessário).
- [x] Criar `features/admin/products`.
- [x] Adicionar página placeholder de produtos administrativos.
- [x] Adicionar rotas lazy-loaded de `features/admin/products`.
- [x] Configurar rotas raiz (`/` → `/admin/products`) e wildcard.

## HTTP
- [x] Adicionar configuração centralizada da API.
- [x] Adicionar modelo de erro HTTP normalizado.
- [x] Adicionar interceptor funcional de erros.
- [x] Registrar `provideHttpClient()` e interceptor.

## Qualidade
- [x] Adicionar teste smoke de roteamento ou shell.
- [x] Executar lint com sucesso.
- [x] Executar testes unitários com sucesso.
- [x] Executar build de produção com sucesso.
- [ ] Atualizar comandos do README (adiado).
- [x] Preencher `review.md`.
- [x] Atualizar `docs/ESTADO_ATUAL.md`.
