# Spec 005 — Consolidação de componentes compartilhados do catálogo

## Status

**Aprovada para implementação** — 2026-05-31.

---

## 1. Objetivo

Eliminar duplicações comprovadas entre o painel administrativo e a loja pública, extraindo componentes reutilizáveis para a camada correta da aplicação.

A refatoração deve preservar:

- simplicidade;
- baixo acoplamento;
- legibilidade;
- comportamento existente;
- responsividade;
- acessibilidade;
- testes;
- qualidade visual.

A extração não deve transformar `shared/ui` em uma pasta genérica para componentes de domínio.

---

## 2. Contexto

Após as Specs 003 e 004, o painel administrativo e a loja pública compartilham alguns elementos visuais e comportamentos equivalentes:

- busca por título;
- filtro por categoria;
- imagem com fallback;
- chip de categoria;
- conteúdo visual básico de cards;
- estado vazio após aplicação de filtros;
- função pura de filtragem.

Alguns desses elementos são genéricos da aplicação.

Outros continuam pertencendo claramente ao domínio de produtos.

Esta spec formaliza a consolidação respeitando essa separação.

---

## 3. Regra arquitetural principal

### `shared/ui`

Utilizar somente para componentes genéricos da aplicação.

Esses componentes:

- não importam `ApiProduct`;
- não conhecem categorias de produtos;
- não conhecem rotas administrativas;
- não conhecem rotas públicas;
- não injetam store;
- não acessam services;
- não chamam `HttpClient`;
- não implementam regras de negócio.

Exemplos:

```text
ConfirmDialog
EmptyState
ErrorState
FilteredEmptyState
LoadingState
ToastContainer
```

### `features/catalog/components`

Utilizar para componentes visuais reutilizáveis entre diferentes contextos, mas ainda pertencentes ao domínio de produtos.

Esses componentes:

- podem importar `ApiProduct`;
- podem conhecer campos visuais do produto;
- recebem dados por `input()`;
- emitem ações por `output()` ou content projection;
- não injetam store;
- não acessam services;
- não conhecem rotas específicas de admin ou loja;
- não implementam regras administrativas ou comerciais.

Exemplos:

```text
ProductImage
ProductFilters
CategoryChip
ProductCard
```

### Componentes específicos de contexto

Permanecem próximos do contexto que os utiliza:

```text
features/admin/products/components/
features/store/components/
```

Esses componentes coordenam ações visuais próprias de cada experiência.

Exemplos:

```text
ProductList
AdminProductCardGrid
StoreProductGrid
```

---

## 4. Estrutura esperada

```text
src/app/
├── shared/
│   └── ui/
│       ├── confirm-dialog/
│       ├── empty-state/
│       ├── error-state/
│       ├── filtered-empty-state/
│       ├── loading-state/
│       └── toast/
│
└── features/
    ├── products/
    │   ├── models/
    │   ├── services/
    │   ├── store/
    │   ├── utils/
    │   │   └── filter-products.ts
    │   └── components/
    │       ├── product-image/
    │       ├── product-filters/
    │       ├── category-chip/
    │       └── product-card/
    │
    ├── admin/
    │   └── products/
    │       ├── components/
    │       │   ├── product-list/
    │       │   └── product-card-grid/
    │       └── pages/
    │
    └── store/
        ├── components/
        │   └── store-product-grid/
        └── pages/
```

Não criar pastas vazias.

Não mover arquivos sem reutilização comprovada.

---

## 5. Mapeamento de duplicação

