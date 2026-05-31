# Starian Catalog

Painel administrativo enxuto para gestão de produtos, desenvolvido como desafio técnico frontend com Angular 21 e integração com a Fake Store API.

## Visão geral

A aplicação demonstra um fluxo CRUD completo de produtos e uma loja pública de demonstração, com foco em qualidade de código, estados assíncronos, formulários reativos, tratamento de erros, testes e documentação técnica.

## Funcionalidades

- Listagem de produtos com lista semântica e alternância para cards
- Busca por título e filtro por categoria (admin e loja)
- Criação, edição e exclusão com confirmação
- Reconciliação local após mutações bem-sucedidas
- Loja pública com catálogo, detalhes, carrinho e checkout simulado
- Carrinho persistente com ícone e badge no header da loja
- Estados de carregamento, erro, vazio e vazio filtrado
- Fallback local para imagens quebradas e carregamento diferido na listagem
- Identidade visual Starian (logo, sidebar fixa, chips, preview, toast de feedback)
- Dialog nativo de confirmação acessível

## Stack

- Angular 21
- TypeScript strict
- Componentes standalone
- Change detection OnPush (aplicação sem polyfill de zone.js)
- Signals e RxJS
- Reactive Forms
- SCSS com tokens globais
- Vitest
- ESLint
- Sem biblioteca externa de UI

## Arquitetura

Organização por feature em `src/app/`:

- `core/`: configuração, HTTP, layouts administrativo e loja
- `features/admin/products/` : CRUD, store, páginas e componentes da feature
- `features/store/`: catálogo, detalhes, carrinho e checkout
- `shared/ui/`: componentes genéricos reutilizáveis

Documentação detalhada em `[docs/](./docs/)`. Ponto de entrada: `[AGENTS.md](./AGENTS.md)`.

## Rotas


| Rota                       | Descrição                            |
| -------------------------- | ------------------------------------ |
| `/`                        | Redireciona para `/admin/products`   |
| `/admin/products`          | Listagem com busca e filtros         |
| `/admin/products/new`      | Criação de produto                   |
| `/admin/products/:id/edit` | Edição de produto                    |
| `/store`                   | Catálogo público com busca e filtros |
| `/store/products/:id`      | Detalhes do produto na loja          |
| `/store/cart`              | Carrinho de compras                  |
| `/store/checkout`          | Checkout simulado                    |
| `/store/order-success`     | Confirmação de pedido                |


## Integração com a Fake Store API

Base URL: `https://fakestoreapi.com`

Endpoints utilizados:

- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `GET /products/categories`

Erros HTTP são normalizados por interceptor funcional (`NormalizedHttpError`).

## Limitação conhecida da API

A Fake Store API é destinada a prototipação. Mutações retornam respostas simuladas, mas **não persistem alterações no servidor**. Após sucesso HTTP, o estado local é reconciliado para refletir a operação na sessão atual, **sem refazer a listagem automaticamente** ao voltar para `/admin/products`. Somente um **refresh do navegador** restaura os dados originais da API.

Imagens dependem de URLs externas; o fallback local (`/images/product-placeholder.svg`) protege a interface quando uma URL falha.

## Como executar

```bash
npm install
npm start
```

Acesse `http://localhost:4200/admin/products` ou `http://localhost:4200/store`.

## Scripts disponíveis


| Comando         | Descrição                   |
| --------------- | --------------------------- |
| `npm start`     | Servidor de desenvolvimento |
| `npm run build` | Build de produção           |
| `npm test`      | Testes unitários (Vitest)   |
| `npm run lint`  | ESLint                      |


Validação completa:

```bash
npm run lint
npm run test -- --watch=false
npm run build
```

## Testes

186 testes unitários em 23 arquivos, cobrindo serviço HTTP, stores admin e loja, carrinho, checkout, formulário, listagem, catálogo público, dialog, toast, imagens (fallback e defer) e infraestrutura core.

## Decisões técnicas

Registro completo em `[docs/DECISOES.md](./docs/DECISOES.md)`. Destaques:

- Signals para estado de UI; RxJS para HTTP
- Reactive Forms tipados (não Signal Forms)
- Reconciliação local após mutações (ADR-008)
- `<img>` nativo com componente compartilhado e fallback (ADR-014, ADR-016)
- Dialog nativo para exclusão (ADR-015)
- Design system SCSS via `_controls.scss` (ADR-021)
- Loja pública com filtros isolados e store reconciliada (ADR-022)
- Carrinho local e checkout simulado (ADR-012, ADR-023)
- Imagens com fallback e carregamento diferido na listagem (ADR-016)
- Sem NgRx, autenticação ou biblioteca de UI externa

## Acessibilidade e responsividade

- HTML semântico, labels associados, `aria-invalid`, `aria-describedby` e `role="alert"` onde aplicável
- Foco visível e navegação por teclado nos fluxos principais
- Layout mobile-first: sidebar empilhada, cards na listagem, formulário em coluna única
- Revisão manual estruturada registrada em `[docs/specs/002-crud-produtos/review.md](./docs/specs/002-crud-produtos/review.md)`

## Escopo priorizado

**Entregue (Specs 002 + 002.1 + 002.2 + 003 + 004):** CRUD administrativo, loja pública completa com carrinho e checkout simulado, design system compartilhado, identidade Starian, estados assíncronos, testes e documentação.

**Fora desta entrega:** autenticação, pagamento real, paginação e ordenação.