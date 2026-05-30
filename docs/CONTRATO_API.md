# Contrato da API

## 1. Objetivo

Este documento define os contratos utilizados na integração com a Fake Store API e estabelece a separação entre:

- modelos remotos retornados pela API;
- payloads enviados nas requisições;
- modelos internos utilizados pela interface;
- estado local necessário para simular uma experiência funcional de loja pública.

A aplicação deve consumir a API real sempre que houver endpoint correspondente, mas não deve depender de persistência remota para manter a experiência da sessão atual.

---

## 2. URL base

```text
https://fakestoreapi.com
```

O valor deve permanecer centralizado na configuração da aplicação.

Exemplo:

```ts
export const API_CONFIG = {
  baseUrl: 'https://fakestoreapi.com',
} as const;
```

Nenhuma URL absoluta da API deve ser repetida diretamente em services ou components.

---

# 3. Produtos
## 3.1 Modelo remoto de produto
O contrato deve refletir o schema oficial da API.

```ts
export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
```
---
## 3.2 Payload de criação de produto
A criação não deve exigir o campo `id`, pois ele é gerado pelo serviço remoto.

```ts
export type CreateProductPayload = Omit<ApiProduct, 'id'>;
```

Estrutura esperada:

```ts
const payload: CreateProductPayload = {
  title: 'Produto de exemplo',
  price: 99.9,
  description: 'Descrição do produto',
  category: 'electronics',
  image: 'https://example.com/product-image.png',
};
```

---

## 3.3 Payload de atualização de produto

A edição reutiliza os mesmos campos editáveis da criação.

```ts
export type UpdateProductPayload = CreateProductPayload;
```

O identificador deve ser recebido separadamente pelo service:

```ts
updateProduct(id: number, payload: UpdateProductPayload): Observable<ApiProduct>
```

---

## 3.4 Endpoints de produtos

| Operação | Método | Caminho | Utilização |
|---|---|---|---|
| Listar produtos | `GET` | `/products` | Carregamento inicial do painel e catálogo público |
| Buscar produto | `GET` | `/products/:id` | Edição, detalhes públicos e navegação direta |
| Criar produto | `POST` | `/products` | Cadastro administrativo |
| Atualizar produto | `PUT` | `/products/:id` | Edição administrativa |
| Excluir produto | `DELETE` | `/products/:id` | Exclusão administrativa |
| Listar categorias | `GET` | `/products/categories` | Filtros e opções do formulário |

---

## 3.5 Assinatura recomendada do service

```ts
export abstract class ProductApiService {
  abstract getProducts(): Observable<ApiProduct[]>;

  abstract getProductById(id: number): Observable<ApiProduct>;

  abstract createProduct(
    payload: CreateProductPayload,
  ): Observable<ApiProduct>;

  abstract updateProduct(
    id: number,
    payload: UpdateProductPayload,
  ): Observable<ApiProduct>;

  abstract deleteProduct(id: number): Observable<void>;

  abstract getCategories(): Observable<string[]>;
}
```

A implementação concreta pode utilizar `HttpClient`.

---

# 4. Carrinho remoto

## 4.1 Modelo remoto de carrinho

De acordo com o schema oficial, um carrinho remoto contém:

```ts
export interface ApiCart {
  id: number;
  userId: number;
  products: ApiProduct[];
}
```

Esse modelo deve ser utilizado para tipar respostas completas retornadas pela API.

---

## 4.2 Referência reduzida de produto

Os exemplos oficiais de criação e atualização de carrinho enviam produtos apenas com `id`.

Portanto, devemos definir um tipo específico para escrita:

```ts
export type ApiCartProductReference = Pick<ApiProduct, 'id'>;
```

Exemplo:

```ts
const product: ApiCartProductReference = {
  id: 1,
};
```

---

## 4.3 Payload de criação de carrinho remoto

```ts
export interface CreateCartPayload {
  userId: number;
  products: ApiCartProductReference[];
}
```

Exemplo:

```ts
const payload: CreateCartPayload = {
  userId: 1,
  products: [
    { id: 1 },
    { id: 3 },
  ],
};
```

---

## 4.4 Payload de atualização de carrinho remoto

