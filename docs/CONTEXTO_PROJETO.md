# Contexto do projeto

## 1. Origem

Este projeto será desenvolvido por um Frontend Angular.

A aplicação será em Angular 21 integrada à Fake Store API, contemplando um CRUD completo de produtos:

- criação;
- listagem;
- atualização;
- exclusão.

A avaliação prioriza qualidade de execução, organização, decisões técnicas coerentes e capacidade de definir prioridades.

---

## 2. Objetivo da solução

Construir uma aplicação frontend simples, moderna e confiável para gerenciamento de catálogo de produtos.

A solução será apresentada como uma pequena plataforma de catálogo digital composta por dois contextos:

1. **Painel administrativo**, responsável pela gestão dos produtos.
2. **Loja pública**, responsável pela visualização do catálogo pelo consumidor final.

O painel administrativo representa o escopo obrigatório do desafio.

A loja pública representa um diferencial incremental, desenvolvido somente após a conclusão e validação do CRUD principal.

---

## 3. Narrativa do produto

A aplicação simula o gerenciamento de uma loja digital.

No painel administrativo, o usuário pode cadastrar, consultar, editar e excluir produtos.

A partir do painel, o usuário pode acessar a ação:

```text
Visualizar loja
```

Essa ação abre uma versão pública do catálogo, permitindo observar como os produtos gerenciados aparecem para o consumidor final.

Essa abordagem adiciona contexto às operações CRUD sem alterar o foco principal do desafio.

---

## 4. Objetivos técnicos

O projeto deve demonstrar:

- estrutura e organização claras;
- uso moderno do Angular 21;
- arquitetura orientada a features;
- código reutilizável e fácil de manter;
- gerenciamento previsível de estados assíncronos;
- integração tipada com API;
- uso adequado de Signals;
- formulários reativos tipados;
- validações consistentes;
- tratamento padronizado de erros;
- acessibilidade;
- responsividade;
- testes unitários relevantes;
- README objetivo com justificativas técnicas;
- documentação como memória entre sessões e agentes.

---

## 5. Escopo obrigatório — P0

O escopo obrigatório deve ser concluído antes da implementação de qualquer diferencial.

### Painel administrativo

- Listar produtos.
- Buscar produtos por título.
- Filtrar produtos por categoria.
- Criar produto.
- Editar produto.
- Excluir produto mediante confirmação.
- Exibir estados de carregamento.
- Exibir estado de erro com ação recuperável quando aplicável.
- Exibir estado de lista vazia.
- Validar formulários.
- Preservar os dados digitados quando ocorrer falha de salvamento.
- Atualizar o estado local após mutações bem-sucedidas.
- Aplicar layout responsivo.
- Implementar testes unitários para os fluxos críticos.
- Documentar instalação, execução, decisões e limitações.

---

## 6. Diferencial planejado — P1

A loja pública será implementada somente após a conclusão do escopo obrigatório.

### Loja pública

- Disponibilizar rota pública para visualização do catálogo.
- Exibir produtos em grid responsivo.
- Permitir busca por título.
- Permitir filtro por categoria.
- Exibir detalhes de um produto.
- Reutilizar os produtos reconciliados localmente durante a sessão atual.
- Disponibilizar acesso pelo botão `Visualizar loja` no painel administrativo.
- Aplicar identidade visual coerente com o projeto.

Rotas previstas (P1):

```text
/store
/store/products/:id
```

Rotas administrativas previstas (P0):

```text
/admin
/admin/products
/admin/products/new
/admin/products/:id/edit
```

Objetivo do diferencial:

- demonstrar reutilização de contratos e estado;
- mostrar o impacto das ações administrativas;
- enriquecer a narrativa do produto;
- melhorar a apresentação visual da entrega;
- preservar baixa complexidade.

---

## 7. Evolução opcional — P2

As funcionalidades abaixo poderão ser consideradas somente se:

- o CRUD estiver completo;
- os testes críticos estiverem passando;
- o build de produção estiver validado;
- a documentação estiver atualizada;
- não houver riscos para o prazo.

### Carrinho local

- Adicionar produto ao carrinho.
- Alterar quantidade.
- Remover item.
- Calcular subtotal e total.
- Persistir o carrinho em `localStorage`.

### Checkout simulado

- Exibir resumo da compra.
- Coletar dados mínimos do comprador.
- Exibir aviso de ambiente demonstrativo.
- Enviar opcionalmente uma requisição real para `POST /carts`.
- Preservar o carrinho em caso de falha.
- Limpar o carrinho após resposta bem-sucedida.
- Exibir página de sucesso.

Rotas opcionais (P2):

```text
/store/cart
/store/checkout
/store/order-success
```

Essas funcionalidades não fazem parte do requisito obrigatório e não devem comprometer a qualidade do núcleo principal.

---

## 8. Fora do escopo

Não implementar:

