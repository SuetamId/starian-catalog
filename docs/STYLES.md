# Padrões de Estilos

## 1. Objetivo

Este documento define a organização mínima dos estilos da aplicação.

O projeto deve utilizar SCSS de forma simples, previsível e reutilizável, sem criar abstrações desnecessárias.

A prioridade é manter:

- consistência visual;
- facilidade de manutenção;
- baixo acoplamento;
- reutilização apenas quando houver necessidade real;
- leitura simples para qualquer pessoa que avaliar o projeto.

---

## 2. Estrutura global

```text
src/styles/
├── _variables.scss
├── _mixins.scss
├── _theme.scss
├── _reset.scss
└── _index.scss
```

Responsabilidades:

| Arquivo | Responsabilidade |
|---|---|
| `_variables.scss` | Cores, espaçamentos, radius, breakpoints e tempos de transição |
| `_mixins.scss` | Padrões SCSS reutilizáveis |
| `_theme.scss` | CSS custom properties disponíveis em runtime |
| `_reset.scss` | Normalização básica dos elementos HTML |
| `_index.scss` | Ponto central de exportação dos arquivos SCSS |

---

## 3. Regras gerais

- Utilizar SCSS.
- Utilizar `@use` e `@forward`.
- Não utilizar `@import`.
- Manter estilos específicos próximos ao component.
- Centralizar valores globais reutilizáveis.
- Evitar valores mágicos repetidos.
- Evitar classes globais específicas de uma feature.
- Não utilizar `::ng-deep`.
- Criar novos mixins somente quando houver repetição real.
- Não abstrair estilos prematuramente.

---

## 4. Variáveis globais

Arquivo:

```text
src/styles/_variables.scss
```

Exemplo inicial:

```scss
// Colors
$color-bg: #050505;
$color-surface: #0d0d0f;
$color-surface-elevated: #151518;

$color-border: #29292f;

$color-text: #f5f5f5;
$color-text-muted: #a7a7b0;

$color-primary: #2d63d9;
$color-success: #2dbe78;
$color-danger: #e32626;
$color-warning: #e47b27;

$color-focus: #74a2ff;

// Spacing
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;
$spacing-2xl: 3rem;

// Radius
$radius-sm: 0.5rem;
$radius-md: 0.75rem;
$radius-lg: 1.125rem;
$radius-pill: 999px;

// Breakpoints
$breakpoint-sm: 40rem;
$breakpoint-md: 48rem;
$breakpoint-lg: 64rem;
$breakpoint-xl: 80rem;

// Motion
$motion-fast: 140ms;
$motion-default: 220ms;
$motion-slow: 320ms;

// Shadows
$shadow-soft: 0 12px 36px rgba(0, 0, 0, 0.28);
```

As variáveis devem ser adicionadas conforme a necessidade real do projeto.

Não criar tokens sem uso concreto.

---

## 5. Tema global

Arquivo:

```text
src/styles/_theme.scss
```

As principais variáveis SCSS devem ser exportadas como CSS custom properties.

Exemplo:

```scss
@use "variables" as variables;

:root {
  --color-bg: #{variables.$color-bg};
  --color-surface: #{variables.$color-surface};
  --color-surface-elevated: #{variables.$color-surface-elevated};

  --color-border: #{variables.$color-border};

  --color-text: #{variables.$color-text};
  --color-text-muted: #{variables.$color-text-muted};

  --color-primary: #{variables.$color-primary};
  --color-success: #{variables.$color-success};
  --color-danger: #{variables.$color-danger};
  --color-warning: #{variables.$color-warning};

  --color-focus: #{variables.$color-focus};

  --shadow-soft: #{variables.$shadow-soft};

  --motion-fast: #{variables.$motion-fast};
  --motion-default: #{variables.$motion-default};
  --motion-slow: #{variables.$motion-slow};
}
```

Os components devem preferir CSS custom properties:

```scss
.product-card {
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}
```

---

## 6. Mixins

Arquivo:

```text
src/styles/_mixins.scss
```

Criar somente mixins genéricos e com reutilização clara.

Exemplo inicial:

