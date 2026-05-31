# Plano — Spec 002.1 Refinamento visual do painel administrativo

## Premissas

- Spec 002 concluída e validada (CRUD, store, testes, quality gates).
- Implementação **somente visual**; sem alteração de contratos HTTP, store ou validações.
- Respeitar ADR-013 (sem biblioteca externa), ADR-014/016 (imagens nativas com fallback).
- Trabalhar incrementalmente; validar manualmente após cada bloco.

## Ordem de implementação

### 1. Fallback de imagem

- Validar ou criar `public/images/product-placeholder.svg` alinhado à identidade.
- Validar ou criar `ProductImage` com `linkedSignal`, inputs (`src`, `alt`, `width`, `height`, `loading`) e testes.
- Integrar ou confirmar integração em tabela, cards e preview do formulário.
- Garantir anti-loop no fallback e sincronização quando `src` mudar.

**Saída:** imagens quebradas não distorcem layout; testes de `ProductImage` passando.

### 2. Logo

- Usar `/public/starian-catalog-symbol.svg` (cubo + estrela, fundo transparente).
- Substituir SVG inline da sidebar por asset definitivo.
- Ajustar dimensões e contraste no contexto da sidebar.

**Saída:** marca reconhecível sem placeholder geométrico genérico.

### 3. Sidebar

- Refinar bloco de marca: `Starian` + label `Catalog`.
- Adicionar linha decorativa com gradiente sutil inspirado na marca.
- Melhorar estilo do link ativo (`Produtos`).
- Preservar botão `Visualizar loja` desabilitado até Spec 003.
- Revisar padding, bordas e hierarquia mobile/desktop.

**Saída:** navegação clara e alinhada à identidade Starian.

### 4. Header da listagem

- Refinar tipografia de título e subtítulo.
- Adicionar detalhe visual discreto (separador, accent ou badge sutil).
- Exibir contador de produtos cadastrados (leitura do store; sem nova regra de negócio).
- Ajustar espaçamento entre copy e CTA `Novo produto`.

**Saída:** contexto imediato da página sem poluição visual.

### 5. Tabela e cards

**Tabela (desktop):**

- Espaçamento vertical das células.
- Hover de linha sutil.
- Alinhamento da coluna de preço.
- Chip de categoria reutilizável localmente (SCSS compartilhado na feature, não design system global).
- Refinar links/botões de `Editar` e `Excluir`.

**Cards (mobile):**

- Hierarquia título → categoria (chip) → preço → descrição.
- Ações com espaçamento e contraste adequados.

**Saída:** listagem coerente nos dois modos responsivos.

### 6. Dialog de exclusão

- Refinar contraste, padding, borda e sombra do `ConfirmDialog`.
- Manter `<dialog>` nativo, foco, Escape e mensagens de erro.
- Não alterar outputs, inputs ou fluxo de confirmação.

**Saída:** dialog mais legível sem mudança comportamental.

### 7. Formulário

- Espaçamento entre campos e grupos de ação.
- Destaque visual da área de preview (`aside`).
- Placeholder visual consistente quando URL vazia ou inválida no preview.
- Textos auxiliares mais claros onde necessário.
- Preservar Reactive Forms e validações existentes.

**Saída:** formulário mais escaneável; preview como referência visual clara.

### 8. Responsividade

- Revisar `/admin/products`, `/admin/products/new`, `/admin/products/:id/edit`.
- Validar 375px, 768px, 1280px.
- Corrigir somente problemas reais (overflow, botões cortados, sidebar quebrando conteúdo).

**Saída:** checklist responsivo documentado no `review.md`.

### 9. Acessibilidade

- Revisão objetiva: foco, contraste, labels, erros, teclado, dialog, imagens.
- Executar AXE somente se já disponível no ambiente; caso contrário, revisão manual estruturada.
- Corrigir regressões introduzidas pelo refinamento visual.

**Saída:** acessibilidade mínima preservada ou melhorada.

### 10. Testes

- Atualizar ou adicionar testes de `ProductImage` se necessário.
- Ajustar testes de componentes cujos seletores ou textos visíveis mudaram (sem testar estilos frágeis).
- Garantir que testes de comportamento CRUD continuem passando.

**Saída:** suite verde; cobertura de fallback e integrações visuais críticas.

### 11. Documentação

- Preencher `review.md` desta spec.
- Atualizar `docs/ESTADO_ATUAL.md`.
- Registrar ADR curta somente se houver decisão nova (ex.: asset de logo, padrão de chip).
- Atualizar README somente se assets ou instruções visíveis mudarem.

**Saída:** memória entre sessões reflete entrega visual concluída.

### 12. Quality gates

```bash
npm run lint
npm run test -- --watch=false
npm run build
```

- Marcar `tasks.md`.
- Declarar spec concluída somente se todos os gates passarem.

## Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Refinamento visual quebra testes por seletor frágil | Preferir asserts por papel, texto ou harness estável |
| Chips/categorias longas quebram layout | `max-width`, truncamento ou wrap controlado |
| Gradiente decorativo reduz contraste | Usar somente em elementos não textuais |
| Retrabalho de `ProductImage` já entregue na Spec 002 | Validar baseline antes de reimplementar; focar acabamento |

## Critério de parada

Interromper a spec quando todos os critérios de aceite de `spec.md` estiverem atendidos e os quality gates passarem. Não avançar para Spec 003 na mesma sessão de implementação desta spec.