```ts
export type UpdateCartPayload = CreateCartPayload;
```

---

## 4.5 Endpoints de carrinho

| Operação | Método | Caminho | Utilização |
|---|---|---|---|
| Listar carrinhos | `GET` | `/carts` | Fora do escopo obrigatório |
| Buscar carrinho | `GET` | `/carts/:id` | Fora do escopo obrigatório |
| Criar carrinho | `POST` | `/carts` | Envio opcional durante checkout simulado |
| Atualizar carrinho | `PUT` | `/carts/:id` | Fora do escopo inicial |
| Excluir carrinho | `DELETE` | `/carts/:id` | Fora do escopo inicial |

---

## 4.6 Assinatura opcional do service

A criação do service de carrinho deve ocorrer somente na spec de checkout.

```ts
export abstract class CartApiService {
  abstract createCart(payload: CreateCartPayload): Observable<ApiCart>;
}
```

Os demais métodos não devem ser implementados antecipadamente sem necessidade real.

---

# 5. Carrinho local da loja pública

## 5.1 Motivo da separação

O carrinho exibido na loja pública possui necessidades próprias de interface:

- quantidade de cada item;
- subtotal por produto;
- total de unidades;
- valor total;
- alteração de quantidade;
- remoção de item;
- persistência durante navegação e refresh;
- checkout simulado.

Esses dados não devem ser misturados com o contrato remoto.

---

## 5.2 Item local do carrinho

```ts
export interface StoreCartItem {
  product: ApiProduct;
  quantity: number;
}
```

---

## 5.3 Estado local do carrinho

```ts
export interface StoreCartState {
  items: StoreCartItem[];
}
```

Valores derivados devem ser calculados com `computed()`:

```ts
readonly totalItems = computed(() =>
  this.items().reduce((total, item) => total + item.quantity, 0),
);

readonly totalAmount = computed(() =>
  this.items().reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  ),
);
```

---

## 5.4 Persistência local

O carrinho público deve ser persistido em `localStorage`.

Chave recomendada:

```ts
export const STORE_CART_STORAGE_KEY = 'storefront-cart';
```

Objetivos:

- preservar o carrinho após refresh;
- manter a experiência funcional mesmo quando a API não persistir mutações;
- desacoplar a interface pública das limitações do serviço remoto.

O acesso ao storage deve ficar encapsulado no store ou em um adapter dedicado.

Components não devem acessar `localStorage` diretamente.

---

# 6. Checkout simulado

## 6.1 Objetivo

O checkout público é um diferencial visual e funcional, não uma transação comercial real.

Não haverá:

- pagamento real;
- integração com gateway;
- cálculo de frete real;
- autenticação;
- cadastro obrigatório;
- persistência garantida no backend;
- emissão de pedido real.

---

## 6.2 Dados mínimos do comprador

O formulário pode utilizar:

```ts
export interface CheckoutCustomerData {
  name: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}
```

Esses dados existem apenas para simular a experiência do checkout.

Não enviar informações pessoais para a Fake Store API, pois o endpoint remoto de carrinho não exige esses campos.

---

## 6.3 Resumo local da compra

```ts
export interface CheckoutSummary {
  items: StoreCartItem[];
  totalItems: number;
  totalAmount: number;
  customer: CheckoutCustomerData;
}
```

---

## 6.4 Comportamento esperado no checkout

1. O usuário adiciona produtos ao carrinho.
2. O estado local é persistido em `localStorage`.
3. O usuário preenche os dados mínimos do checkout.
4. A aplicação valida o formulário reativo.
5. Opcionalmente, a aplicação envia `POST /carts`.
6. Após resposta bem-sucedida, a aplicação:
   - limpa o carrinho local;
   - navega para `/store/order-success`;
   - exibe confirmação simulada.
7. Em caso de falha:
   - preserva o carrinho;
   - preserva os dados digitados;
   - exibe uma mensagem de erro recuperável.

---

# 7. Reconciliação do estado local

## 7.1 Produtos administrativos

A Fake Store API é destinada a testes e prototipação.

As mutações devem ser demonstradas por meio de requisições HTTP reais, mas o painel deve reconciliar respostas bem-sucedidas em memória para que a sessão atual reflita cada ação.

