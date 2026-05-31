# Decisões técnicas

Utilize este arquivo como um registro leve de decisões arquiteturais.
Adicione uma nova entrada quando uma decisão alterar a direção da implementação ou evitar dúvidas futuras.

---

## ADR-001 — Utilizar cenário de painel administrativo de produtos
**Status:** Aceita  
**Contexto:** O desafio permite liberdade para definir o fluxo, mas exige demonstração completa de CRUD.  
**Decisão:** Construir um painel administrativo enxuto para gestão de produtos.  
**Justificativa:** O cenário torna as operações coerentes e mantém o foco na qualidade de execução em vez de funcionalidades paralelas de e-commerce.

## ADR-002 — Organizar código por feature
**Status:** Aceita  
**Decisão:** Manter pages, UI e acesso a dados específicos de produtos administrativos em `features/admin/products`. A loja pública evoluirá em `features/store/*` conforme priorização P1/P2.  
**Justificativa:** A organização por domínio facilita navegação e manutenção sem criar camadas desnecessárias. A implementação permanece incremental, sem pastas vazias antecipadas.

## ADR-003 — Utilizar componentes standalone e rotas lazy-loaded
**Status:** Aceita  
**Decisão:** Utilizar componentes standalone do Angular e carregar `features/admin` e, posteriormente, `features/store` sob demanda.  
**Justificativa:** A abordagem está alinhada ao Angular moderno e demonstra separação consciente de rotas.

## ADR-004 — Utilizar Signals para estado da feature e RxJS para HTTP
**Status:** Aceita  
**Decisão:** Armazenar o estado consumido pelas telas em um serviço leve baseado em Signals, mantendo interações HTTP como fluxos Observable do RxJS.  
**Justificativa:** A combinação é proporcional ao tamanho do projeto e demonstra gerenciamento moderno de estado sem biblioteca global pesada.

## ADR-005 — Não utilizar NgRx
**Status:** Aceita  
**Decisão:** Não introduzir NgRx.  
**Justificativa:** O projeto possui uma única feature pequena. NgRx aumentaria a quantidade de arquivos e a complexidade sem benefício proporcional.

## ADR-006 — Reutilizar um único formulário de produto
**Status:** Aceita  
**Decisão:** Criação e edição devem utilizar o mesmo componente de formulário reativo.  
**Justificativa:** Evita duplicação e facilita testes consistentes de validação.

## ADR-007 — Utilizar interceptor HTTP funcional
**Status:** Aceita  
**Decisão:** Configurar tratamento centralizado de erros com interceptor funcional.  
**Justificativa:** Garante normalização previsível e mantém detalhes de transporte fora das páginas.

## ADR-008 — Reconciliar mutações no estado local
**Status:** Aceita  
**Contexto:** A Fake Store API retorna respostas simuladas para mutações, mas não persiste as alterações no servidor.  
**Decisão:** Após resposta HTTP bem-sucedida, atualizar localmente o estado da feature (inserir, substituir ou remover itens) sem disparar novo `GET /products`. A listagem só é buscada remotamente na primeira carga da sessão (`ensureProductsLoaded`) ou quando o usuário aciona retry explícito (`loadProducts`).  
**Justificativa:** Permite demonstrar o CRUD completo de forma coerente durante a sessão atual. Refazer a listagem após criar ou editar sobrescreveria o estado reconciliado com dados remotos desatualizados. Recarregar a página do navegador continua sendo o reset esperado da sessão.

## ADR-009 — Utilizar component harnesses seletivamente
**Status:** Aceita  
**Decisão:** Preferir harnesses prontos do Angular Material quando aplicável e criar harness customizado somente se houver ganho claro de estabilidade nos testes.  
**Justificativa:** Harnesses reduzem fragilidade dos testes, mas criar harness para cada componente seria exagero para o escopo.

## ADR-010 — Utilizar documentação como memória entre sessões
**Status:** Aceita  
**Decisão:** Manter especificações versionadas, tasks verificáveis e um arquivo `docs/ESTADO_ATUAL.md` atualizado ao final de cada sessão.  
**Justificativa:** Permite retomar o trabalho com consistência entre sessões e agentes sem depender do histórico da conversa.

## ADR-011 — Não implementar autenticação
**Status:** Aceita  
**Decisão:** Não implementar login, cadastro, `AuthGuard` ou interceptor de token.  
**Justificativa:** A autenticação não faz parte dos requisitos do desafio e adicionaria complexidade sem representar uma regra real do sistema. O tempo disponível será direcionado à qualidade do CRUD, experiência da loja pública, tratamento de estados assíncronos, testes e documentação.


