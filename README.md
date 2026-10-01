# AQDI Employee Dashboard (React + Vite)

Feature-based React port of the Next.js employee dashboard. RTL Arabic.

Stack: Vite, React 18, React Router, TanStack Query, react-hook-form + zod, Tailwind, Zustand (session only).

```bash
cp .env.example .env
npm install
npm run dev      # http://localhost:3000, /api proxied to the backend
npm run lint     # eslint + hardcoded-color check
npm run build
```

## Structure

```
src/
  app/        router, providers
  shared/     components (Modal, ConfirmDialog, FormDialog, ui/), lib (api client, cn)
  features/   one folder per feature: api/ hooks/ components/ schemas/ pages/ index.js
  styles/     tokens.css (the only place raw colors live), index.css
```

## Rules

- **Colors:** use Tailwind token classes (`bg-primary`, `text-muted-foreground`). Add new colors to `src/styles/tokens.css` and `tailwind.config.js`. `npm run lint` fails on hex/rgb values and arbitrary values like `bg-[#fff]` or `w-[420px]`.
- **Dialogs:** never build a new overlay. Compose `Modal`, `ConfirmDialog` or `FormDialog` from `shared/components`.
- **Data flow:** `api/*.js` (plain functions) -> `hooks/use-*.js` (TanStack Query) -> components. Components never call axios.
- **Forms:** zod schema in `schemas/`, react-hook-form in the component.
- Features import each other only through their `index.js`.

See [docs/port-plan.md](docs/port-plan.md) for the phased migration plan.

## Auth note

The Next.js app kept tokens in httpOnly cookies through a server-side proxy. A static SPA has no server, so this app stores the Bearer token (Zustand, localStorage) and the backend must allow CORS for the deployed origin.