Comportamento esperado:

- após criação bem-sucedida: adicionar o produto retornado ao estado local;
- após atualização bem-sucedida: substituir o produto correspondente no estado local;
- após exclusão bem-sucedida: remover o produto correspondente do estado local;
- após falha de mutação: preservar o estado local anterior e exibir mensagem de erro.

---

## 7.2 Catálogo público

Durante a mesma sessão, o catálogo público deve reutilizar o estado reconciliado da aplicação sempre que possível.

Objetivo:

- um produto criado no painel aparece no preview público;
- um produto editado apresenta os novos dados;
- um produto excluído deixa de aparecer na loja;
- o usuário consegue visualizar imediatamente o impacto da ação administrativa.

Caso a página seja recarregada, os dados podem retornar ao estado original da API.

Essa limitação deve ser documentada no README.

---

## 7.3 Carrinho público

O carrinho público utiliza persistência própria em `localStorage`.

Isso permite preservar os itens após refresh, independentemente da ausência de persistência garantida na API remota.

---

# 8. Erros HTTP

## 8.1 Contrato normalizado

Normalizar erros antes de expô-los às pages.

```ts
export interface NormalizedHttpError {
  status: number;
  message: string;
  recoverable: boolean;
}
```

---

## 8.2 Mensagens recomendadas

| Cenário | Mensagem |
|---|---|
| Falha de rede | Não foi possível conectar ao serviço. Tente novamente. |
| Falha ao carregar produtos | Não foi possível carregar os produtos. |
| Falha ao salvar produto | Não foi possível salvar o produto. Seus dados foram preservados. |
| Falha ao excluir produto | Não foi possível excluir o produto. Tente novamente. |
| Falha ao finalizar checkout | Não foi possível concluir a simulação. Seu carrinho foi preservado. |
| Erro desconhecido | Ocorreu um erro inesperado. Tente novamente. |

---

## 8.3 Regras de tratamento

- Services devem trabalhar com contratos tipados.
- Erros devem ser normalizados antes de chegar às pages.
- Formulários não devem perder dados após falha.
- Mutações com erro não devem alterar o estado local.
- O carrinho não deve ser limpo antes da confirmação positiva do checkout.
- Components visuais não devem conter regras de integração HTTP.

---

# 9. Contrato de testes HTTP

## 9.1 Produtos

Os testes do service de produtos devem validar:

- método HTTP;
- endpoint;
- payload;
- tipo esperado da resposta;
- tratamento de erro;
- listagem de categorias.

Cenários mínimos:

```text
GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id
GET    /products/categories
```

---

# 10. Limites de escopo

## Incluído

- CRUD administrativo de produtos;
- listagem de categorias;
- preview público da loja;
- catálogo;
- detalhes de produto;
- carrinho local;
- checkout simulado;
- integração opcional com `POST /carts`;
- persistência local do carrinho;
- tratamento padronizado de erros.

## Fora do escopo

- autenticação;
- cadastro de usuário;
- gerenciamento de usuários;
- guards;
- interceptores de token;
- pagamentos reais;
- histórico real de pedidos;
- persistência remota garantida;
- backend próprio;
- gerenciamento administrativo de carrinhos;
- gerenciamento de estoque;
- frete real.

---

# 11. Tipos consolidados

```ts
export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export type CreateProductPayload = Omit<ApiProduct, 'id'>;

export type UpdateProductPayload = CreateProductPayload;

export type ApiCartProductReference = Pick<ApiProduct, 'id'>;

export interface ApiCart {
  id: number;
  userId: number;
  products: ApiProduct[];
}

export interface CreateCartPayload {
  userId: number;
  products: ApiCartProductReference[];
}

export type UpdateCartPayload = CreateCartPayload;

export interface StoreCartItem {
  product: ApiProduct;
  quantity: number;
}

export interface StoreCartState {
  items: StoreCartItem[];
}

export interface CheckoutCustomerData {
  name: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface CheckoutSummary {
  items: StoreCartItem[];
  totalItems: number;
  totalAmount: number;
  customer: CheckoutCustomerData;
}

export interface NormalizedHttpError {
  status: number;
  message: string;
  recoverable: boolean;
}
```