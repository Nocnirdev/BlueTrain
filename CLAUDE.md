# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server with HMR at http://localhost:5173
npm run build      # TypeScript check + Vite production build → dist/
npm run preview    # Serve the production build locally
npm run typecheck  # Type-check without emitting files
```

No test suite is configured. Use `npm run typecheck` to verify correctness before committing.

## Environment setup

Copy `.env.example` to `.env` and fill in Supabase credentials before running:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

The database schema lives in `supabase/schema.sql` — run it in the Supabase SQL Editor when setting up a new project.

## Architecture

Vanilla TypeScript with ES modules, no frontend framework. Vite 6 as bundler. Path alias `@/` maps to `src/`.

**Layer responsibilities:**

| Layer | Where | Role |
|-------|-------|------|
| Entry | `src/main.ts` | Imports CSS, calls `init()` |
| Orchestration | `src/app.ts` | View router, auth gate, global event listeners, custom DOM events (`bt:*`) |
| Views | `src/views/*.ts` | One render function per screen; called from `app.ts` on navigation |
| Services | `src/services/` | Auth (`auth.ts`), unified data layer (`db.ts`), localStorage cache (`storage.ts`) |
| Data | `src/data/` | Static typed data: 7 workout sessions, 8 competition stations, 40+ SVG animations |
| Components | `src/components/` | `toast.ts` (notifications), `dialog.ts` (replaces `window.confirm`) |
| Lib | `src/lib/` | `supabase.ts` (client singleton), `html.ts` (XSS helpers + DOM utils) |
| Types | `src/types/index.ts` | All TypeScript interfaces for the entire app |

**Data flow — authenticated vs. offline:**

`DB` service (`src/services/db.ts`) is the single access point for persistence. It checks `Auth.getState().userId`: if authenticated it calls Supabase, otherwise falls back to `LocalStorage`. Writes always update localStorage as a local cache. On first login, `DB.migrateLocalData()` migrates anonymous sessions to Supabase.

**View switching:**

`switchView(view: ViewName)` in `app.ts` toggles `.active` on section elements. Competition and Nutrition views render only once (`_rendered` flag). Dashboard, Training, and History re-render on each navigation. Training uses `renderSession(sessionKey)` for the active mesocycle session.

**Custom DOM events** bridge views to the router without circular imports:
- `bt:sessionSaved` → refreshes Dashboard/History
- `bt:showProfile` → opens profile modal
- `bt:viewAll` / `bt:goTrain` → navigates to History/Training

## Key conventions

- **XSS safety**: always use `esc()` from `src/lib/html.ts` when interpolating user data into `innerHTML`. `setHTML()` is for own templates only.
- **TypeScript strict mode** with `noUnusedLocals` and `noUnusedParameters` — all variables must be used.
- **`@/` alias** for all cross-module imports (e.g., `import { DB } from '@/services/db'`).
- Supabase RLS enforces data isolation at the DB level — never filter by `user_id` in app code alone; the DB policies already restrict access.
- `performance` field in `SessionEntry` is a `Record<string, string>` JSONB column — free-form exercise performance notes keyed by exercise name.

## Token efficiency

- `src/data/` contiene ficheros grandes (40+ SVG inline y datos estáticos). NO leerlos completos: usar grep para localizar la entrada concreta y leer solo ese fragmento.
- `supabase/schema.sql` es la referencia del esquema; leerla solo si la tarea toca la base de datos.
- No leer `package-lock.json` nunca.