| Artefato atual | Contextos | Similaridade | Destino recomendado |
|---|---|---:|---|
| `ProductFilters` e `StoreFilters` | Admin + loja | Alta | `features/catalog/components/product-filters` |
| Fallback de imagem | Admin + loja | Alta | `features/catalog/components/product-image` |
| Chips de categoria | Admin + loja | Alta | `features/catalog/components/category-chip` |
| Miolo visual dos cards | Admin + loja | Alta | `features/catalog/components/product-card` |
| Grid administrativo | Admin | Específico | Permanecer em `features/admin/products/components` |
| Grid público | Loja | Específico | Permanecer em `features/store/components` |
| Estado vazio filtrado | Admin + loja | Genérico | `shared/ui/filtered-empty-state` |
| Função de filtragem | Stores de produto | Idêntica | `features/catalog/utils/filter-products.ts` |
| Listagem em linha | Admin | Específico | Permanecer no admin |
| Pages de catálogo | Admin + loja | Orquestrações diferentes | Permanecer separadas |

---

## 6. Escopo P1

### 6.1 Extrair `ProductFilters`

Mover ou consolidar filtros em:

```text
src/app/features/catalog/components/product-filters/
```

Inputs:

```ts
categories = input.required<string[]>();
searchTerm = input('');
selectedCategory = input<string | null>(null);
searchPlaceholder = input('Buscar produtos...');
fieldIdPrefix = input('product-filters');
```

Outputs:

```ts
searchTermChange = output<string>();
selectedCategoryChange = output<string | null>();
clearFilters = output<void>();
```

Regras:

- manter componente dumb;
- não injetar store;
- não acessar services;
- não conhecer admin ou loja;
- utilizar IDs acessíveis derivados de `fieldIdPrefix`;
- remover componentes duplicados após migração;
- preservar copy configurável.

---

### 6.2 Extrair `ProductImage`

Mover ou consolidar em:

```text
src/app/features/catalog/components/product-image/
```

Inputs:

```ts
src = input.required<string>();
alt = input.required<string>();
width = input(64);
height = input(64);
loading = input<'lazy' | 'eager'>('lazy');
```

Responsabilidades:

- renderizar imagem;
- aplicar fallback local;
- evitar loop em caso de falha do fallback;
- preservar alt;
- preservar dimensões;
- reagir a alterações do input `src`.

Não acessar store.

Não chamar API.

Não implementar regra de negócio.

---

### 6.3 Extrair `CategoryChip`

Criar:

```text
src/app/features/catalog/components/category-chip/
```

Input:

```ts
label = input.required<string>();
```

Opcional:

```ts
muted = input(false);
```

Responsabilidade:

- padronizar apresentação da categoria;
- eliminar SCSS repetido;
- manter acessibilidade;
- permanecer pequeno.

Não criar sistema genérico de badges nesta etapa.

---

### 6.4 Extrair `ProductCard`

Criar:

```text
src/app/features/catalog/components/product-card/
```

Input:

```ts
product = input.required<ApiProduct>();
```

Responsabilidades:

- imagem;
- chip de categoria;
- título;
- preço em BRL;
- descrição curta;
- estrutura visual;
- slot opcional para ações.

Estrutura conceitual:

```html
<article class="product-card">
  <!-- conteúdo comum -->

  <div class="product-card__actions">
    <ng-content select="[product-card-actions]" />
  </div>
</article>
```

Regras:

- não conhecer rotas;
- não criar `detailLink`;
- não criar factory de URL;
- não conhecer admin;
- não conhecer loja;
- não chamar store;
- não chamar service;
- não criar `@if` por contexto;
- não saber o significado das ações projetadas.

---

### 6.5 Manter wrappers finos por contexto

#### Admin

Manter:

```text
src/app/features/admin/products/components/product-card-grid/
```

Responsabilidades:

- iterar produtos;
- renderizar `ProductCard`;
- projetar ações administrativas:
  - Editar;
  - Excluir;
- emitir `deleteRequested`;
- respeitar `deletingProductId`.

Não duplicar card shell.

#### Loja

Manter:

```text
src/app/features/store/components/store-product-grid/
```

Responsabilidades:

- iterar produtos;
- renderizar `ProductCard`;
- projetar ações públicas:
  - Ver produto;
  - Adicionar ao carrinho, se já existir no escopo implementado;