```scss
@use "variables" as variables;

@mixin respond-to($breakpoint) {
  @if $breakpoint == sm {
    @media (min-width: variables.$breakpoint-sm) {
      @content;
    }
  }

  @if $breakpoint == md {
    @media (min-width: variables.$breakpoint-md) {
      @content;
    }
  }

  @if $breakpoint == lg {
    @media (min-width: variables.$breakpoint-lg) {
      @content;
    }
  }

  @if $breakpoint == xl {
    @media (min-width: variables.$breakpoint-xl) {
      @content;
    }
  }
}

@mixin focus-ring {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

@mixin interactive-focus {
  &:focus-visible {
    @include focus-ring;
  }
}

@mixin surface-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: variables.$radius-lg;
  box-shadow: var(--shadow-soft);
}

@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip: rect(0 0 0 0);
}
```

Uso em um component:

```scss
@use "styles" as styles;

.product-card {
  @include styles.surface-card;

  padding: styles.$spacing-md;

  @include styles.respond-to(md) {
    padding: styles.$spacing-lg;
  }
}
```

---

## 7. Reset global

Arquivo:

```text
src/styles/_reset.scss
```

Manter apenas uma normalização básica.

```scss
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  min-height: 100%;
}

body {
  min-height: 100vh;
  margin: 0;
  color: var(--color-text);
  background: var(--color-bg);
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

img {
  display: block;
  max-width: 100%;
}
```

---

## 8. Exportação central

Arquivo:

```text
src/styles/_index.scss
```

```scss
@forward "variables";
@forward "mixins";
```

O tema e o reset devem ser carregados globalmente no arquivo principal:

```scss
@use "styles/theme";
@use "styles/reset";
```

---

## 9. Estilos locais dos components

Cada component deve manter seus estilos próximos ao arquivo TypeScript.

Exemplo:

```text
product-card/
├── product-card.ts
├── product-card.html
└── product-card.scss
```

No SCSS local:

```scss
@use "styles" as styles;

.product-card {
  @include styles.surface-card;

  display: grid;
  gap: styles.$spacing-md;
  padding: styles.$spacing-md;
}
```

Não criar arquivos globais para regras específicas de uma única tela ou component.

---

## 10. Identidade visual

A interface deve seguir uma estética inspirada na Starian:

- fundo escuro;
- superfícies discretas;
- textos claros;
- detalhes luminosos controlados;
- azul para ações principais;
- verde para sucesso;
- vermelho para ações destrutivas;
- laranja para alertas;
- gradiente multicolorido apenas em detalhes decorativos.

Evitar:

- excesso de brilho;
- gradientes em todos os botões;
- animações desnecessárias;
- sombras pesadas;
- fundos poluídos;
- efeitos que prejudiquem a leitura.

---

## 11. Responsividade

A aplicação deve ser mobile-first.

Utilizar o mixin `respond-to()` quando necessário.

Exemplo:

```scss
.products-grid {
  display: grid;
  gap: styles.$spacing-md;
  grid-template-columns: 1fr;

  @include styles.respond-to(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include styles.respond-to(lg) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
```

---

## 12. Acessibilidade

Os estilos devem preservar:

- foco visível;
- contraste mínimo WCAG AA;
- legibilidade em fundo escuro;
- estados de hover e focus distintos;
- navegação por teclado;
- suporte a `prefers-reduced-motion`;
- áreas clicáveis confortáveis.

A cor não deve ser o único meio de comunicar estado.

---

## 13. Theme TypeScript

Criar:

```text
src/app/core/theme/theme.ts
```

somente quando houver necessidade real de consumir tokens dentro do TypeScript.

Exemplos válidos:

- cores dinâmicas para cards;
- configuração de gráficos;
- integração com biblioteca externa;
- regras visuais dependentes de dados.

Não duplicar toda a estrutura SCSS automaticamente.

---

## 14. Limites

Não criar antecipadamente:

- biblioteca completa de utilities;
- sistema complexo de tokens;
- múltiplos temas;
- dark mode alternável;
- funções SCSS genéricas sem uso;
- mixins sem reutilização comprovada;
- abstrações inspiradas em necessidades futuras hipotéticas.

O objetivo é manter a implementação enxuta e profissional.