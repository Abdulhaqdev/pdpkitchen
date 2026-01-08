# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 15 admin dashboard application for student meal management. Uses TypeScript, Shadcn UI components, Clerk authentication, and TanStack React Query for data fetching.

## Commands

```bash
pnpm install          # Install dependencies (uses legacy-peer-deps)
pnpm dev              # Start dev server with Turbopack
pnpm build            # Production build
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues and format
pnpm format           # Format with Prettier
```

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/features/` - Feature modules (auth, products, overview, kanban, profile)
- `src/components/` - Shared components (ui/, layout/, forms/, tables/)
- `src/lib/` - Core utilities and API layer
- `src/hooks/` - Custom React hooks
- `src/constants/` - Static data and navigation config

### Key Patterns

**Feature Organization**: Each feature in `src/features/` contains its own components, utils, and optionally a Zustand store. Example: `src/features/kanban/` has components, dialogs, and a store.

**API Layer**: All data fetching uses custom hooks in `src/lib/api.ts`:
- `useApiQuery(endpoint, options)` - GET requests with TanStack Query
- `useApiMutation(endpoint, options)` - POST/PUT/DELETE mutations
- Base URL: `http://10.20.0.152:8000/api/`
- Token stored in localStorage, auto-refresh on 401

**Parallel Routes**: Dashboard overview uses Next.js parallel routes (`@sales`, `@bar_stats`, `@pie_stats`, `@area_stats`) for independent loading states.

**URL State**: Search params managed with Nuqs in `src/lib/searchparams.ts` (page, perPage, name, gender, category).

**Forms**: React Hook Form with Zod validation. Reusable form components in `src/components/forms/`.

**Data Tables**: TanStack Table with server-side pagination/filtering. Table utilities in `src/components/tables/` and `src/lib/data-table.ts`.

### State Management

- Server state: TanStack React Query
- Client state: Zustand (feature-local, e.g., kanban store with persistence)
- URL state: Nuqs

### Styling

- Tailwind CSS v4 with `tailwindcss-animate`
- Theme toggle with `next-themes`
- Component styling via `cn()` utility (clsx + tailwind-merge) from `src/lib/utils.ts`

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard/overview
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard/overview
```

Optional Sentry config:
```
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_SENTRY_DISABLED=false
```

## Important Files

- `src/lib/api.ts` - API hooks and token management
- `src/app/dashboard/layout.tsx` - Dashboard shell with sidebar
- `src/components/layout/providers.tsx` - QueryClient and theme providers
- `src/features/kanban/utils/store.ts` - Zustand store example
- `next.config.ts` - Image domains and Sentry integration
