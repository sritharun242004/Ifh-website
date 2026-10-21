# IFH Connects: Frontend Tech Stack

The frontend is a pnpm + Turborepo monorepo in `frontend/` with three apps and three shared packages. Everything is written in TypeScript.

## Shared across apps

| Concern | Tech |
|---|---|
| Monorepo | pnpm 10 workspaces + Turborepo 2 |
| Language | TypeScript 5.7, Node 20+ |
| Server state / data fetching | TanStack Query v5 |
| Validation | Zod 3 (validators live in `@ifh/core`) |
| Formatting | Prettier 3 |

## Tenant web app (`apps/web`, port 3005)

- **Framework:** Next.js 14.2 (App Router, `src/app/`) with React 18.3
- **Forms:** React Hook Form + `@hookform/resolvers` (Zod)
- **Client state:** Zustand 5
- **Maps:** Mapbox GL JS 3
- **Theming:** next-themes (light/dark)
- **Smooth scrolling:** Lenis
- **E2E tests:** Playwright
- **Lint:** ESLint 8 + `eslint-config-next`

## Admin console (`apps/admin`, port 3002)

- Next.js 14.2 (App Router) with React 18.3 and TanStack Query
- A lighter build than web: no form library, maps or Zustand

## Mobile app (`apps/mobile`, Expo on port 8081)

- **Framework:** Expo SDK 54 with React Native 0.81
- **Navigation:** React Navigation 6 (native stack and bottom tabs)
- **Secure storage:** `expo-secure-store` (for tokens)
- **Client state:** Zustand 5
- **Native deps:** `react-native-screens`, `react-native-safe-area-context`

## Shared packages

| Package | Purpose |
|---|---|
| `@ifh/core` | Domain types, service interfaces with mocks and fixtures, Zod validators, HTTP client, money/time utils. Tested with Vitest 2. |
| `@ifh/ui` | React UI components for the web apps. Styled with plain CSS and CSS variables, using `clsx`. |
| `@ifh/tokens` | Design tokens in three layers (primitive, semantic, component). Exported as TS, JSON and CSS so web and mobile share them. |

## Styling

There is no Tailwind, CSS Modules or CSS-in-JS. The web apps use plain CSS driven by the token CSS variables.

## Known issue: React version conflict in mobile

The root `package.json` has a pnpm override that pins `react` and `react-dom` to **18.3.1** across the whole workspace. Mobile declares `react: 19.1.0`, but the lockfile resolves it to 18.3.1. Expo 54 and React Native 0.81 expect React 19.1, so mobile may crash at runtime or show peer-dependency errors.

**Fix:** scope the override to the web packages, or give mobile its own React version.
