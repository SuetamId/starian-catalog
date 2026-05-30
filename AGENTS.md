# AGENTS.md

## Finalidade
Este arquivo é o ponto de entrada obrigatório para qualquer agente de IA ou pessoa desenvolvedora que trabalhe neste repositório.
Leia este documento antes de alterar código ou documentação.

## Objetivo do projeto
Construir um desafio técnico frontend de alta qualidade utilizando Angular 21 e a Fake Store API.
A aplicação será um painel administrativo enxuto para gestão de produtos, demonstrando um fluxo CRUD completo.

## Fonte de verdade
Antes de iniciar qualquer implementação, leia os documentos nesta ordem:

1. `docs/CONTEXTO_PROJETO.md`
2. `docs/ARQUITETURA.md`
3. `docs/SISTEMA_UI.md`
4. `docs/CONTRATO_API.md`
5. `docs/DECISOES.md`
6. `docs/ESTADO_ATUAL.md`
7. A pasta da especificação ativa em `docs/specs/`

A especificação aprovada é a fonte de verdade da implementação. Não expanda o escopo silenciosamente.

## Regras de trabalho
- Código interno, tipos, variáveis, nomes de arquivos e testes devem ser escritos em inglês.
- Textos apresentados na interface podem ser escritos em português.
- Utilize componentes standalone do Angular.
- Mantenha a lógica específica de produtos dentro de `features/products`.
- Mantenha componentes compartilhados genéricos e reutilizáveis.
- Prefira código simples e explícito a abstrações criadas para necessidades hipotéticas.
- Utilize Reactive Forms para criação e edição de produtos.
- Utilize RxJS para fluxos HTTP e Signals para estado de interface da feature.
- Utilize interceptors HTTP funcionais.
- Implemente intencionalmente estados de carregamento, vazio, sucesso e erro.
- Adicione ou atualize testes quando houver mudança relevante de comportamento.
- Execute lint, testes e build antes de marcar uma tarefa como concluída.
- Atualize `docs/ESTADO_ATUAL.md` ao final de cada sessão de trabalho.

## Limites de escopo
Não adicione os itens abaixo sem aprovação explícita em uma especificação:
- autenticação;
- carrinho de compras;
- checkout;
- backend próprio;
- NgRx;
- infraestrutura complexa de design system;
- repositories genéricos especulativos;
- SSR;
- dependências de terceiros desnecessárias.

## Encerramento de sessão
Antes de encerrar uma sessão:
1. Marque os itens concluídos no `tasks.md` da especificação ativa.
2. Atualize `docs/ESTADO_ATUAL.md`.
3. Registre novas decisões arquiteturais em `docs/DECISOES.md`.
4. Documente problemas conhecidos e a próxima tarefa atômica.

## Definição de concluído
Uma tarefa somente está concluída quando:
- a implementação respeita a especificação aprovada;
- os testes relevantes passam;
- o lint passa;
- o build de produção passa;
- a documentação reflete o estado real do projeto;
- códigos mortos e experimentos temporários foram removidos.
