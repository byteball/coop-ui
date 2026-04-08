# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Obyte Coop UI — a client-side SPA built with Vite, React 19, and TanStack Router (file-based routing). Uses TanStack Query for data fetching, TanStack Store for state management, and ParaglideJS for i18n.

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

## AA Actions Reference

Smart contracts are in `aa/coop.oscript` and `aa/governance.oscript`.

### coop.oscript — 7 actions

**1. Define** — one-time initialization, creates COOP asset and governance AA.

- `trigger.data`: `{ define: 1 }`

**2. Set variable** — called only by governance AA, records new parameter value.

- `trigger.data`: `{ name, value }` (from governance AA only)

**3. Deposit** — lock COOP and/or GBYTE tokens.

- `trigger.data`: `{ deposit: 1 }` + optional `{ term: number (days, min 365, default 365), ref: address (first deposit only), no_referrer_deposit_reward: 1 }`
- Payment: COOP tokens and/or bytes (above 10000 bounce fee)
- Requirements: messaging attestation, real-name attestation OR balance >= 50 COOP, not an AA, one account per user
- Response event fields: `type: 'deposit', owner, amount, bytes_amount, referral_reward, total_balance`

**4. Vote** — cast vote for a contributor.

- `trigger.data`: `{ vote: 1, for: address, strength: 0|1|2|3 }` + optional `{ delete_expired_votes: { from_addr: to_addr, ... } }` (up to 5)
- Requirements: registered user with balance, unlock_date >= +1 year (both voter and recipient), cannot vote for self
- Vote weight: `sqrt(total_balance) * strength`. Self-vote at strength=3 is auto-added.
- `delete_expired_votes` removes votes older than 90 days to clean up stale vote weight.
- Response event fields: `type: 'vote', address, for, strength, votes, total_balance, for_total_balance`

**5. Claim** — withdraw liquid rewards.

- `trigger.data`: `{ claim: 1 }` + optional `{ restake_percent: 0-100 }`
- Sends `floor(liquid_balance * (1 - restake_percent/100))` COOP to user. Restaked portion goes to locked balance. Auto-extends unlock_date to +1 year if restaking.
- Response event fields: `type: 'claim', address, claimed_amount, restaked_amount, restake_percent, total_balance`

**6. Withdraw** — full withdrawal after unlock date.

- `trigger.data`: `{ withdraw: 1 }`
- Requirements: unlock_date has passed, non-zero balance
- Sends all bytes_balance + balance + liquid_balance. Zeroes all balances. Pings governance AA to update user's vote weight.
- Response event fields: `type: 'withdrawal', address, balance, bytes_balance, total_balance: 0`

**7. Replace** — swap locked COOP ↔ locked bytes at ceiling_price.

- `trigger.data`: `{ replace: 1 }` + send COOP **or** bytes (not both)
- Send COOP → receive bytes back. Send bytes → receive COOP back. Price: `2^((now - launch_ts) / year)`.
- Response event fields: `type: 'replace', address, received_amount, received_bytes_amount, out_amount, out_bytes_amount, total_balance`

### governance.oscript — 3 actions

**1. Vote/Support** — propose or support a parameter value.

- `trigger.data`: `{ name: string, value: string|number }` (omit `value` to retract vote)
- Requirements: coop user with unlock_date >= +1 year and non-zero balance
- Vote weight: `sqrt(total_balance)`. If value gets more support than current leader → becomes new leader, 3-day challenging period restarts.
- Governable parameters (number 0–1): `daily_locked_reward`, `daily_liquid_reward`, `bytes_reducer`, `by_votes_share`, `referrer_coop_deposit_reward_share`, `referrer_bytes_deposit_reward_share`
- Governable parameters (integer >= 0): `referral_reward`, `min_balance_instead_of_real_name`
- Governable parameters (string, colon-separated addresses): `messaging_attestors`, `real_name_attestors`

**2. Commit** — apply the leading value after challenging period.

- `trigger.data`: `{ name: string, commit: 1 }`
- Requirements: leader exists, differs from current value, 3-day challenging period expired
- Sends `{ name, value }` to coop AA

**3. Update user balance** — recalculate user's governance vote weight.

- `trigger.data`: `{ update_user_balance: 1, address: string }`
- Called automatically by coop AA on withdraw. Can also be called manually.
- Recalculates `sqrt(balance)` across all governance votes for the user.

