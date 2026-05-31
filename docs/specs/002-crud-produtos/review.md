# Revisão — Spec 002 CRUD de produtos

Data da revisão: 2026-05-31

## Status

**Status: concluída**

---

## Objetivo da spec

Entregar o CRUD administrativo completo de produtos integrado à Fake Store API, com busca, filtros, formulário reativo reutilizável, exclusão confirmada, estados assíncronos, testes e acabamento visual mínimo.

---

## Escopo entregue

- Camada `data-access` (`ProductApiService`, modelos tipados)
- Store baseado em Signals com busca, filtro e mutações reconciliadas localmente
- Listagem responsiva (tabela desktop / cards mobile)
- Formulário reativo compartilhado para criação e edição
- Dialog nativo de confirmação de exclusão
- Componentes compartilhados de estado (`LoadingState`, `EmptyState`, `ErrorState`, `ConfirmDialog`, `ProductImage`)
- Fallback local para imagens quebradas
- Revisão responsiva e de acessibilidade
- README consolidado e documentação operacional atualizada

**Fora do escopo (adiado):** loja pública, carrinho, checkout, autenticação, paginação, ordenação.

---

## Critérios de aceite

- [x] Listagem funcional com estados loading, erro, vazio e vazio filtrado
- [x] Busca por título e filtro por categoria com limpar filtros
- [x] Criação de produto com validações e preview
- [x] Edição de produto com carregamento por ID
- [x] Exclusão com confirmação e erro recuperável no dialog
- [x] Reconciliação local após mutações bem-sucedidas
- [x] Preservação de dados do formulário após falha HTTP
- [x] Fallback de imagem reutilizável
- [x] Layout responsivo revisado (375px, 768px, 1280px)
- [x] Acessibilidade mínima revisada
- [x] Testes, lint e build passando

---

## Checklist concluído

### CRUD
- [x] Listagem demonstrada
- [x] Criação demonstrada
- [x] Edição demonstrada
- [x] Exclusão demonstrada

### UX
- [x] Estado de carregamento
- [x] Estado de erro com nova tentativa
- [x] Estado vazio
- [x] Estado vazio filtrado
- [x] Validações do formulário
- [x] Layout mobile revisado
- [x] Layout desktop revisado
- [x] Navegação mínima por teclado revisada
- [x] Fallback de imagem

### Entrega
- [x] Código morto removido (não identificado)
- [x] Lint
- [x] Testes unitários
- [x] Build de produção
- [x] README atualizado
- [x] `docs/ESTADO_ATUAL.md` atualizado

---

## Evidências técnicas

| Verificação | Resultado | Observações |
|---|---|---|
| Lint | Passou | `npm run lint` |
| Testes unitários | Passou | 141 testes, 17 arquivos |
| Build de produção | Passou | `npm run build` |

---

## Componentes criados

### Feature `admin/products`
- `ProductTable`, `ProductCardList`, `ProductFilters`, `ProductForm`
- `ProductsListPage`, `ProductCreatePage`, `ProductEditPage`
- `ProductStoreService`, `ProductApiService`

### Shared UI
- `LoadingState`, `EmptyState`, `ErrorState`
- `ConfirmDialog`
- `ProductImage` (fallback `/images/product-placeholder.svg`)

### Assets
- `public/images/product-placeholder.svg`

---

## Rotas disponíveis

| Rota | Componente |
|---|---|
| `/admin/products` | `ProductsListPage` |
| `/admin/products/new` | `ProductCreatePage` |
| `/admin/products/:id/edit` | `ProductEditPage` |

---

## Endpoints utilizados

- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `GET /products/categories`

---

## Estados assíncronos

| Contexto | Estados |
|---|---|
| Listagem | loading, erro com retry, vazio, vazio filtrado, sucesso |
| Categorias (formulário) | loading, erro com retry, sucesso |
| Salvamento | loading por operação, erro preservando formulário |
| Exclusão | loading por item, erro no dialog com retry implícito (reabrir) |

---

## Tratamento de erros

- Interceptor funcional normaliza erros HTTP
- Páginas e store consomem `NormalizedHttpError`
- Falhas de mutação não alteram listas locais indevidamente
- Erros de salvamento exibidos com `role="alert"` no formulário
- Erros de exclusão exibidos dentro do `ConfirmDialog`

---

## Reconciliação local

Após `POST`, `PUT` ou `DELETE` bem-sucedidos, o `ProductStoreService` atualiza signals locais. Em falha, o estado anterior é preservado.

---

## Validações do formulário

- Título obrigatório
- Preço numérico maior que zero
- Categoria obrigatória
- URL de imagem válida (http/https)
- Descrição obrigatória
- Mensagens associadas via `aria-describedby` e `aria-invalid`

---

## Acessibilidade

Revisão manual estruturada (AXE não instalado no projeto):

| Item | Resultado |
|---|---|
| HTML semântico (`main`, `nav`, `table`, `dialog`, `form`) | OK |
| Headings em ordem coerente | OK |
| Labels associados aos campos | OK |
| `aria-invalid` e `aria-describedby` nos erros de formulário | OK |
| `role="alert"` em erros relevantes | OK |
| Foco visível (`:focus-visible`) | OK |
| Botões e links com nomes claros | OK |
| Exclusão com `aria-label` incluindo nome do produto | OK |
| Dialog com Escape e foco gerenciado | OK |
| Alt descritivo em imagens via `ProductImage` | OK |
| Ausência de interação crítica exclusiva por hover | OK |

---

## Responsividade

Revisão manual nos breakpoints 375px, 768px e 1280px.

| Área | Ajustes realizados |
|---|---|
| `AdminLayout` | Grid empilhado no mobile; sidebar com borda inferior; nav horizontal; `min-width: 0` no conteúdo |
| Listagem | Tabela oculta abaixo de 768px; cards visíveis; filtros em coluna no mobile |
| Formulário | Preview empilhado abaixo de 768px; `min-width: 0` no layout |
| Dialog | Botões em coluna no mobile; largura limitada com `min(100% - 2rem, 28rem)` |

---

## Testes

| Alvo | Resultado | Observações |
|---|---|---|
| `ProductApiService` | Passou | Métodos, URLs, payloads e erros |
| `ProductStoreService` | Passou | Carga, filtros, mutações e reconciliação |
| `ProductForm` | Passou | Validações e submissão |
| `ProductsListPage` | Passou | Estados, filtros, exclusão |
| `ConfirmDialog` | Passou | Abertura, confirmação, erro, Escape |
| `ProductImage` | Passou | Src, alt, dimensões, loading, fallback, loop, atualização |
| Infra core | Passou | Rotas, interceptor, normalizador |

---

## Comandos executados

```bash
npm run lint
npm run test -- --watch=false
npm run build
```

---

## Limitações conhecidas

- Mutações da Fake Store API não possuem persistência remota garantida
- Recarregar a aplicação pode restaurar os dados originais
- Imagens dependem de URLs externas
- Fallback local protege a interface em caso de falha visual
- Loja pública permanece fora da Spec 002
- Botão “Visualizar loja” permanece desabilitado até evolução futura

---

## Funcionalidades adiadas

- Loja pública (`/store/*`)
- Carrinho e checkout
- Autenticação
- Paginação e ordenação
- Toast/snackbar service
- Upload de imagens

---

## Decisão final da spec

A Spec 002 está **concluída**. O CRUD administrativo atende aos critérios de aceite, quality gates e documentação obrigatória. Próxima decisão recomendada: avaliar início da Spec 003 (loja pública).