## ADR-012 — Separar carrinho remoto e carrinho local
**Status:** Aceita  
**Decisão:** A Fake Store API oferece endpoints de carrinho, mas o modelo remoto não contempla todas as necessidades da experiência pública, como quantidade, subtotal e persistência após refresh.  
**Justificativa:**O carrinho público utilizará estado local com Signals e localStorage. A integração com POST /carts será opcional e utilizada somente como demonstração complementar durante o checkout simulado.  

## ADR-013 — Não utilizar biblioteca de UI
**Status:** Aceita  
**Decisão:** Não utilizar biblioteca de UI.
Os componentes visuais serão implementados com:
Angular,HTML semântico,SCSS local, tokens globais, mixins reutilizáveis apenas quando necessário, acessibilidade WCAG AA.  
**Justificativa:**Bibliotecas como Angular Material poderiam acelerar componentes básicos, mas também adicionariam dependências, estilos próprios e necessidade de customização para adequação à identidade visual inspirada na Starian.ado.  

## ADR-014 — Imagens de produto com `<img>` nativo
**Status:** Aceita  
**Contexto:** A listagem administrativa exibe imagens com URLs externas dinâmicas retornadas pela Fake Store API.  
**Decisão:** Não utilizar `NgOptimizedImage` para thumbnails de produto nesta etapa. Utilizar `<img>` com `src`, `alt`, `loading="lazy"` e dimensões fixas.  
**Justificativa:** `NgOptimizedImage` é mais adequado para assets estáticos conhecidos no build ou domínios previamente configurados. URLs dinâmicas de terceiros exigiriam `ngSrcset`/`sizes` e política de domínios (`IMAGE_CONFIG`) sem ganho proporcional para thumbnails administrativos pequenos.

## ADR-015 — Utilizar dialog nativo para confirmação de exclusão
**Status:** Aceita  
**Decisão:** Utilizar `<dialog>` nativo com `showModal()` no componente compartilhado `ConfirmDialog`, sem biblioteca externa de UI.  
**Justificativa:** Mantém o escopo alinhado à ADR-013, reduz dependências, preserva HTML semântico e comportamento modal nativo, complementado por labels, foco visível, tratamento de Escape e erro recuperável dentro do próprio dialog.

## ADR-016 — Utilizar componente compartilhado para imagens de produtos
**Status:** Aceita  
**Contexto:** Imagens de produto aparecem na tabela desktop, nos cards mobile e no preview do formulário.  
**Decisão:** Extrair `ProductImage` em `shared/ui` com fallback local (`/images/product-placeholder.svg`) via evento `error`, sincronização de `src` com `linkedSignal` e dimensões/`alt` preservados.  
**Justificativa:** Evita duplicação de lógica de fallback, padroniza comportamento acessível em múltiplos contextos e prepara reutilização futura na loja pública, mantendo ADR-014 (`<img>` nativo, sem `NgOptimizedImage` para URLs dinâmicas externas).

## ADR-017 — Identidade visual administrativa com assets locais e chip de categoria
**Status:** Aceita  
**Contexto:** A Spec 002.1 exige logo definitivo, acabamento Starian e chips de categoria sem biblioteca externa.  
**Decisão:** Manter o símbolo da marca em `public/images/starian-catalog-symbol.svg` e extrair estilo de chip de categoria para partial SCSS local em `features/admin/products/components/_category-chip.scss`, reutilizado por lista, cards e preview.  
**Justificativa:** Centraliza identidade da marca em asset único, evita SVG inline duplicado e padroniza chips com reutilização concreta dentro da feature, sem antecipar design system global.

## ADR-018 — Utilizar visualização moderna em lista e cards
**Status:** Aceita  
**Contexto:** A visualização em tabela administrativa tradicional distancia o painel de uma experiência de catálogo/marketplace.  
**Decisão:** Substituir `<table>` por lista semântica (`ProductList`) e manter grid de cards (`ProductCardList`), com alternância local via `ProductsViewMode` na página de listagem.  
**Justificativa:** Aproxima o painel administrativo de marketplace, melhora leitura e responsividade, preserva simplicidade e evita dependências externas.

## ADR-019 — Utilizar toast local simples baseado em Signals
**Status:** Aceita  
**Contexto:** Mutações CRUD precisam de feedback claro após sucesso ou falha, sem adicionar biblioteca de UI.  
**Decisão:** Criar `ToastService` com Signal readonly e `ToastContainer` no `AdminLayout`, exibindo um toast por vez com auto-dismiss e fechamento manual.  
**Justificativa:** Feedback acessível e previsível, implementação pequena, sem fila complexa e alinhada à ADR-013.