## Commands

- `pnpm dev` — dev server on port 3000
- `pnpm build` — production build
- `pnpm test` — run tests (vitest)
- `pnpm lint` — eslint check
- `pnpm format` — prettier check
- `pnpm check` — auto-fix formatting and lint (`prettier --write . && eslint --fix`)

Add shadcn components: `pnpm dlx shadcn@latest add <component>`

## Architecture (Feature-Sliced Design)

Project follows [FSD](https://feature-sliced.design/) structure under `src/`:

- **`app/`** — global setup: entry point (`main.tsx`), router, providers (`providers/`), bootstrap, styles.
- **`pages/`** — TanStack Router file-based routes. Root layout in `__root.tsx`. Route tree auto-generated in `src/routeTree.gen.ts`.
- **`widgets/`** — composed UI blocks: `header/`, `footer/`, `layout/`.
- **`features/`** — user interactions: `deposit/`, `connect-wallet/`, `voting/`, `governance/`, `referrals/`.
- **`entities/`** — business domain: `user/`, `coop/`, `token/`, `governance/`, `emission/`.
- **`shared/`** — reusable infrastructure:
  - `config/` — env vars (`env.ts` via T3 Env) and app config (`appConfig.ts`).
  - `ui/` — Shadcn components (new-york style, zinc base) and illustrations.
  - `lib/` — utilities (`utils.ts` with `cn()`).
  - `api/` — Obyte WebSocket client.
  - `i18n/` — re-exports from ParaglideJS runtime.

**FSD import rule**: higher layers import from lower layers only (`app` > `pages` > `widgets` > `features` > `entities` > `shared`).

### Key details

- **Framework**: Vite + React 19 (client-side SPA, no SSR). React Compiler enabled via `babel-plugin-react-compiler` in vite config.
- **Routing**: TanStack Router with file-based routes in `src/pages/`. Router context carries `QueryClient`.
- **Data fetching**: TanStack Query for server state, TanStack Store for client state.
- **i18n**: ParaglideJS with cookie/localStorage locale strategy. Locales: en (base), zh, es, ru, uk. Messages in `messages/`. Generated runtime in `src/paraglide/` (auto-generated, do not edit).
- **Styling**: Tailwind CSS v4 with custom design tokens (CSS variables in `src/app/styles.css`).
- **Env vars**: Type-safe via T3 Env (`src/shared/config/env.ts`). Client vars must be prefixed `VITE_`.

## Path Aliases

- `#/*` → `./src/*` (primary, used in imports and shadcn config)
- `@/*` → `./src/*` (also configured in tsconfig)

## Code Style

- Prettier: semicolons, double quotes, trailing commas
- ESLint: TanStack config with relaxed rules (no import ordering, no cycle checks, no require-await)
- TypeScript strict mode enabled

## Shared Utilities (`src/shared/lib/`)

- **`encodeData(data)`** — Base64-encodes an object for Obyte deep-link `base64data` parameter. Use when building wallet links.
- **`generateLink({amount, aa, data, ...})`** — Generates an `obyte:` deep-link for sending a transaction to an AA. Auto-appends testnet/livenet suffix. Use for all transaction buttons (deposit, vote, claim, withdraw, replace, governance).
- **`formatPeriod(periodEndTs)`** — Formats remaining time until a unix timestamp as a human-readable string ("3 days 4h 12m"). Use for lock period countdowns, governance challenging period, etc.
- **`formatDateShort(date)`** — Formats a Date using the app's current locale (short month). Use instead of raw `toLocaleDateString`.
- **`getAllStateVarsByAddress(address)`** — Loads all AA state vars with pagination. Used during bootstrap.
- **`getCeilingPrice(launchTs)`** — Calculates GBYTE/COOP ceiling price: `2^((now - launch_ts) / year)`.
- **`getExplorerUrl(value, type)`** — Generates an Obyte Explorer URL for an address, transaction, or asset.
- **`openCustomProtocol({href, onProtocolMissing, ...})`** — Opens an `obyte:` deep-link with wallet detection. Special handling for Mobile Safari.
- **`toLocalString(value)`** — Formats a number with locale-aware separators (up to 9 significant digits). Use for balances and amounts.
- **`toOrdinal(n)`** — Appends English ordinal suffix (1st, 2nd, 3rd...). Use for leaderboard positions.