- preservar rotas públicas;
- preservar comportamento existente.

Não duplicar card shell.

---

### 6.6 Extrair `FilteredEmptyState`

Criar:

```text
src/app/shared/ui/filtered-empty-state/
```

Inputs:

```ts
title = input('Nenhum produto corresponde aos filtros aplicados.');
message = input('Tente ajustar a busca ou selecionar outra categoria.');
clearLabel = input('Limpar filtros');
```

Output:

```ts
clearFilters = output<void>();
```

Regras:

- componente genérico;
- sem import de `ApiProduct`;
- sem store;
- sem service;
- sem rota;
- copy configurável;
- ação simples.

Substituir duplicações nas pages administrativa e pública.

---

## 7. Escopo P2 opcional

Executar somente se a refatoração P1 estiver concluída, os testes estiverem passando e não houver risco de prazo.

### 7.1 Extrair função pura de filtragem

Criar:

```text
src/app/features/catalog/utils/filter-products.ts
```

Assinatura:

```ts
export function filterProducts(
  products: ApiProduct[],
  searchTerm: string,
  category: string | null,
): ApiProduct[]
```

Utilizar nos stores que atualmente duplicam a regra.

Regras:

- função pura;
- sem Signals;
- sem RxJS;
- sem side effects;
- testes unitários objetivos.

### 7.2 Consolidar token visual

Caso a altura ou espaçamento do card continue duplicado após a extração, adicionar somente o token necessário em:

```text
src/styles/_variables.scss
```

Não criar novo sistema de tokens.

---

## 8. Fora do escopo

Não implementar:

- page genérica para admin e loja;
- store genérico adicional;
- unificação de `ProductStoreService` e `CatalogStoreService` nesta spec;
- listagem em linha compartilhada;
- dialog de exclusão em produtos compartilhados;
- toggle lista/cards em shared;
- lógica de carrinho em componentes compartilhados;
- rotas hardcoded dentro de componentes do domínio;
- factory de URL dentro de `shared/ui`;
- sistema global de slots;
- biblioteca externa;
- Angular Material;
- CDK;
- abstrações antecipadas.

---

## 9. Regras Angular

Todos os novos components devem:

- ser standalone por padrão;
- não declarar `standalone: true`;
- utilizar `ChangeDetectionStrategy.OnPush`;
- utilizar `input()` e `output()`;
- utilizar `inject()` somente quando necessário;
- utilizar `@if` e `@for`;
- utilizar `track product.id`;
- evitar `ngClass`;
- evitar `ngStyle`;
- evitar `@HostBinding`;
- evitar `@HostListener`;
- manter templates simples;
- preservar WCAG AA.

---

## 10. Critérios de aceite

- [ ] Filtros duplicados removidos.
- [ ] Admin e loja utilizam `features/catalog/components/product-filters`.
- [ ] Imagem de produto consolidada em `features/catalog/components/product-image`.
- [ ] Chip de categoria consolidado em `features/catalog/components/category-chip`.
- [ ] Conteúdo visual comum dos cards consolidado em `features/catalog/components/product-card`.
- [ ] Admin preserva wrapper próprio para ações administrativas.
- [ ] Loja preserva wrapper próprio para ações públicas.
- [ ] Estado vazio filtrado usa `shared/ui/filtered-empty-state`.
- [ ] Nenhum componente em `shared/ui` importa `ApiProduct`.
- [ ] Nenhum componente compartilhado importa arquivos de `features/admin`.
- [ ] Nenhum componente compartilhado importa arquivos de `features/store`.
- [ ] Nenhum componente do domínio conhece rotas específicas.
- [ ] Componentes compartilhados permanecem dumb.
- [ ] Componentes duplicados removidos.
- [ ] Testes atualizados.
- [ ] Lint passando.
- [ ] Testes passando.
- [ ] Build passando.
- [ ] ADR registrada.
- [ ] Documentação atualizada.
- [ ] `review.md` preenchido.