## ADR-020 — Manter sidebar fixa com scroll isolado no conteúdo principal
**Status:** Aceita  
**Contexto:** A sidebar rolava junto com o conteúdo, reduzindo contexto de navegação.  
**Decisão:** Fixar layout administrativo em `100vh` com `overflow: hidden` no shell e `overflow-y: auto` somente em `admin-layout__main`.  
**Justificativa:** Melhora navegação, evita deslocamento desnecessário da sidebar e segue padrão de dashboards modernos.

## ADR-021 — Design system administrativo via mixins SCSS em `_controls.scss`
**Status:** Aceita  
**Contexto:** A Spec 002.1 padronizou identidade Starian, mas botões, inputs e superfícies permaneciam duplicados com tamanhos e sombras inconsistentes.  
**Decisão:** Centralizar padrões visuais reutilizáveis em `src/styles/_controls.scss` (botões primary/secondary/ghost/danger, inputs, segmented control, page header, motion) e refinar tokens globais em `_variables.scss` / `_theme.scss`. Components consomem mixins via BEM local, sem componente Angular genérico de botão.  
**Justificativa:** Repetição concreta em 10+ arquivos SCSS; mixins resolvem inconsistência sem abstração prematura de UI framework; alinha o painel a estética premium minimalista (Vercel/Linear) preservando assinatura Starian discreta.

## ADR-022 — Loja pública com `CatalogStoreService` e reuso de `ProductStoreService`
**Status:** Aceita  
**Contexto:** A Spec 003 exige catálogo público com filtros próprios, mas produtos devem refletir mutações administrativas reconciliadas na sessão atual.  
**Decisão:** Reutilizar `ProductStoreService` (singleton) como fonte de produtos reconciliados e criar `CatalogStoreService` em `features/store/catalog/data-access` apenas para estado de UI do catálogo (busca e categoria). Rotas `/store` e `/store/products/:id` com lazy loading; layout público em `StoreLayout`; visual alinhado aos mixins de `_controls.scss`.  
**Justificativa:** Evita duplicar integração HTTP e reconciliação; isola filtros do painel admin sem acoplar features; mantém consistência visual entre admin e loja sem biblioteca externa de UI.

## ADR-023 — Checkout simulado local sem integração remota de carrinho
**Status:** Aceita  
**Contexto:** A Spec 004 exige fluxo de e-commerce demonstrativo, mas a Fake Store API não modela quantidade, subtotal nem persistência adequada para a UX desejada.  
**Decisão:** Implementar `CartStoreService` com Signals e `CartStorageAdapter` em `localStorage`; concluir checkout localmente com Reactive Forms e redirecionar para `/store/order-success` sem `POST /carts`. Exibir ícone de carrinho com badge no `StoreLayout`.  
**Justificativa:** Alinha-se à ADR-012; entrega fluxo completo previsível para avaliação; evita dependência de endpoints remotos que não representam o comportamento real do carrinho público.

## ADR-024 — Consolidar domínio compartilhado em `features/catalog`
**Status:** Aceita  
**Contexto:** Admin e loja pública reutilizam modelos, utilitários e componentes relacionados ao catálogo de produtos. A pasta `features/products` gerava ambiguidade visual com `features/admin/products`.  
**Decisão:** Renomear o domínio compartilhado para `src/app/features/catalog/`, preservando models, components e utils existentes.  
**Justificativa:** Estrutura mais legível; menor ambiguidade; melhor separação entre domínio compartilhado e experiência administrativa; componentes de domínio permanecem fora de `shared/ui`; painel e loja continuam com composições próprias; nenhum comportamento funcional é alterado.

## ADR-025 — Separar UI genérica e UI compartilhada do domínio de catálogo
**Status:** Aceita  
**Contexto:** Admin e loja pública reutilizam elementos visuais relacionados a produtos (filtros, chip, cards, empty filtrado). Parte da duplicação pertence ao domínio de catálogo, não à UI genérica da aplicação.  
**Decisão:** Manter `shared/ui` somente para componentes genéricos (ex.: `FilteredEmptyState`, `EmptyState`, `LoadingState`). Criar `features/catalog/components` para componentes dumb reutilizáveis do domínio (`ProductFilters`, `ProductImage`, `CategoryChip`, `ProductCard`) e `features/catalog/models` para contratos tipados. Wrappers contextuais permanecem em admin (`product-card-grid`) e store (`store-product-grid`).  
**Justificativa:** Fronteiras mais claras; `shared/ui` não importa `ApiProduct`; componentes de domínio permanecem dumb; admin e loja preservam composições próprias (rotas, ações, stores).