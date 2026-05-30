# Sistema de UI
## Estratégia de implementação visual
A aplicação utilizará SCSS como pré-processador de estilos.

A implementação visual será organizada em três níveis:
1. Tokens globais em `src/styles/_variables.scss`.
2. CSS custom properties exportadas em `src/styles/_theme.scss`.
3. Mixins e funções reutilizáveis em arquivos dedicados.
Components devem consumir tokens semânticos por meio de CSS custom properties sempre que possível.
Valores brutos de cor, espaçamento e radius não devem ser repetidos em components.
Mixins devem representar padrões reutilizáveis reais, não abstrações antecipadas.

## 1. Direção visual
A aplicação deve se parecer com um painel administrativo moderno, limpo e confiável.
A interface deve ser calma, legível e eficiente, evitando excesso de elementos visuais.

## 2. Layout principal
- Shell da aplicação com header compacto e sidenav com colapse model. 
- Conteúdo principal limitado a uma largura confortável.
- Cabeçalho da página com título, texto de apoio e ação primária.
- Produtos exibidos em dois modos, lista, sem ser tabela convencional e cards, em telas maiores e menores.

## 3. Estados obrigatórios da listagem
A página de listagem deve suportar intencionalmente:
- estado de carregamento;
- estado carregado com produtos;
- estado vazio quando não houver produtos;
- estado vazio filtrado quando a busca ou os filtros não retornarem resultados;
- estado de erro com ação de tentar novamente;
- feedback após criar, editar ou excluir.

## 4. Controles da listagem
- Campo de busca por título.
- Filtro de categoria.
- Ação para limpar filtros quando houver filtro ativo.
- Ação primária para adicionar produto.
- Ações de editar e excluir em cada produto.

## 5. Experiência do formulário
Os fluxos de criação e edição reutilizam o mesmo formulário.

Campos:
- título;
- preço;
- categoria;
- URL da imagem;
- descrição.

Validações:
- título: obrigatório, mínimo de 3 caracteres;
- preço: obrigatório, maior que zero;
- categoria: obrigatória;
- URL da imagem: obrigatória, formato válido de URL;
- descrição: obrigatória, mínimo de 10 caracteres.

Comportamentos:
- exibir mensagens de validação após interação ou tentativa de envio;
- desabilitar a ação principal enquanto estiver salvando;
- disponibilizar ação clara de cancelar;
- preservar os valores preenchidos quando a API retornar erro;
- comunicar sucesso de salvamento claramente.

## 6. Experiência de exclusão
A exclusão exige confirmação.
O dialog de confirmação deve:
- informar o nome do produto afetado;
- explicar que a ação removerá o item do estado atual do painel;
- disponibilizar ações de cancelar e confirmar;
- bloquear confirmação repetida enquanto a requisição estiver em andamento.

## 7. Responsividade
- Desktop: tabela com ações alinhadas.
- Tablet: tabela compacta ou cards conforme o espaço disponível.
- Mobile: cards com hierarquia legível e ações acessíveis.


## 8. Acessibilidade mínima
- Utilizar headings semânticos.
- Associar labels aos campos do formulário.
- Garantir textos acessíveis e descritivos em botões.
- Preservar utilização via teclado.
- Exibir foco visível.
- Não utilizar apenas cor para comunicar estado.
- Utilizar gerenciamento de foco do dialog fornecido pela biblioteca adotada.

## 9. Melhorias opcionais
Implementar somente após concluir o escopo obrigatório:
- skeleton loaders;
- fallback visual para imagem do produto;
- notificações toast;
- transições sutis;
- persistência de filtros na URL.