---

## 11. Riscos

### Regressão visual

Risco:

- diferenças de spacing;
- altura;
- hover;
- chips;
- posicionamento de ações.

Mitigação:

- revisar admin e loja;
- preservar classes BEM;
- validar screenshots manualmente;
- manter wrappers específicos.

### Acoplamento excessivo

Risco:

- componente compartilhado conhecer rotas ou ações específicas.

Mitigação:

- compartilhar somente conteúdo visual;
- projetar ações;
- manter navegação nos wrappers.

### Abstração prematura

Risco:

- criar grid genérico complexo;
- adicionar factories;
- adicionar variantes demais.

Mitigação:

- manter `ProductCard` pequeno;
- manter wrappers explícitos;
- não criar API genérica além do necessário.

---

## 12. ADR

Registrar em:

```text
docs/DECISOES.md
```

### ADR-024 — Consolidar domínio compartilhado em `features/catalog`

#### Contexto

Admin e loja pública reutilizam modelos, utilitários e componentes relacionados ao catálogo de produtos.

A pasta `features/products` gerava ambiguidade visual com `features/admin/products`.

#### Decisão

Renomear o domínio compartilhado para:

```text
src/app/features/catalog/
```

#### Consequências

- estrutura mais legível;
- menor ambiguidade;
- melhor separação entre domínio compartilhado e experiência administrativa;
- componentes de domínio permanecem fora de `shared/ui`;
- painel e loja continuam com composições próprias;
- nenhum comportamento funcional é alterado.

### ADR-025 — Separar UI genérica e UI compartilhada do domínio de catálogo

#### Contexto

Admin e loja pública passaram a reutilizar elementos visuais relacionados a produtos.

Parte da duplicação pertence ao domínio de produtos, não à UI genérica da aplicação.

#### Decisão

Manter:

```text
shared/ui
```

somente para componentes genéricos da aplicação.

Criar ou utilizar:

```text
features/catalog/components
```

para componentes reutilizáveis do domínio de produtos.

#### Consequências

- menor duplicação;
- fronteiras mais claras;
- ausência de acoplamento indevido;
- melhor legibilidade;
- componentes reutilizáveis permanecem dumb;
- admin e loja preservam composições próprias.

---

## 13. Atualizar documentação

Atualizar:

```text
docs/ARQUITETURA.md
docs/ESTADO_ATUAL.md
docs/DECISOES.md
docs/specs/005-shared-ui-catalogo/tasks.md
docs/specs/005-shared-ui-catalogo/review.md
```

Registrar:

- separação entre `shared/ui` e `features/catalog/components`;
- componentes extraídos;
- duplicações removidas;
- wrappers mantidos;
- testes;
- quality gates;
- limitações reais.

---

## 14. Quality gate

Executar:

```bash
npm run lint
npm run test -- --watch=false
npm run build
```

Não declarar conclusão caso algum comando falhe.

---

## 15. Definição de concluído

A spec será considerada concluída quando:

- todos os critérios P1 estiverem atendidos;
- duplicações visuais comprovadas tiverem sido removidas;
- componentes compartilhados permanecerem dumb;
- wrappers de admin e loja preservarem suas responsabilidades;
- nenhum comportamento de negócio tiver sido alterado;
- quality gates estiverem verdes;
- documentação estiver atualizada;
- `review.md` estiver preenchido.

---

## 16. Resumo final obrigatório

Responder:

```md
## Status da Spec 005
- ...

## Componentes extraídos
- ...

## Componentes mantidos por contexto
- ...

## Arquivos criados
- ...

## Arquivos alterados
- ...

## Arquivos removidos
- ...

## Duplicações removidas
- ...

## Testes atualizados
- ...

## Validações executadas
- npm run lint
- npm run test -- --watch=false
- npm run build

## Decisão arquitetural registrada
- ...

## Pendências reais
- ...
```