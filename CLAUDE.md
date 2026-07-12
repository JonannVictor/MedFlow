# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

MedFlow is a React Native (Expo) mobile app connecting patients and healthcare professionals for online consultations: search a professional, book a real slot, pay via Mercado Pago, join the video call. See `README.md` for full product flows (in Portuguese).

## Commands

```bash
pnpm install                 # install deps
pnpm dev                     # runs env injection + backend (tsx watch) + Expo (tunnel) concurrently
pnpm dev:web                 # Expo web only, no tunnel
pnpm dev:lan                 # Expo on LAN instead of tunnel
pnpm dev:server              # backend only (server/_core/index.ts via tsx watch)
pnpm check                   # tsc --noEmit
pnpm lint                    # expo lint
pnpm format                  # prettier --write .
pnpm test                    # vitest run (whole suite)
pnpm test -- medflow-scheduling   # run a single test file (vitest filters by name)
pnpm build                   # esbuild bundle of server/_core/index.ts -> dist/ (Node/ESM)
pnpm start                   # run built server (NODE_ENV=production node dist/index.js)
pnpm db:push                 # drizzle-kit generate && migrate (legacy MySQL path, see below — not the live DB)
```

No CI config in-repo; treat `pnpm check`, `pnpm lint`, and `pnpm test` as the pre-commit gate.

## Architecture: two backends, only one is live

This codebase was bootstrapped from a generic "Manus" Expo+tRPC+Drizzle+MySQL template, then the actual product was built directly against Supabase. Both stacks are still present. **When making changes, prefer the Supabase path — it's what the running app actually uses.**

- **Live path (Supabase):** the mobile app talks to Supabase directly from the client.
  - `lib/supabase.ts` — Supabase client.
  - `lib/medflow-supabase.ts` — all business logic and queries (professionals, appointments, availability, scheduling math, conflict checks). This is the real "backend" of the app.
  - `hooks/use-unified-auth.ts` + `hooks/use-unified-auth-redirect.ts` + `hooks/use-route-protection.ts` — Supabase Auth session, userType (`patient` | `professional`) stored in `user_metadata`, AsyncStorage caching, and route guarding.
  - `supabase/schema.sql` — source of truth for the DB schema (Postgres): `professionals`, `availability`, `appointments`, plus admin views (`patient_accounts`, `professional_accounts`, `appointments_overview`) and RLS policies. Apply changes here via the Supabase SQL editor; there is no migration tool for this side.
  - Node/Express backend (`server/_core/index.ts`) is only used for the **Mercado Pago payment endpoints** (`server/_core/payments.ts`) — preference creation, Pix, webhook/verify — because the access token can't live on the client. `lib/mercado-pago.ts` is the mobile-side client for those endpoints.

- **Legacy/unused path (Manus template — tRPC + Drizzle + MySQL + OAuth):** `server/routers.ts`, `server/db.ts`, `drizzle/schema.ts` + `drizzle/relations.ts`, `hooks/use-auth.ts`, `hooks/use-auth-supabase.ts`, `hooks/use-auth-redirect.ts`, and everything under `server/_core/` other than `payments.ts`/`env.ts`/`context.ts`/`cookies.ts`/`index.ts` (`oauth.ts`, `llm.ts`, `imageGeneration.ts`, `voiceTranscription.ts`, `sdk.ts`, `manusTypes.ts`, `systemRouter.ts`). None of this is wired into the screens that actually run. `pnpm db:push` operates on this dead MySQL schema, not on Supabase. Don't extend this path for new features; it's kept only because payments still boot through the same Express server. `server/README.md` documents this template layer in detail if you need historical context — treat it as background, not as current instructions.

- **Duplicate/orphaned routes:** `app/(tabs)/_layout.tsx` (live) renders a `<Slot/>` based on `userType` and routes to `/(tabs)/patient/*` or `/(tabs)/professional/*`. The sibling files `app/(tabs)/_layout-dynamic.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/appointments.tsx`, `app/(tabs)/professional-home.tsx`, `app/(tabs)/professional-profile.tsx`, `app/(tabs)/professional-schedule.tsx` are leftovers from an earlier flat-tabs design (they use the legacy `useAuth` hook) and are not reachable from current navigation. Verify before editing anything in `app/(tabs)/` that isn't under `patient/` or `professional/`.

## Navigation flow (Expo Router)

`app/index.tsx` checks `useUnifiedAuth()` and redirects: not authenticated → `/landing`; authenticated → `/(tabs)/patient` or `/(tabs)/professional` based on `userType`. `app/(tabs)/_layout.tsx` then renders the matching nested layout (`app/(tabs)/patient/_layout.tsx` or `app/(tabs)/professional/_layout.tsx`), each with its own tab bar. Auth screens live under `app/auth/` (login, patient-signup, professional-signup). `app/professional-detail.tsx` is the patient-facing booking flow entry (professional info → date/time → confirm). `app/payment-return.tsx` handles the Mercado Pago return deep link.

