# Fluxo de trabalho por sessão

## Finalidade
Fornecer uma rotina leve para trabalhar em múltiplas sessões ou com diferentes agentes de IA sem perder contexto.

## Início da sessão
1. Ler `AGENTS.md`.
2. Ler `docs/ESTADO_ATUAL.md`.
3. Abrir a pasta da especificação ativa.
4. Identificar a primeira tarefa não concluída.
5. Inspecionar o código existente antes de editar.

## Durante a sessão
- Trabalhar em uma tarefa atômica por vez.
- Manter o `tasks.md` da spec ativa atualizado.
- Registrar mudanças relevantes de escopo ou arquitetura em `docs/DECISOES.md`.
- Não adicionar melhorias opcionais antes de concluir os critérios obrigatórios e sem solicitar confirmação para execucao da mesma.

## Final da sessão
Atualizar `docs/ESTADO_ATUAL.md` com:

```md
## Concluído
- ...

## Em andamento
- ...

## Próxima tarefa
- ...

## Problemas conhecidos
- ...
```

Depois, executar os quality gates disponíveis e registrar falhas honestamente.

## Template de prompt para novo agente

```text
Leia primeiro AGENTS.md e docs/ESTADO_ATUAL.md.
Depois leia integralmente a pasta da especificação ativa em docs/specs.
Trabalhe somente na primeira tarefa relevante ainda não concluída.
Respeite os limites de escopo e as decisões arquiteturais existentes.
Antes de finalizar, execute as validações aplicáveis, atualize tasks.md e atualize docs/ESTADO_ATUAL.md.
```
