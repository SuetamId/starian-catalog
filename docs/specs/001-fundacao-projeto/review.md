# Revisão — Spec 001 Fundação do projeto

Data da revisão: 2026-05-31

## Status da Spec 001

**Concluída com ressalva documental.** Todos os critérios técnicos de fundação foram implementados e validados. O README permanece pendente de consolidação final, conforme decisão de adiar a documentação de execução até após entregas funcionais mais completas.

---

## Revisão dos critérios de aceite

- [x] Angular 21 confirmado (`@angular/core` ^21.2.0, CLI ^21.2.9).
- [x] Aplicação standalone confirmada (sem NgModules; componentes com `imports`).
- [x] Aplicação executa localmente (`npm start`).
- [x] Rota raiz redireciona para `/admin/products` (testado em `app.routes.spec.ts`).
- [x] Rota lazy-loaded de produtos administrativos confirmada (`products.routes.ts` + chunk lazy no build).
- [x] Shell confirmado (`AdminLayout` com sidebar, outlet e placeholder roteado).
- [x] Providers HTTP confirmados (`provideHttpClient` em `app.config.ts`).
- [x] Interceptor funcional confirmado (`errorInterceptor` + testes).
- [x] Contrato de erro confirmado (`NormalizedHttpError`, type guard, normalizador).
- [x] Estrutura inicial de pastas criada (`core/config`, `core/http`, `core/layout/admin-layout`, `features/admin/products`).
- [ ] README contém instruções de configuração atualizadas — **pendente deliberado**.
- [x] Testes passam (14 testes, 4 arquivos).
- [x] Lint passa.
- [x] Build de produção passa.

---

## Quality gates

| Verificação | Resultado | Observações |
|---|---|---|
| Lint | Passou | `npm run lint` — All files pass linting. |
| Testes unitários | Passou | 14 testes: App, rotas, normalizador, interceptor. |
| Build de produção | Passou | Lazy chunks de `products-routes` e `products-placeholder-page` gerados. |

---

## Revisão de escopo

- [x] Nenhuma implementação de CRUD vazou desnecessariamente para a fundação.
- [x] Nenhuma dependência desnecessária foi adicionada (sem Material, sem NgRx, sem auth).
- [x] Nenhum código morto permanece (scaffold da CLI removido).

---

## Correções realizadas

Nenhuma correção de código nesta sessão de revisão. A fundação foi validada contra os critérios da spec; documentação atualizada para refletir o estado real.

Correções já incorporadas nas sessões anteriores desta fundação:

- Resolução SCSS: componentes usam `@use "styles/index" as styles` por conflito com `src/styles.scss` global.
- ADR-011 corrigido para status **Aceita** (autenticação fora do escopo).
- Arquitetura alinhada para `features/admin/products` e rotas `/admin/*`.

---

## Arquivos alterados nesta revisão

- `docs/specs/001-fundacao-projeto/review.md`
- `docs/specs/001-fundacao-projeto/spec.md` (status e critérios de aceite)
- `docs/specs/001-fundacao-projeto/tasks.md`
- `docs/ESTADO_ATUAL.md`

---

## Limitações deliberadamente adiadas

- **README** — consolidação de comandos, decisões e limitações da API adiada para após entregas funcionais (Spec 002+).
- **`shared/ui`** — não criado; componentes genéricos serão extraídos somente com reutilização comprovada no CRUD.
- **Rotas `/admin/products/new` e `/admin/products/:id/edit`** — escopo da Spec 002.
- **Loja pública (`/store/*`)** — P1, após CRUD validado.
- **Logo oficial** — placeholder SVG geométrico no `AdminLayout`.
- **Ação “Visualizar loja”** — visual desabilitada até P1.

---

## Observações finais

A fundação está pronta para iniciar a Spec 002. A abordagem de UI confirmada (ADR-013) é HTML semântico + SCSS + tokens Starian, sem biblioteca externa. O interceptor normaliza erros de forma previsível; consumidores futuros devem tratar `NormalizedHttpError` sem interpretar `HttpErrorResponse` diretamente.

Próximo passo recomendado: Spec 002 — camada `data-access` (`product.model.ts`, `ProductApiService` com GET) e store baseado em Signals.
