# Starian Catalog

Painel administrativo enxuto para gestão de catálogo, desenvolvido como desafio técnico frontend com **Angular 21** e **Fake Store API**.

**Demo online:** [Painel Admin](https://starian-catalog.vercel.app/admin) · [Loja pública](https://starian-catalog.vercel.app/store)

[Demo](#demo-online) · [Executar](#como-executar) · [Build](#build) · [Escopo](#escopo) · [Arquitetura](#arquitetura) · [IA & MCP](#desenvolvimento-com-ia) · [Documentação](./docs/)

---

## Visão geral

A aplicação simula uma plataforma de catálogo digital em dois contextos:


| Contexto         | Rota base         | Papel                                              |
| ---------------- | ----------------- | -------------------------------------------------- |
| **Painel admin** | `/admin/products` | CRUD completo de produtos (escopo principal)       |
| **Loja pública** | `/store`          | Demonstração do catálogo para o consumidor (extra) |


O foco do projeto é qualidade de execução: arquitetura clara, estados assíncronos previsíveis, formulários reativos, acessibilidade, testes e documentação rastreável.

---

## Demo online

Deploy de demonstração na Vercel:

| Contexto | URL |
| --- | --- |
| **Painel admin** | [starian-catalog.vercel.app/admin](https://starian-catalog.vercel.app/admin) |
| **Loja pública** | [starian-catalog.vercel.app/store](https://starian-catalog.vercel.app/store) |

A loja reflete as mutações feitas no admin **durante a mesma sessão do navegador** (reconciliação local). Um refresh restaura os dados originais da Fake Store API.

---

## Escopo

### Core: painel administrativo

Fluxo CRUD completo sobre a Fake Store API:

- Listagem em **lista** ou **cards**, com busca e filtro por categoria
- Criação e edição com Reactive Forms tipados e preview ao vivo
- Exclusão com dialog acessível e feedback via toast
- Reconciliação local após mutações (sem refetch automático da listagem)
- Estados de carregamento, erro, vazio e vazio filtrado
- Identidade visual Starian (sidebar fixa, mixins SCSS, chips, preview)

### Extra: loja pública

Implementada **após** a validação do CRUD, como diferencial incremental. Não compromete o escopo principal; reutiliza o catálogo reconciliado do admin.


| Fluxo    | Rota                   | O que faz                                            |
| -------- | ---------------------- | ---------------------------------------------------- |
| Catálogo | `/store`               | Grid responsivo, filtros, rating e categorias em PT  |
| Detalhe  | `/store/products/:id`  | Página do produto com ação de compra                 |
| Carrinho | `/store/cart`          | Quantidade, subtotal, persistência em `localStorage` |
| Checkout | `/store/checkout`      | Formulário simulado (sem pagamento real)             |
| Sucesso  | `/store/order-success` | Confirmação do pedido demonstrativo                  |


**Integração admin ↔ loja:** alterações feitas no painel refletem na loja **na sessão atual**. O link *Visualizar loja* no admin abre o catálogo público com os mesmos produtos reconciliados.

**Componentes compartilhados** (`features/catalog/`): filtros, imagem, chip de categoria, card, rating, máscara BRL e utilitários de domínio — consumidos por admin e loja, sem acoplar regras de negócio.

---

## Stack

- Angular 21 · TypeScript strict · Standalone components · OnPush
- Signals (UI) + RxJS (HTTP)
- Reactive Forms · SCSS com design tokens
- Vitest · ESLint
- Sem NgRx, sem biblioteca externa de UI

---

## Arquitetura

```text
src/app/
├── core/                 # config, HTTP, layouts admin/loja
├── features/
│   ├── catalog/          # domínio compartilhado (models, components, utils)
│   ├── admin/products/   # CRUD, store, páginas
│   └── store/            # catálogo, detalhe, carrinho, checkout
└── shared/ui/            # componentes genéricos (EmptyState, Toast, Dialog…)
```

Documentação completa em `[docs/](./docs/)`. Ponto de entrada para agentes e devs: `[AGENTS.md](./AGENTS.md)`.

---

## Rotas


| Rota                       | Descrição                          |
| -------------------------- | ---------------------------------- |
| `/`                        | Redireciona para `/admin/products` |
| `/admin/products`          | Listagem com busca e filtros       |
| `/admin/products/new`      | Criação de produto                 |
| `/admin/products/:id/edit` | Edição de produto                  |
| `/store`                   | Catálogo público                   |
| `/store/products/:id`      | Detalhe na loja                    |
| `/store/cart`              | Carrinho                           |
| `/store/checkout`          | Checkout simulado                  |
| `/store/order-success`     | Confirmação                        |


---

## Desenvolvimento com IA

Este repositório foi estruturado para trabalho assistido por agentes, com regras, specs e quality gate versionados.

### MCPs

Model Context Protocol conecta o editor a ferramentas externas. Configuração em `[.vscode/mcp.json](./.vscode/mcp.json)`:


| Servidor            | Uso no projeto                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| **Angular CLI MCP** | `list_projects`, `get_best_practices`, documentação e padrões alinhados à versão do Angular instalada |


O MCP do Angular é consultado antes de implementar features, garantindo APIs e convenções atualizadas (signals, standalone, control flow, etc.).

### Skills

Skills são playbooks reutilizáveis para orientar o agente em tarefas específicas:


| Skill                   | Local             | Função                                                                                                               |
| ----------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| **angular-sdd-feature** | `.cursor/skills/` | Fluxo Specification-Driven Development: ler spec → implementar uma task → quality gate → atualizar `ESTADO_ATUAL.md` |
| **angular-developer**   | `.agents/skills/` | Referência de boas práticas Angular 21 (componentes, signals, forms, testes, harnesses)                              |


Specs versionadas em `[docs/specs/](./docs/specs/)` são a fonte de verdade; o agente não expande escopo silenciosamente.

### Component Harnesses

Padrão de testes do Angular para interagir com componentes por **API estável**, sem depender de seletores frágeis do DOM interno.

Neste projeto:

- `**RouterTestingHarness`** — testes de rotas lazy-loaded (`/admin/products`, `/store`, `/store/cart`)
- Harnesses customizados **somente quando há ganho claro** (ADR-009); a maioria dos testes usa TestBed + queries semânticas

Em resumo: o “harness mindset” é testar comportamento observável (texto, roles, navegação) em vez de detalhes de implementação — alinhado ao quality gate em `[.cursor/rules/20-quality-gate.mdc](./.cursor/rules/20-quality-gate.mdc)`.

---

## Fake Store API

**Base:** `https://fakestoreapi.com`


| Método | Endpoint                                             |
| ------ | ---------------------------------------------------- |
| GET    | `/products`, `/products/:id`, `/products/categories` |
| POST   | `/products`                                          |
| PUT    | `/products/:id`                                      |
| DELETE | `/products/:id`                                      |


Erros HTTP são normalizados por interceptor funcional (`NormalizedHttpError`).

### Limitação conhecida

A API é de prototipação: mutações **não persistem no servidor**. O app reconcilia o estado local após sucesso HTTP. Um refresh do navegador restaura os dados originais da API.

---

## Como executar

**Pré-requisito:** Node.js 22+ e npm 11+.

```bash
npm install
npm start
```

| URL                                                                          | Contexto     |
| ---------------------------------------------------------------------------- | ------------ |
| [http://localhost:4200/admin/products](http://localhost:4200/admin/products) | Painel admin |
| [http://localhost:4200/store](http://localhost:4200/store)                   | Loja pública |

---

## Build

### Build de produção (npm)

Gera os artefatos estáticos otimizados para deploy:

```bash
npm run build
```

Saída em `dist/starian-catalog/browser/` (HTML, JS, CSS com hash para cache).

Para servir localmente o build gerado (ex.: validar rotas SPA antes do deploy):

```bash
npx --yes serve dist/starian-catalog/browser -l 4200
```

### Build com Docker

Imagem multi-stage: Node 22 compila o Angular; nginx serve os arquivos estáticos com fallback SPA.

**Docker Compose (recomendado):**

```bash
docker compose up --build
```

Para rodar em segundo plano:

```bash
docker compose up --build -d
docker compose down   # encerra e remove o container
```

**Docker direto:**

```bash
docker build -t starian-catalog .
docker run --rm -p 8080:80 starian-catalog
```

| URL | Contexto |
| --- | --- |
| [http://localhost:8080/admin](http://localhost:8080/admin) | Painel admin |
| [http://localhost:8080/store](http://localhost:8080/store) | Loja pública |

Arquivos: `Dockerfile`, `docker-compose.yml`, `docker/nginx.conf`, `.dockerignore`.

### Scripts

| Comando | Descrição |
| --- | --- |
| `npm start` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm test` | Testes unitários (Vitest) |
| `npm run lint` | ESLint |
| `npm run audit:ci` | Auditoria de vulnerabilidades (nível moderate+) |

### Quality gate (local e CI)

O workflow [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) executa, nesta ordem:

1. `npm ci`
2. `npm run audit:ci`
3. `npm run lint`
4. `npm run test -- --watch=false`
5. `npm run build`
6. `docker compose build` (job separado, após o quality gate)

Para reproduzir localmente (com dependências já instaladas):

```bash
npm run audit:ci && npm run lint && npm run test -- --watch=false && npm run build
```

---

## Testes

**211** testes unitários cobrindo HTTP, stores, carrinho, checkout, formulários, catálogo compartilhado, componentes de domínio (rating, categorias, máscara BRL), rotas e infraestrutura core.

---

## Decisões técnicas

Registro completo em `[docs/DECISOES.md](./docs/DECISOES.md)`. Destaques:

- Signals para UI · RxJS para HTTP · Reactive Forms tipados
- Reconciliação local pós-mutação (ADR-008)
- Domínio compartilhado em `features/catalog` (ADR-024)
- UI genérica vs UI de domínio (ADR-025)
- Loja com filtros isolados e store reconciliada (ADR-022)
- Carrinho local + checkout simulado (ADR-023)
- Design system via mixins SCSS (ADR-021)

---

## Acessibilidade

HTML semântico, labels associados, `aria-`* em erros de formulário, foco visível e navegação por teclado nos fluxos principais. Layout mobile-first.

---

## Licença

Desafio técnico frontend Starian.