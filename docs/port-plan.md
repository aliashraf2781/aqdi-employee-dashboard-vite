# React (Vite) port: phased plan

Target repo: `subcodetasks-sudo/aqdi-employee-dashboard-vite` (separate repo, private).
Source: this repo (Next.js 15 App Router, 52 pages, ~529 files).

## Stack

| Concern | Choice |
| --- | --- |
| Build | Vite + React 18 + JavaScript (JSDoc) |
| Routing | React Router v6 (`createBrowserRouter`, lazy routes) |
| Server state | TanStack Query v5 |
| Client state | Zustand (auth only) |
| Forms | react-hook-form + zod (`@hookform/resolvers`) |
| Styling | Tailwind with semantic color tokens |
| UI primitives | Radix + shadcn-style components |
| Tests | Vitest + Testing Library |

## Rules every phase follows

1. **Feature-based folders.** Each feature owns its `api/`, `hooks/`, `components/`, `schemas/`, `pages/` and exports only through `index.js`.
2. **Colors are tokens only.** Define CSS variables in `src/styles/tokens.css`, map them in `tailwind.config.js` (`bg-primary`, `text-muted`, `border-border`, `bg-success`...). No hex values, no `bg-[#...]`, no other arbitrary bracketed values. An ESLint rule or CI grep fails the build on `#[0-9a-f]{3,8}` and `-\[#` in `src/`.
3. **Reuse dialogs.** One `Modal` (Radix Dialog wrapper), one `ConfirmDialog`, one `FormDialog` (modal + RHF + zod + submit state) in `src/shared/components/`. Features compose them and never build their own overlay.
4. **SOLID, junior-readable.**
   - One component, one job. Pages only compose.
   - Data access lives in `api/*.js` (plain functions), wrapped in `hooks/use-*.js` (TanStack Query). Components never call axios.
   - Zod schema next to its form. Types are inferred from schemas.
   - Small files (<150 lines), descriptive names, comments only for the "why".
5. **Parity.** Same API endpoints, same permission strings (`section.action`), RTL Arabic (`dir="rtl"`).

## Target structure

```
src/
  app/            router, providers, layout shell
  shared/
    components/   ui/ (Button, Input, ...), Modal, ConfirmDialog, FormDialog, DataTable, PageHeader
    hooks/        use-debounce, use-row-selection, ...
    lib/          axios client, cn(), formatters
    styles/       tokens.css, globals.css
  features/
    auth/         login, session store, route guard
    permissions/  permission model, usePermissions, sidebar nav
    dashboard/    home summary
    clients/ orders/ realtime-orders/ return-orders/ invoices/
    employees/    (roles-and-employees)
    reports/ content/ marketing/ settings/ contract-settings/ real-estates/ users/
```

## Phases

| Phase | Scope | Depends on | Owner |
| --- | --- | --- | --- |
| 0 | Repo created, Vite scaffold, Tailwind tokens, lint rule for hardcoded colors, CI | repo exists | main session |
| 1 | `shared/` kit: ui primitives, Modal, ConfirmDialog, FormDialog, DataTable, axios client (token + 401 logout), query provider, toasts | 0 | main session |
| 2 | `auth` + `permissions` + app shell (sidebar from permission-aware nav, route guard) + dashboard | 1 | main session |
| 3 | `clients` (reference feature, defines the pattern) | 2 | main session |
| 4 | Parallel feature ports (one subagent each, worktree isolated) | 3 | subagents |
| 5 | Cross-feature cleanup: dedupe components, a11y, tests, README | 4 | main session |

### Phase 4 subagent split

Each agent ports one feature following the `clients` pattern and the rules above, then opens a branch `feat/<name>`.

| Agent | Features (source routes) |
| --- | --- |
| A | `orders`, `realtime-orders`, `return-orders` (largest: tabs, status flows, contract printing) |
| B | `employees` (roles-and-employees), `users`, `settings`, `contract-settings` |
| C | `reports` (analysis tabs, xlsx/pdf export), `invoices` |
| D | `content`, `marketing-and-content`, `real-estates` (TipTap editors, FormData uploads) |

## Blockers

- The GitHub integration cannot create repositories (403). The empty repo must be created by its owner, then added to the session.
- Out of scope in the first pass: Firebase push notifications, server-only routes (`src/app/api`, middleware). They need a Vite-side replacement decision.
