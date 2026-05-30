# Spec 001 — Fundação do projeto

## Status
Aprovada para implementação.

## Objetivo
Criar uma fundação limpa em Angular 21 para o painel administrativo de produtos antes de implementar telas de negócio.

## Valor para manutenção
Como pessoa desenvolvedora responsável pela solução, quero uma fundação previsível para que as features sejam implementadas de forma consistente, testadas com segurança e compreendidas rapidamente durante a avaliação.

## Escopo
- Inicializar projeto Angular 21.
- Utilizar estrutura standalone.
- Configurar roteamento.
- Criar fronteira lazy-loaded da feature de produtos.
- Configurar HTTP com `provideHttpClient()`.
- Criar interceptor HTTP funcional de erros.
- Criar modelo tipado de erro normalizado.
- Estabelecer pastas `core`, `shared` e `features`.
- Selecionar e configurar abordagem leve de componentes de UI.
- Criar shell mínimo da aplicação.
- Configurar lint, testes e scripts de build de produção.
- Adicionar referências iniciais ao README.

## Fora do escopo
- Implementação da listagem de produtos.
- Implementação do formulário de produtos.
- Serviço completo de CRUD além de placeholders mínimos necessários.
- Autenticação.
- Estilização avançada.
- Testes end-to-end.

## Requisitos funcionais
### RF-001 — Aplicação inicia corretamente
O projeto deve executar localmente utilizando o comando documentado.

### RF-002 — Rota raiz redireciona para produtos
Ao navegar para `/`, a aplicação deve redirecionar para `/products`.

### RF-003 — Rota de produtos utiliza lazy loading
A feature de produtos deve possuir uma fronteira explícita de carregamento sob demanda.

### RF-004 — HTTP configurado centralmente
`HttpClient` deve estar disponível por configuração de providers no nível da aplicação.

### RF-005 — Erros podem ser normalizados centralmente
Um interceptor HTTP funcional deve fornecer um ponto claro para normalização de erros.

### RF-006 — Layout-base renderiza
Um shell mínimo deve renderizar o conteúdo da rota ativa.

## Requisitos não funcionais
- Utilizar configurações strict do TypeScript geradas ou suportadas pelo Angular CLI.
- Evitar dependências não utilizadas.
- Manter a organização compreensível.
- Preferir primitivos acessíveis de UI.
- Evitar abstrações especulativas.

## Critérios de aceite
- [ ] Projeto Angular 21 inicializado.
- [ ] Aplicação executa localmente.
- [ ] Rota raiz redireciona para `/products`.
- [ ] Feature de produtos utiliza lazy loading.
- [ ] Shell renderiza o conteúdo roteado.
- [ ] `provideHttpClient()` configurado.
- [ ] Interceptor funcional registrado.
- [ ] Modelo de erro normalizado criado.
- [ ] Estrutura inicial de pastas criada.
- [ ] README contém instruções de configuração.
- [ ] Testes passam.
- [ ] Lint passa.
- [ ] Build de produção passa.

## Edge cases
- Rota desconhecida deve redirecionar para rota segura ou exibir página simples de não encontrado.
- Placeholder da rota de produtos não deve falhar antes da implementação da feature.
- Interceptor deve preservar informações necessárias para consumidores.

## Definição de concluído
Todos os critérios de aceite passam e o documento de revisão foi preenchido honestamente.
