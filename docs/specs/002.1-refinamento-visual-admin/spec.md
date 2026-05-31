# Spec 002.1 — Refinamento visual do painel administrativo

## Status

**Concluída** (2026-05-31).

## Contexto

A Spec 002 entregou o CRUD administrativo completo e funcional:

- listagem com busca e filtro;
- criação, edição e exclusão;
- validações e formulário reativo;
- estados assíncronos e tratamento de erros;
- reconciliação local;
- testes unitários, lint e build validados.

A interface cumpre os requisitos de negócio, porém permanece visualmente básica: hierarquia tipográfica fraca, ausência de identidade Starian consistente, tabela e cards com acabamento mínimo, sidebar com logo placeholder inline e pouco destaque nos elementos de navegação e contexto.

Parte do baseline técnico de imagens (`ProductImage`, fallback local) pode já existir da entrega final da Spec 002 (ADR-016). Esta spec trata o **acabamento visual controlado** desses elementos e das demais superfícies administrativas, **sem alterar comportamento de negócio**.

## Objetivo

Transformar o painel administrativo de uma interface funcional básica em uma entrega visualmente mais consistente, moderna e alinhada à identidade inspirada na Starian.

A melhoria deve permanecer:

- enxuta;
- acessível (WCAG AA);
- responsiva;
- fácil de revisar;
- sem dependências externas;
- sem abstrações prematuras;
- sem alterar fluxos já validados.

## Problema visual atual

| Área | Situação atual |
|---|---|
| Logo | SVG geométrico inline placeholder, sem símbolo definitivo da marca |
| Sidebar | Hierarquia plana; ausência de label secundário; sem detalhe decorativo da marca |
| Header da listagem | Título e subtítulo genéricos; sem contador contextual; espaçamento básico |
| Tabela | Espaçamento vertical apertado; hover discreto; categoria em texto simples; ações pouco diferenciadas |
| Cards mobile | Hierarquia visual fraca; categoria sem destaque; ações similares à versão desktop sem refinamento |
| Dialog | Funcional, porém contraste e espaçamento podem ser melhorados |
| Formulário | Preview presente, mas sem destaque visual suficiente; placeholders auxiliares genéricos |
| Imagens | Fallback técnico possível, porém acabamento visual do placeholder e integração podem ser refinados |

## Escopo

### Fallback de imagem

- Garantir `public/images/product-placeholder.svg` coerente com a identidade visual (fundo neutro, borda discreta, ícone abstrato, sem texto).
- Garantir componente compartilhado `ProductImage` em `shared/ui/product-image/`.
- Substituir ou validar uso em tabela, cards e preview do formulário.
- Fallback local em falha de URL externa; preservar `alt`, dimensões, `loading` e acessibilidade.
- Respeitar ADR-014 e ADR-016 (`<img>` nativo; sem `NgOptimizedImage` para URLs dinâmicas).

### Logo

- Criar `src/assets/starian-catalog-symbol.svg` com cubo e estrela (identidade Starian).
- Fundo transparente.
- Substituir placeholder inline da sidebar.
- Preservar leitura simples em tamanho reduzido.

### Sidebar

- Melhorar hierarquia visual da marca (`Starian` + label secundário `Catalog`).
- Incluir linha fina decorativa com gradiente inspirado na marca (detalhe, não poluição visual).
- Melhorar estado ativo do item de navegação.
- Manter botão `Visualizar loja` desabilitado até a Spec 003.
- Não adicionar menus novos.

### Header da listagem

- Melhorar título e subtítulo.
- Incluir contexto visual discreto (detalhe decorativo ou separador sutil).
- Exibir contador de produtos cadastrados (estado local reconciliado da sessão).
- Melhorar espaçamento e alinhamento com CTA `Novo produto`.

### Tabela (desktop)

- Melhorar espaçamento vertical das linhas.
- Melhorar hover de linha (sutil, sem depender exclusivamente de cor).
- Alinhar coluna de preço.
- Exibir categoria como chip visual.
- Refinar ações `Editar` e `Excluir` (hierarquia clara; destrutiva identificável).
- Preservar HTML semântico (`table`, `caption`, `th scope`).

### Cards mobile

- Melhorar hierarquia tipográfica.
- Aplicar chips de categoria.
- Refinar ações e legibilidade.
- Manter layout compacto.

### Dialog de exclusão

- Melhorar contraste de texto e superfície.
- Ajustar padding e borda sutil.
- Preservar foco, Escape, `role="alert"` em erros e demais comportamentos já implementados.

### Formulário

- Melhorar espaçamento entre campos e grupos.
- Destacar área de preview (superfície, borda ou hierarquia).
- Placeholder visual consistente quando não houver URL de imagem.
- Melhorar textos auxiliares onde aplicável.
- Preservar validações e comportamento atual (Reactive Forms).

### Responsividade

Revisar manualmente em:

| Largura | Contexto |
|---:|---|
| 375px | Mobile |
| 768px | Tablet |
| 1280px | Desktop |

### Acessibilidade

Validar e preservar:

- foco visível;
- contraste WCAG AA;
- labels associados;
- mensagens de erro com `aria-invalid` / `aria-describedby`;
- navegação por teclado;
- dialog acessível;
- `alt` em imagens;
- ausência de overflow horizontal;
- ausência de interação crítica exclusiva por hover.

## Fora do escopo

Registrar explicitamente — **não implementar nesta spec**:

