# Arquitetura

## 1. Estilo arquitetural
Utilizar arquitetura Angular orientada por feature, com componentes standalone e rotas lazy-loaded.

O projeto é propositalmente pequeno, mas sua organização deve continuar compreensível caso novas capacidades de gestão de produtos sejam adicionadas futuramente.

## 2. Estrutura-alvo

```text
src/
└── app/
    ├── core/
    │   ├── config/
    │   │   └── api.config.ts
    │   ├── http/
    │   │   ├── http-error.model.ts
    │   │   └── error.interceptor.ts
    │   └── layout/
    │       └── app-shell/
    ├── features/
    │   └── products/
    │       ├── data-access/
    │       │   ├── product-api.service.ts
    │       │   ├── product-store.service.ts
    │       │   └── product.model.ts
    │       ├── pages/
    │       │   ├── product-list-page/
    │       │   └── product-form-page/
    │       ├── ui/
    │       │   ├── product-table/
    │       │   ├── product-card/
    │       │   ├── product-form/
    │       │   └── product-delete-dialog/
    │       └── products.routes.ts
    ├── shared/
    │   └── ui/
    │       ├── empty-state/
    │       ├── error-state/
    │       ├── loading-state/
    │       └── page-header/
    ├── app.config.ts
    └── app.routes.ts
```

## 3. Direção de dependências

```text
pages -> feature ui -> feature data-access
pages -> shared ui
feature data-access -> core http/config
shared ui -> sem dependências de features
core -> sem dependências de features
```

Regras:
- `core` não deve depender de nenhuma feature.
- `shared/ui` deve permanecer genérico.
- Lógicas específicas de produtos pertencem a `features/products`.
- Componentes de UI devem receber dados por inputs e emitir intenções do usuário por outputs quando aplicável.
- Pages orquestram rotas, stores e navegação.

## 4. Estratégia de estado
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

## 5. Integração HTTP
- Configurar `HttpClient` com `provideHttpClient()` em `app.config.ts`.
- Registrar interceptors funcionais com `withInterceptors(...)`.
- Manter detalhes dos endpoints dentro de `ProductApiService`.
- Manter mutação do estado de interface dentro de `ProductStoreService`.
- Utilizar contratos tipados para requests e responses.

## 6. Formulários
Utilizar Angular Reactive Forms nos fluxos de criação e edição.
Reutilizar um único componente de formulário com inputs e outputs específicos por modo.

## 7. Rotas
Rotas recomendadas:

```text
/products
/products/new
/products/:id/edit
```

A feature de produtos deve ser carregada sob demanda a partir de `app.routes.ts`.

## 8. Tratamento de erros
Normalizar erros HTTP em um contrato pequeno e previsível no nível da aplicação.
Pages e componentes não devem interpretar diretamente objetos brutos de `HttpErrorResponse`.

## Arquitetura de estilos
A aplicação utilizará SCSS com tokens, funções e mixins globais.
Estrutura:

```text
src/styles/
├── _variables.scss
├── _mixins.scss
├── _theme.scss
├── _reset.scss
└── _index.scss

Exemplo:

```ts
interface NormalizedHttpError {
  status: number;
  message: string;
  recoverable: boolean;
}
```

## 9. Estratégia de testes
- Testar serviços HTTP com `provideHttpClientTesting()` e `HttpTestingController`.
- Testar transições de estado do store.
- Testar validações do formulário e submissão válida.
- Testar estados visíveis da listagem de produtos.
- Utilizar harnesses do Angular Material quando componentes interativos do Material forem adotados.
- Criar harness customizado somente quando um componente interativo reutilizável se beneficiar de uma API de teste estável.

## 10. Regras de simplicidade
Não introduzir:
- camadas repository envolvendo um único serviço de API sem benefício concreto;
- componentes-base genéricos;
- bibliotecas globais de estado;
- facades que apenas renomeiam métodos;
- micro-frontends prematuros;
- políticas complexas de retry.
