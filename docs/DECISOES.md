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
**Decisão:** Manter pages, UI e acesso a dados específicos de produtos em `features/products`.  
**Justificativa:** A organização por domínio facilita navegação e manutenção sem criar camadas desnecessárias.

## ADR-003 — Utilizar componentes standalone e rotas lazy-loaded
**Status:** Aceita  
**Decisão:** Utilizar componentes standalone do Angular e carregar a feature de produtos sob demanda.  
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
**Contexto:** A Fake Store API retorna respostas simuladas para mutações, mas não persiste as alterações.  
**Decisão:** Após resposta HTTP bem-sucedida, atualizar localmente o estado da feature.  
**Justificativa:** Permite demonstrar o CRUD completo de forma coerente durante a sessão atual sem ocultar a limitação da API.

## ADR-009 — Utilizar component harnesses seletivamente
**Status:** Aceita  
**Decisão:** Preferir harnesses prontos do Angular Material quando aplicável e criar harness customizado somente se houver ganho claro de estabilidade nos testes.  
**Justificativa:** Harnesses reduzem fragilidade dos testes, mas criar harness para cada componente seria exagero para o escopo.

## ADR-010 — Utilizar documentação como memória entre sessões
**Status:** Aceita  
**Decisão:** Manter especificações versionadas, tasks verificáveis e um arquivo `docs/ESTADO_ATUAL.md` atualizado ao final de cada sessão.  
**Justificativa:** Permite retomar o trabalho com consistência entre sessões e agentes sem depender do histórico da conversa.

## ADR-011 — Não implementar autenticação
**Status:** Nao aceita  
**Decisão:** Não implementar login, cadastro, guards ou interceptores de autenticação..  
**Justificativa:** A autenticação não faz parte dos requisitos do desafio e adicionaria complexidade sem representar uma regra real do sistema. O tempo disponível será direcionado à qualidade do CRUD, experiência da loja pública, tratamento de estados assíncronos, testes e documentação.  


## ADR-012 — Separar carrinho remoto e carrinho local
**Status:** Aceita  
**Decisão:** A Fake Store API oferece endpoints de carrinho, mas o modelo remoto não contempla todas as necessidades da experiência pública, como quantidade, subtotal e persistência após refresh.  
**Justificativa:**O carrinho público utilizará estado local com Signals e localStorage. A integração com POST /carts será opcional e utilizada somente como demonstração complementar durante o checkout simulado.  