## Data model essentials (`supabase/schema.sql`)

- `professionals.id` = the Supabase auth user id (1:1 with `auth.users`), not a separate autoincrement id — booking/availability code treats `professionalId` as a UUID string everywhere (see `lib/medflow-supabase.ts`).
- `appointments` carries both scheduling state (`status`: pending/confirmed/cancelled/completed/no-show) and payment state (`payment_status`: pending/paid/failed, plus `payment_id`/`payment_preference_id`/`payment_checkout_url`). A professional can only confirm an appointment once a `meeting_url` is set on their profile (`confirmAppointmentWithMeetingUrl`).
- Availability is stored per `day_of_week` (Mon=0..Sun=6 — see `toStoredDayOfWeek`, which remaps JS's Sun=0 convention) as `start_time`/`end_time` ranges; `generateAvailableTimeSlots` expands ranges into hourly slots, and `filterBookedTimeSlots` removes slots already taken by pending/confirmed appointments. Date handling deliberately avoids `Date` timezone shifting (`formatDateOnlyString`/`parseDateOnlyString` operate on local y/m/d components) — a prior bug class was appointments landing on the wrong day.
- RLS is enabled on the main tables; when adding queries, check `supabase/schema.sql` for the relevant policy rather than assuming a query will succeed.

## Environment

`.env` (gitignored) plus `scripts/inject-env.js`, which runs before `pnpm dev`/`pnpm dev:web` and writes `lib/env-generated.ts` from `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` (preserving previously generated values if the shell env is missing them — don't rely on this to pick up a freshly changed `.env` value, delete `lib/env-generated.ts` if it seems stale). Required vars, per `README.md`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
EXPO_PUBLIC_API_BASE_URL=
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_WEBHOOK_URL=
EXPO_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=
```

## Path aliases

`@/*` → repo root, `@shared/*` → `shared/` (see `tsconfig.json`). Styling is NativeWind/Tailwind (`className` on RN components); theme tokens are defined in `theme.config.js` / `design.md`.

## Next steps / known issues

Pulled from `todo.md`'s open items, `README.md`'s "Status do projeto", and gaps found while mapping the architecture above. Not prioritized by the project owner yet — confirm before starting any of these.

**Open product work (from `todo.md` / `README.md`):**
- Mercado Pago webhook is not fully wired for automatic payment status updates — confirmation currently depends on the client returning through `payment-return.tsx` and calling verify, not a server-pushed webhook.
- No notifications for patient/professional (appointment created, confirmed, cancelled).
- No post-appointment ratings/reviews.
- No clinical history / consultation notes.
- No admin panel beyond the read-only Supabase SQL views in `supabase/schema.sql` + `supabase/ADMIN_GUIDE.md`.
- Form validation and error/success messaging are inconsistent across screens (partially done — see `todo.md` Fase 6).
- Mercado Pago Marketplace split payments (90/10 automatic payout to professional) — designed in `todo.md` "Fase Futura" but not started; would need OAuth-per-professional onboarding.
- `todo.md` flags an unresolved local dev issue: `dev:server` crashing outside the sandbox with exit code 3221225786 (Windows access-violation-style exit) — worth a fresh look if local dev is flaky.
- Dark mode is defined in `design.md`'s token table but "testar modo claro/escuro" is still unchecked in `todo.md`.

**Codebase health (found during this review, not yet actioned):**
- Dead code from the original template: `server/routers.ts`, `server/db.ts`, `drizzle/*`, `hooks/use-auth.ts`, `hooks/use-auth-supabase.ts`, `hooks/use-auth-redirect.ts`, and the OAuth/LLM/image/voice modules under `server/_core/` are unreferenced by the live app. Worth either deleting or clearly quarantining (e.g. under a `_legacy/` folder) so future edits don't land in the wrong stack.
- Orphaned routes in `app/(tabs)/` (`_layout-dynamic.tsx`, `index.tsx`, `appointments.tsx`, `professional-home.tsx`, `professional-profile.tsx`, `professional-schedule.tsx`) predate the `patient/` vs `professional/` split and appear unreachable from current navigation — confirm and remove.
- Two overlapping docs (`PROJECT_INFO.md` and `README.md`) describe the app differently (`PROJECT_INFO.md` still describes the old Manus-OAuth/MySQL auth flow as current). Worth consolidating into one doc now that `README.md` reflects the real Supabase-based flow.
- `tests/` only covers scheduling/date helpers and one skipped legacy auth test (`tests/auth.logout.test.ts` is `describe.skip`, written against the unused tRPC router) — no test coverage on `lib/medflow-supabase.ts`'s appointment/payment mutations or on the Mercado Pago flow.
