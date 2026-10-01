# Porting conventions (read before touching code)

Source app (Next.js, read-only reference): `/home/user/aqdi-employee-dashboard`
- UI: `components/<Feature>/**`, pages `src/app/home/<feature>/**`
- Data/hooks: `src/hooks/*`, business logic `src/lib/*`, stores `src/stores/*`
Target (this repo): `src/features/<feature>/**`

## Layout of a feature
```
features/<name>/
  manifest.jsx   # path, label, icon, permission section, nav group, routes  (already exists as a stub)
  api/           # plain async functions using apiClient (no React)
  hooks/         # use-*.js : TanStack Query wrappers around api/
  schemas/       # zod schemas (+ inferred defaults)
  components/    # presentational pieces, small, one job each
  pages/         # route components that only compose hooks + components
  lib/           # pure helpers + their *.test.js
  index.js       # public exports; other features import ONLY from here
```
Routes are declared in `manifest.jsx` with `lazyRoute(() => import('./pages/x'), 'XPage')`. Sub-routes needing a stricter permission wrap their element in `<RequirePermission section=".." action="create">`. The sidebar and `/home/<path>` guard are generated from the manifest; do not edit `app/` except to register a NEW feature in `app/features.js`.

## Hard rules
1. **No colors in components.** No hex/rgb/hsl, no `bg-[...]`, `w-[...]` or any arbitrary Tailwind value, no `white`/`black`/`gray-500`-style palette classes. Use token classes only (`bg-surface`, `text-muted-foreground`, `bg-success-soft text-success`, `border-border`, `bg-primary`...). Need a new color/size? Add a token in `src/styles/tokens.css` (+ map it in `tailwind.config.js`) and use the semantic name. `npm run lint` must pass.
2. **Reuse, don't rebuild.** Dialogs: `Modal`, `ConfirmDialog`, `FormDialog` (`@/shared/components`). Forms: `TextField`, `SelectField`, `TextareaField`. Lists: `DataTable`, `Pagination`, `EmptyState`, `PageHeader`, `Card`, `Badge`, `Tabs`. If you need a generic component that does not exist, add it to `src/shared/components/` in a NEW file (so parallel branches do not conflict) and reuse it everywhere in your feature. Feature-specific things stay in the feature.
3. **Data flow:** component -> `use-*` hook -> `api/*` function -> `apiClient`. Components never import axios. Mutations invalidate their query keys and toast success/failure via `sonner` and `getErrorMessage`.
4. **Forms:** react-hook-form + zod (`zodResolver`). Put the schema in `schemas/`. Error text in Arabic, copied from the source.
5. **SOLID / junior readable:** one component = one job, files under ~150 lines, descriptive names, no clever one-liners, comments only for the why. Pull magic strings/numbers into named constants. Pure logic goes in `lib/` with a Vitest test.
6. **Parity:** same endpoints, same Arabic copy, same permission checks (`usePermissions().can(section, action)`) as the source. RTL: use logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`).
7. **Next -> React:** drop `'use client'`; `next/link` -> `react-router-dom` `Link`; `useRouter/usePathname/useSearchParams/useParams` -> react-router equivalents; `next/image` -> `<img>`; `react-icons`/FontAwesome/styled-components/react-bootstrap -> `lucide-react` + Tailwind. Assets from the source `public/` that you need: copy into `src/assets/<feature>/` and import.
8. Tabs that were `?tab=` search-param panels stay `?tab=` (use `useSearchParams`).
9. Install any extra npm package you need (`npm i <pkg>`), prefer ones already used by the source.

## Definition of done (per feature)
- Every source page of the feature is ported and reachable via its manifest routes (detail pages included).
- `npm run lint`, `npm run build` and `npx vitest run` all pass.
- Commit in small logical commits on your branch (no pushing; local only). Do not mention any AI tool in commit messages.
- Reply with: routes ported, anything skipped and why, any shared files you touched.

## Out of scope
Firebase push messaging, Next API routes/middleware. If the feature uses them, leave a clearly named TODO hook that returns a safe no-op.
