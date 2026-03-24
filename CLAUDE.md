# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Obyte Coop UI — a web application built with TanStack Start (React 19 SSR framework), using file-based routing, TanStack Query for data fetching, and ParaglideJS for i18n.

## Domain: COOP Token & Cooperative Incentives

COOP is a dapp on Obyte that encourages cooperative community engagement. The goal is to reinvigorate the Obyte community by anchoring positive emotions, rewarding contributions, and bringing people back.

### COOP Token Mechanics

- **Initial supply is 0.** All COOP is created through daily emission.
- Users deposit COOP (or GBYTE) to an Autonomous Agent (AA) and lock for a minimum of 1 year. Unlock date must be at least 1 year into the future to be eligible to vote and receive distributions.
- **Real-name attestation** is required (one user, one account) unless the user deposits at least 500 COOP. Users must also be attested on Telegram or Discord for bot notifications.
- **Referral system**: a user can indicate a referrer on first deposit. Both get a fixed reward (capped by balances) to locked accounts. Referrer also receives 1% of the new user's lifetime deposits in liquid COOP. Referrer can waive this reward for family/friends.

### Daily Emission

- **1% of total locked balance** per day → added to locked balances.
- **0.1% of total locked balance** per day → distributed as liquid COOP.
- Each emission is split 50/50:
  - 50% distributed among contributors proportional to **votes received** (balance-independent — benefits work contributors).
  - 50% distributed proportional to **votes × contributor's locked balance** (benefits financial contributors).

### Voting

- Users cast votes for other users who make useful contributions.
- **Vote weight = sqrt(locked balance)** — quadratic weighting between democracy and plutocracy.
- **Vote strength**: 1, 2, or 3 (use 0 to unvote).
- **Votes expire after 3 months** — contributors must keep contributing to maintain income.
- Tit-for-tat voting is possible and not prohibited.

### Three Types of Contributions

1. **Work**: development (tools, apps, improvements) and social (articles, tweets, videos).
2. **Financial**: buying and locking COOP/GBYTE in significant amounts to support demand/price.
3. **Curation**: recognizing contributors, encouraging votes, discovering underappreciated work, supporting healthy discussions.

### GBYTE ↔ COOP

- Users can lock GBYTE instead of COOP. Price formula: starts at 1, doubles every year.
- If COOP market price grows faster than the formula, buy pressure redirects to GBYTE.
- Users can replace locked GBYTE with locked COOP (and vice versa) at the formula price — creates arbitrage that stabilizes the COOP price.

### Governance

- Almost all parameters are changeable by governance vote.
- Only users with unlock date > 1 year into the future can vote in governance.
- Governance uses quadratic voting (vote weight = sqrt(locked balance)).

## Commands

- `pnpm dev` — dev server on port 3000
- `pnpm build` — production build
- `pnpm test` — run tests (vitest)
- `pnpm lint` — eslint check
- `pnpm format` — prettier check
- `pnpm check` — auto-fix formatting and lint (`prettier --write . && eslint --fix`)

Add shadcn components: `pnpm dlx shadcn@latest add <component>`

## Architecture

- **Framework**: TanStack Start (Vite + React 19 with SSR). React Compiler enabled via babel plugin.
- **Routing**: File-based via TanStack Router. Routes in `src/routes/`, route tree auto-generated in `src/routeTree.gen.ts`. Root layout in `src/routes/__root.tsx`.
- **Data fetching**: TanStack Query integrated at root level (`src/integrations/tanstack-query/`). Router context carries `QueryClient`.
- **State**: TanStack Store available (`src/lib/demo-store.ts`).
- **i18n**: ParaglideJS with URL-based locale strategy. Messages in `messages/` (en, de). Generated runtime in `src/paraglide/` (auto-generated, do not edit).
- **Styling**: Tailwind CSS v4 with custom design tokens (CSS variables in `src/styles.css`). Shadcn UI (new-york style, zinc base color). Custom utility classes: `.page-wrap`, `.island-shell`, `.feature-card`, `.display-title`, `.nav-link`, `.rise-in`.
- **Env vars**: Type-safe via T3 Env (`src/env.ts`). Client vars must be prefixed `VITE_`.
- **UI components**: Shadcn components in `src/components/ui/`, app components in `src/components/`.

## Path Aliases

- `#/*` → `./src/*` (primary, used in imports and shadcn config)
- `@/*` → `./src/*` (also configured in tsconfig)

## Code Style

- Prettier: no semicolons, single quotes, trailing commas
- ESLint: TanStack config with relaxed rules (no import ordering, no cycle checks, no require-await)
- TypeScript strict mode enabled
