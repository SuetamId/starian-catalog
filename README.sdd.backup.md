# Angular Products Admin

Painel administrativo enxuto para gestão de produtos, desenvolvido como desafio técnico frontend com Angular 21 e integração com a Fake Store API.

## Objetivo
O projeto demonstra um fluxo CRUD completo de produtos com foco em qualidade de código, manutenibilidade, gerenciamento de estados assíncronos, formulários reativos, tratamento de erros, testes e documentação técnica.

A implementação prioriza um fluxo central bem acabado e testado em vez de uma grande quantidade de telas.

## Funcionalidades planejadas
- Listagem de produtos
- Busca por título
- Filtro por categoria
- Criação de produto
- Edição de produto
- Exclusão com confirmação
- Estados de carregamento skeleton, vazio e erro
- Layout responsivo
- Testes unitários para comportamentos criticos, funções que fazem o controle de estado local, e stream de dados como RXJS.

## Documentação
Comece por [`AGENTS.md`](./AGENTS.md) e depois leia os documentos em [`docs/`](./docs/).

## Limitação da API
A Fake Store API é destinada a prototipação. Os endpoints de mutação serão utilizados para demonstrar integração real, mas o estado da interface será atualizado localmente após respostas bem-sucedidas para que a sessão atual reflita operações de criação, edição e exclusão.

## Comandos
Os comandos definitivos serão confirmados após a inicialização do projeto.

```bash
npm install
npm start
npm test
npm run lint
npm run build
```

## Status
Fase de planejamento orientado por documentação. A implementação ainda não foi iniciada.