- loja pública;
- rota `/store`;
- carrinho;
- checkout;
- ordenação;
- paginação;
- autenticação;
- novos menus ou seções;
- dashboard com métricas;
- gráficos;
- toast service;
- snackbar;
- biblioteca externa de UI;
- Angular Material;
- CDK;
- animações pesadas ou transições complexas;
- redesign completo do produto;
- alteração de regras de negócio;
- alteração da arquitetura existente;
- novos endpoints ou mutações HTTP;
- mudanças no store além do necessário para exibir contador (leitura de estado existente).

## Estrutura prevista da implementação

Somente os artefatos abaixo, além de ajustes locais de SCSS/HTML em componentes existentes:

```text
public/images/
└── product-placeholder.svg

src/assets/
└── starian-catalog-symbol.svg

src/app/shared/ui/
└── product-image/
    ├── product-image.ts
    ├── product-image.html
    ├── product-image.scss
    └── product-image.spec.ts
```

Ajustes locais permitidos em:

```text
src/app/core/layout/admin-layout/*
src/app/features/admin/products/pages/products-list-page/*
src/app/features/admin/products/components/product-table/*
src/app/features/admin/products/components/product-card-list/*
src/app/features/admin/products/components/product-form/*
src/app/shared/ui/confirm-dialog/*
```

Não criar pastas vazias. Não mover lógica de negócio para `shared/ui`.

## Critérios de aceite

### Identidade e layout

- [ ] Logo definitivo aplicado na sidebar com fundo transparente.
- [ ] Sidebar exibe `Starian`, label `Catalog`, detalhe decorativo e item ativo refinado.
- [ ] Botão `Visualizar loja` permanece desabilitado com orientação clara.

### Listagem

- [ ] Header exibe título, subtítulo, contador de produtos e CTA `Novo produto` com hierarquia visual melhorada.
- [ ] Tabela desktop com espaçamento, hover, preço alinhado, chips de categoria e ações refinadas.
- [ ] Cards mobile com hierarquia, chips e ações legíveis.

### Imagens

- [ ] `ProductImage` utilizado em tabela, cards e preview.
- [ ] Fallback local aplicado em URL quebrada sem loop infinito.
- [ ] `alt`, dimensões e `loading` preservados.

### Formulário e dialog

- [ ] Preview destacado visualmente; placeholder consistente sem URL.
- [ ] Dialog com contraste, padding e borda refinados; comportamento inalterado.

### Qualidade

- [ ] Layout validado em 375px, 768px e 1280px sem overflow horizontal crítico.
- [ ] Acessibilidade mínima preservada ou melhorada.
- [ ] Nenhuma regra de negócio ou fluxo CRUD alterado sem necessidade comprovada.
- [ ] Testes relevantes passam; lint e build passam.
- [ ] `review.md` preenchido; `docs/ESTADO_ATUAL.md` atualizado.

## Edge cases

- URL de imagem inválida ou inacessível: exibir fallback local; não quebrar layout.
- Fallback local indisponível: evitar loop no `ProductImage`; manter `alt`.
- Título ou categoria muito longos: truncar visualmente sem quebrar layout (line-clamp ou equivalente já existente).
- Lista vazia: contador exibe zero; estados vazio existentes permanecem.
- Lista filtrada: contador reflete produtos cadastrados no estado local (total da sessão), não apenas filtrados — salvo decisão explícita documentada em `review.md`.
- Produto em exclusão: estados de loading por item preservados após refinamento visual.
- Dialog em viewport estreita: botões permanecem acionáveis e legíveis.
- Preferência `prefers-reduced-motion`: não introduzir animações que ignorem redução de movimento.

## Requisitos de acessibilidade

- Manter headings em ordem lógica.
- Preservar nomes acessíveis em botões de ação (`Editar`, `Excluir` com nome do produto).
- Chips de categoria devem permanecer legíveis; cor não pode ser único indicador de estado crítico.
- Contraste mínimo WCAG AA para texto, bordas e estados de foco.
- Dialog: foco inicial previsível, Escape para fechar, erro com `role="alert"`.
- Imagens: `alt` descritivo obrigatório via `ProductImage`.

## Requisitos responsivos

- Mobile (375px): sidebar empilhada ou compacta sem comprimir conteúdo principal; cards visíveis; filtros utilizáveis; dialog cabe na tela.
- Tablet (768px): transição coerente entre cards e tabela conforme breakpoint existente.
- Desktop (1280px): tabela legível; header e sidebar com hierarquia clara; largura máxima confortável do conteúdo preservada.

## Definition of Done

A spec estará concluída quando:

1. Todos os critérios de aceite aplicáveis estiverem atendidos.
2. Nenhum item do escopo tiver expandido silenciosamente para loja pública ou novos fluxos.
3. Comportamento CRUD validado na Spec 002 permanecer intacto.
4. `npm run lint`, `npm run test -- --watch=false` e `npm run build` passarem.
5. Testes de `ProductImage` e demais alvos afetados estiverem atualizados quando houver mudança relevante.
6. `tasks.md` marcado; `review.md` preenchido; `docs/ESTADO_ATUAL.md` e `docs/DECISOES.md` atualizados se houver nova decisão visual registrável.
7. README atualizado somente se a descrição visual ou assets públicos mudarem de forma relevante para quem executa o projeto.

## Referências

- `docs/SISTEMA_UI.md`
- `docs/STYLES.md`
- `docs/DECISOES.md` (ADR-013, ADR-014, ADR-015, ADR-016)
- `docs/specs/002-crud-produtos/review.md`
