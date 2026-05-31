# Tarefas — Spec 002.1 Refinamento visual do painel administrativo

## Imagens

- [x] Validar ou criar `public/images/product-placeholder.svg`.
- [x] Validar ou criar `ProductImage` em `shared/ui/product-image/`.
- [x] Integrar ou confirmar uso em tabela, cards e preview.
- [x] Garantir fallback local, anti-loop e testes de `ProductImage`.

## Identidade

- [x] Criar `src/assets/starian-catalog-symbol.svg` (cubo + estrela, fundo transparente).
- [x] Substituir logo placeholder inline na sidebar.
- [x] Refinar sidebar: hierarquia, label `Catalog`, linha decorativa com gradiente.
- [x] Melhorar item de navegação ativo.
- [x] Manter botão `Visualizar loja` desabilitado.

## Listagem

- [x] Refinar header: título, subtítulo, detalhe visual discreto.
- [x] Exibir contador de produtos cadastrados.
- [x] Ajustar espaçamento do header e CTA `Novo produto`.
- [x] Refinar tabela: espaçamento, hover, preço alinhado, chips de categoria, ações.
- [x] Refinar cards mobile: hierarquia, chips, ações.

## Formulário

- [x] Melhorar espaçamento dos campos e ações.
- [x] Destacar área de preview.
- [x] Aplicar placeholder visual consistente sem imagem.
- [x] Revisar textos auxiliares sem alterar validações.

## Dialog

- [x] Refinar contraste, padding e borda do `ConfirmDialog`.
- [x] Confirmar foco, Escape e `role="alert"` preservados.

## Responsividade

- [x] Revisar `/admin/products` em 375px, 768px e 1280px.
- [x] Revisar `/admin/products/new` nos mesmos breakpoints.
- [x] Revisar `/admin/products/:id/edit` nos mesmos breakpoints.
- [x] Corrigir overflow horizontal ou elementos cortados, se houver.

## Acessibilidade

- [x] Validar foco visível e contraste.
- [x] Validar labels, erros e teclado nos formulários.
- [x] Validar dialog e imagens (`alt`).
- [x] Registrar revisão manual ou AXE no `review.md`.

## Testes

- [x] Atualizar testes afetados por mudanças visíveis (sem asserts frágeis de CSS).
- [x] Confirmar suite completa passando.

## Documentação

- [x] Preencher `review.md`.
- [x] Atualizar `docs/ESTADO_ATUAL.md`.
- [x] Registrar ADR nova somente se necessário.
- [x] Atualizar README se assets ou instruções visíveis mudarem.

## Validação final

- [x] `npm run lint`
- [x] `npm run test -- --watch=false`
- [x] `npm run build`
- [x] Marcar spec como concluída no `review.md`
