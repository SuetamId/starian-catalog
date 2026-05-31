# Plano — Spec 001 Fundação do projeto

## Sequência de implementação

### Fase 1 — Inicialização
- Criar projeto Angular 21 com Angular CLI.
- Confirmar estrutura standalone.
- Confirmar test runner e abordagem de lint.
- Instalar somente dependências de UI aprovadas.

### Fase 2 — Estrutura
- Criar fronteiras `core`, `shared/ui` (quando necessário) e `features/admin/products`.
- Criar shell mínimo e página placeholder de produtos administrativos.
- Adicionar rotas lazy-loaded de `features/admin` com redirect `/` → `/admin/products`.

### Fase 3 — Fundação HTTP
- Configurar `provideHttpClient()`.
- Criar modelo `NormalizedHttpError`.
- Criar interceptor funcional de erros.

### Fase 4 — Quality gates
- Adicionar ou atualizar testes básicos de shell e roteamento.
- Executar lint.
- Executar testes.
- Executar build de produção.
- Atualizar README e estado atual.

## Comandos de validação
Confirmar scripts exatos após a inicialização do projeto. Formato esperado:

```bash
npm run lint
npm test -- --watch=false
npm run build
```

## Riscos
- Defaults do Angular CLI podem alterar nomes de scripts; documentar comandos reais após inicialização.
- Configuração extensa de biblioteca de UI pode consumir tempo; preferir configuração mínima.
- Não implementar telas de produtos prematuramente durante a fundação.
