# Spec 002 — CRUD de produtos

## Status
Aprovada para implementação após a conclusão da Spec 001.

## Objetivo
Entregar o fluxo completo de gestão de produtos exigido pelo desafio técnico.

## História principal
Como pessoa usuária administrativa, quero listar, criar, editar e excluir produtos para manter o catálogo por meio de um painel claro e confiável.

## Escopo
- Modelo tipado de produto e payload do formulário em `features/admin/products/data-access`.
- Integração com endpoints de produtos da Fake Store API.
- Store da feature baseado em Signals.
- Página de listagem em `/admin/products`.
- Busca por título.
- Filtro de categoria.
- Estados de carregamento, erro, vazio e vazio filtrado.
- Exibição responsiva em tabela e cards.
- Fluxo de criação.
- Fluxo de edição.
- Dialog de confirmação de exclusão.
- Feedback das mutações.
- Testes unitários dos fluxos críticos.
- Explicação da arquitetura e da limitação da API no README.

## Fora do escopo
- Autenticação (sem login, cadastro, `AuthGuard` ou interceptor de token).
- Carrinho.
- Checkout.
- Loja pública (`features/store/*`).
- Edição de avaliações.
- Upload de imagem.
- Paginação server-side.
- Cache complexo.
- NgRx.
- Backend persistente.

## Requisitos funcionais
### RF-001 — Listar produtos
A pessoa usuária deve visualizar produtos carregados da API.

### RF-002 — Buscar produtos
A pessoa usuária deve filtrar produtos por título utilizando busca case-insensitive.

### RF-003 — Filtrar por categoria
A pessoa usuária deve filtrar produtos utilizando as categorias disponíveis.

### RF-004 — Criar produto
A pessoa usuária deve enviar um formulário válido. Após resposta bem-sucedida da API, o produto criado deve aparecer no estado local do painel.

### RF-005 — Editar produto
A pessoa usuária deve editar um produto existente. Após resposta bem-sucedida, o produto correspondente deve ser substituído no estado local.

### RF-006 — Excluir produto
A pessoa usuária deve confirmar a exclusão. Após resposta bem-sucedida, o produto deve ser removido do estado local.

### RF-007 — Validar formulário
Formulários inválidos não devem ser submetidos.

### RF-008 — Preservar valores após falha ao salvar
Quando uma mutação falhar, os valores preenchidos devem permanecer disponíveis para correção ou nova tentativa.

### RF-009 — Comunicar estado assíncrono
A pessoa usuária deve receber feedback claro enquanto os dados carregam ou uma mutação está em andamento.

### RF-010 — Recuperar falha da listagem
Quando o carregamento inicial falhar, deve existir uma opção acionável para tentar novamente.

## Validação do formulário
| Campo | Regras |
|---|---|
| Título | Obrigatório, mínimo de 3 caracteres |
| Preço | Obrigatório, numérico, maior que zero |
| Categoria | Obrigatória |
| URL da imagem | Obrigatória, padrão válido de URL |
| Descrição | Obrigatória, mínimo de 10 caracteres |

## Regras de reconciliação local
- Criar: adicionar ao estado o produto retornado.
- Atualizar: substituir produto com ID correspondente.
- Excluir: remover produto com ID correspondente.
- Falha: preservar estado anterior.

## Critérios de aceite
- [ ] Listagem de produtos carrega com sucesso.
- [ ] Estado de carregamento aparece enquanto a lista é carregada.
- [ ] Estado de erro e ação de tentar novamente funcionam.
- [ ] Estado vazio é tratado intencionalmente.
- [ ] Busca funciona.
- [ ] Filtro de categoria funciona.
- [ ] Filtros podem ser limpos.
- [ ] Criação válida atualiza o estado local.
- [ ] Formulário inválido de criação não pode ser submetido.
- [ ] Edição válida atualiza o estado local.
- [ ] Exclusão exige confirmação.
- [ ] Exclusão bem-sucedida atualiza o estado local.
- [ ] Falhas de mutação apresentam feedback sem corromper o estado.
- [ ] Layout pode ser utilizado em mobile e desktop.
- [ ] Testes unitários críticos passam.
- [ ] Lint passa.
- [ ] Build de produção passa.
- [ ] README documenta trade-offs e limitação da API.

## Edge cases
- URL da imagem falha ao carregar: exibir fallback.
- Navegação direta para ID desconhecido: exibir erro e ação segura de navegação.
- Lista da API está vazia: exibir estado vazio.
- Busca ativa sem resultados: exibir estado vazio filtrado e ação de limpar filtros.
- Usuário clica em salvar repetidamente: desabilitar salvamento enquanto requisição estiver em andamento.
- Usuário confirma exclusão repetidamente: bloquear confirmação duplicada.
- API retorna mutação com formato inesperado: falhar de forma segura ou normalizar cuidadosamente.

## Métricas de sucesso
- A pessoa avaliadora entende rapidamente a organização das pastas.
- O CRUD pode ser demonstrado sem etapas manuais ocultas.
- Comandos obrigatórios de qualidade passam.
- O README explica por que existe reconciliação de estado local.

## Definição de concluído
Todos os critérios obrigatórios passam, os testes cobrem comportamentos críticos e a documentação corresponde à solução implementada.