- autenticação;
- login;
- cadastro de usuários;
- `AuthGuard` ou guards de autenticação;
- interceptores de token;
- gerenciamento de usuários;
- backend próprio;
- pagamento real;
- integração com gateway de pagamento;
- upload real de imagens;
- cálculo real de frete;
- gerenciamento de estoque;
- persistência remota garantida;
- paginação server-side;
- internacionalização;
- SSR;
- arquitetura de micro-frontends;
- NgRx;
- biblioteca global complexa de estado;
- múltiplos temas;
- abstrações antecipadas sem uso concreto.

---

## 9. Restrição da API

A Fake Store API é destinada a testes e prototipação.

As operações de criação, atualização e exclusão devem utilizar requisições HTTP reais, mas as alterações não possuem persistência remota garantida.

Por isso, após cada resposta bem-sucedida, a aplicação deve reconciliar a alteração no estado local da feature.

Comportamento esperado:

- após criação: adicionar o produto retornado ao estado local;
- após atualização: substituir o produto correspondente;
- após exclusão: remover o produto correspondente;
- após falha: preservar o estado anterior e informar o erro ao usuário.

Durante a mesma sessão, a loja pública deve refletir o estado local reconciliado sempre que possível.

Após recarregar a página, os dados podem retornar ao estado original da API.

Essa limitação deve ser explicada claramente no README final.

---

## 10. Identidade visual

A interface deve utilizar uma linguagem visual inspirada na identidade da Starian.

Características esperadas:

- fundo escuro;
- superfícies discretas;
- tipografia clara;
- visual tecnológico;
- bordas finas;
- brilhos controlados;
- azul para ações principais;
- verde para sucesso;
- vermelho para exclusão;
- laranja para alertas;
- gradiente multicolorido utilizado somente como detalhe decorativo.

O painel administrativo deve priorizar legibilidade e eficiência.

A loja pública pode explorar a identidade visual de forma um pouco mais expressiva, sem comprometer usabilidade ou acessibilidade.

As regras detalhadas estão documentadas em:

```text
docs/SISTEMA_UI.md
docs/STYLES.md
```

---

## 11. Arquitetura de estilos

A aplicação utilizará SCSS de forma simples e enxuta.

Estrutura global:

```text
src/styles/
├── _variables.scss
├── _mixins.scss
├── _theme.scss
├── _reset.scss
└── _index.scss
```

Princípios:

- utilizar `@use` e `@forward`;
- não utilizar `@import`;
- centralizar tokens globais;
- exportar CSS custom properties;
- criar mixins apenas quando houver reutilização real;
- manter estilos específicos próximos ao component;
- evitar valores mágicos repetidos;
- evitar abstrações prematuras.

---

## 12. Princípios de execução

- Priorizar qualidade sobre quantidade de telas.
- Resolver o problema com a menor complexidade adequada.
- Concluir o escopo P0 antes de iniciar diferenciais.
- Não adicionar funcionalidades opcionais silenciosamente.
- Não implementar tecnologia somente para demonstrar conhecimento.
- Manter o código fácil de revisar em poucos minutos.
- Preservar acessibilidade e responsividade.
- Utilizar documentação como memória entre sessões e agentes.
- Atualizar o estado do projeto ao final de cada sessão.
- Validar lint, testes e build antes de considerar uma etapa concluída.

---

## 13. Critérios de sucesso do escopo obrigatório

O núcleo principal será considerado bem-sucedido quando:

- todas as operações CRUD estiverem visivelmente demonstradas;
- ações assíncronas comunicarem estados claros;
- formulários inválidos não puderem ser submetidos;
- dados digitados forem preservados em caso de falha;
- erros forem tratados de forma segura;
- mutações bem-sucedidas atualizarem o estado local;
- comportamentos críticos possuírem testes unitários;
- a interface estiver responsiva;
- a organização do código puder ser compreendida rapidamente;
- o README explicar abordagem, decisões e limitações;
- lint, testes e build de produção passarem.

---

## 14. Critérios de sucesso da loja pública

A loja pública será considerada concluída quando:

- estiver acessível por rota própria;
- puder ser aberta pelo painel administrativo;
- listar os produtos em grid responsivo;
- permitir busca e filtro;
- exibir detalhes do produto;
- refletir alterações administrativas reconciliadas na sessão atual;
- preservar identidade visual consistente;
- não comprometer o escopo obrigatório.

---

## 15. Implementação incremental da estrutura

A estrutura completa documentada em `docs/ARQUITETURA.md` descreve o destino arquitetural, mas a implementação deve ser incremental:

- **P0:** criar somente `core`, `shared/ui` quando necessário, `features/catalog` (domínio compartilhado) e `features/admin/products`;
- **P1:** criar `features/store/catalog` e `features/store/product-details` somente após conclusão validada do CRUD;
- **P2:** criar `features/store/cart` e `features/store/checkout` somente se houver tempo seguro;
- **não criar pastas vazias antecipadamente.**

---

## 16. Priorização

A ordem obrigatória de execução é:

```text
P0 — Fundação técnica
↓
P0 — CRUD administrativo
↓
P0 — Testes, acessibilidade, README e validações
↓
P1 — Loja pública
↓
P2 — Carrinho local e checkout simulado, somente se houver tempo seguro
```

Nenhuma funcionalidade P1 ou P2 deve atrasar a entrega validada do escopo obrigatório.
---