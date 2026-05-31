# Arquitetura

## 1. Estilo arquitetural
Utilizar arquitetura Angular orientada por feature, com componentes standalone e rotas lazy-loaded.

O projeto é propositalmente pequeno, mas sua organização deve continuar compreensível caso novas capacidades de gestão de produtos sejam adicionadas futuramente.

## 2. Estrutura-alvo

A árvore abaixo representa o destino arquitetural. A implementação deve ser incremental; ver seção 3.

```text
src/app/
├── core/
│   ├── config/
│   ├── http/
│   └── layout/
│
├── features/
│   ├── catalog/
│   │   ├── models/
│   │   ├── components/
│   │   └── utils/
│   │
│   ├── admin/
│   │   ├── dashboard/
│   │   └── products/
│   │       ├── services/
│   │       ├── store/
│   │       ├── pages/
│   │       └── components/
│   │
│   └── store/
│       ├── components/
│       ├── catalog/
│       ├── product-details/
│       ├── cart/
│       └── checkout/
│
└── shared/
    └── ui/
```

## 3. Implementação incremental

Não materializar toda a estrutura de uma só vez. Criar pastas somente quando a spec ativa exigir código real.

| Prioridade | Pastas a criar | Quando |
|---|---|---|
| **P0** | `core`, `shared/ui` (quando necessário), `features/admin/products` | Fundação e CRUD administrativo |
| **P1** | `features/store/catalog`, `features/store/product-details` | Após CRUD validado |
| **P2** | `features/store/cart`, `features/store/checkout` | Somente se houver tempo seguro |

Regras:
- não criar pastas vazias antecipadamente;
- `features/admin/dashboard` e demais subpastas de `store` só entram quando houver implementação concreta;
- `shared/ui` recebe componentes genéricos conforme reutilização comprovada.

## 4. Direção de dependências

```text
pages -> feature components -> services / store
pages -> products/components (domínio dumb)
pages -> shared/ui (genérico)
store -> services
services -> core http/config
products/components -> products/models (sem store, sem rotas)
shared/ui -> sem dependências de features
core -> sem dependências de features
```

Organização interna de `features/admin/products`:

| Pasta | Responsabilidade |
|---|---|
| `services` | Integração HTTP com a Fake Store API |
| `store` | Estado da feature com Signals |
| `pages` | Componentes de rota e orquestração |
| `components` | Composição contextual (lista, grid, formulário) |

Organização de `features/catalog`:

| Pasta | Responsabilidade |
|---|---|
| `models` | Contratos tipados (`ApiProduct`, payloads) |
| `components` | UI dumb reutilizável entre admin e loja |
| `utils` | Funções puras de domínio (`filterProducts`) |

Organização de `features/store/components`:

| Pasta | Responsabilidade |
|---|---|
| `store-product-grid` | Grid contextual da loja (link público, comprar) |

Não utilizar a pasta `data-access`.

Regras:
- `core` não deve depender de nenhuma feature.
- `shared/ui` deve permanecer genérico e **nunca** importar `ApiProduct`.
- Componentes em `features/catalog/components` são dumb: recebem dados por `input()`, emitem por `output()` ou content projection; não injetam store nem conhecem rotas de admin/loja.
- Lógicas específicas de produtos administrativos (CRUD, reconciliação HTTP) pertencem a `features/admin/products`.
- Wrappers contextuais (`product-card-grid`, `store-product-grid`) compõem `ProductCard` com rotas e ações próprias.
- Componentes de UI devem receber dados por inputs e emitir intenções do usuário por outputs quando aplicável.
- Pages orquestram rotas, stores e navegação.

## 5. Estratégia de estado
Utilizar um store leve por feature baseado em Angular Signals.
Utilizar RxJS Observables para requisições HTTP e composição assíncrona.

Modelo recomendado:

```ts
type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

interface ProductState {
  products: Product[];
  categories: string[];
  loadStatus: RequestStatus;
  mutationStatus: RequestStatus;
  searchTerm: string;
  selectedCategory: string | null;
  error: NormalizedHttpError | null;
}
```

Expor valores derivados com `computed()`:
- produtos filtrados;
- flags de carregamento;
- flags de salvamento;
- estado vazio;
- filtros ativos.

## 6. Integração HTTP
- Configurar `HttpClient` com `provideHttpClient()` em `app.config.ts`.
- Registrar interceptors funcionais com `withInterceptors(...)`.
- Manter detalhes dos endpoints dentro de `ProductApiService` (`features/admin/products/services`).
- Manter mutação do estado de interface dentro do store da feature (`features/admin/products/store`).
- Utilizar contratos tipados para requests e responses.

## 7. Formulários
Utilizar Angular Reactive Forms nos fluxos de criação e edição.
Reutilizar um único componente de formulário com inputs e outputs específicos por modo.

## 8. Rotas

Utilizar lazy loading por contexto (`admin`, `store`).

**P0 — painel administrativo:**

```text
/admin
/admin/products
/admin/products/new
/admin/products/:id/edit
```

A raiz `/` deve redirecionar para `/admin/products`.

**P1 — loja pública:**

```text
/store
/store/products/:id
```

**P2 — carrinho e checkout simulado:**

```text
/store/cart
/store/checkout
/store/order-success
```

## 9. Autenticação

Permanece **fora do escopo** em todas as fases:

- não implementar login;
- não implementar cadastro;
- não implementar `AuthGuard`;
- não implementar interceptor de token.

## 10. Tratamento de erros
Normalizar erros HTTP em um contrato pequeno e previsível no nível da aplicação.
Pages e componentes não devem interpretar diretamente objetos brutos de `HttpErrorResponse`.

Exemplo:

```ts
interface NormalizedHttpError {
  status: number;
  message: string;
  recoverable: boolean;
}
```

## 11. Arquitetura de estilos
A aplicação utilizará SCSS com tokens, funções e mixins globais.
Estrutura:

```text
src/styles/
├── _variables.scss
├── _mixins.scss
├── _theme.scss
├── _reset.scss
└── _index.scss
```

Detalhes em `docs/STYLES.md`.

## 12. Estratégia de testes
- Testar serviços HTTP com `provideHttpClientTesting()` e `HttpTestingController`.
- Testar transições de estado do store.
- Testar validações do formulário e submissão válida.
- Testar estados visíveis da listagem de produtos.
- Utilizar harnesses do Angular Material quando componentes interativos do Material forem adotados.
- Criar harness customizado somente quando um componente interativo reutilizável se beneficiar de uma API de teste estável.

## 13. Regras de simplicidade
Não introduzir:
- camadas repository envolvendo um único serviço de API sem benefício concreto;
- componentes-base genéricos;
- bibliotecas globais de estado;
- facades que apenas renomeiam métodos;
- micro-frontends prematuros;
- políticas complexas de retry.
