# Revire — Architecture & Roadmap

Last updated: 2026-07-24

## 1. What this document is

Revire started as a multi-module app (habits, addiction recovery, todos, reminders,
analytics, emergency tools, Firebase cloud sync — all built at once, all coupled together
through Realm and a shared module-toggle system). That made the codebase hard to reason
about: every screen touched five stores, and no single feature could be understood, tested,
or shipped in isolation.

This revamp resets scope to **one module, built properly: an offline-first Habit Tracker.**
Everything else has been parked, not deleted — it's real, working reference code, just not
wired into the active app. This document explains the current state, why things are laid
out this way, and the plan for growing back out from here.

## 2. Current active scope

The active app (`app/`, `src/`) implements the **Strive** design system — see
`design/strive-design-system/` for the source Stitch/Vercel export (`strive/DESIGN.md` has
the full token spec; each screen folder has the reference `code.html` + `screen.png`). Of
the 6 screens in that export, 4 are built as the real, Realm-backed app; the 5th
(Community/Leaderboard) needs a backend and real other users, so it's parked (§3) rather
than faked.

- **Onboarding** — Welcome → Profile Setup (name + avatar + join date, stored in
  `AsyncStorage`). No accounts — the welcome screen's "Log in" link was dropped since there's
  no auth backend.
- **Home** — daily progress ring, "Today's Focus" (habits scheduled today, tap to check off),
  current-streak chip, motivational quote, FAB to add a habit.
- **Habits** — "All Habits" list with Active/Paused/Completed tabs, per-habit streak + last-7-days
  bar chart, tap a card to edit, FAB to add.
- **Insights** — 6-month heatmap, category filter, weekly momentum line, success-by-category
  bars, Best Streak / Completion % / Consistent Time metrics — all derived from local Realm
  data, nothing hardcoded.
- **Profile** — avatar/name/joined date, stats grid (habits, streak, XP, completion %),
  locally-computed achievement badges, recent activity feed, reset-onboarding action (replaces
  "Log Out" — no auth to log out of).

Persistence is Realm, wired in for real: `RealmProvider` wraps the root layout, `Habit` is
the only registered schema.

```
app/
  _layout.tsx                 RealmProvider + root stack, PaperProvider, AsyncStorage onboarding gate
  (onboarding)/
    _layout.tsx
    index.tsx                 → WelcomeScreen
    profile.tsx                → ProfileSetupScreen
  (tabs)/
    _layout.tsx                Home / Habits / Insights / Profile tabs
    index.tsx                  → HomeScreen
    habits.tsx                  → HabitsScreen
    insights.tsx                 → InsightsScreen
    profile.tsx                   → ProfileScreen
  habits/
    add.tsx                    → AddHabitScreen (add mode, or edit via ?id=)

src/
  theme/            colors, dimensions, typography, strings — Strive tokens
  components/       Card, PillButton, Chip, ProgressRing, WeekBarChart, Heatmap,
                     LineTrend, TopBar — the Strive UI kit (SVG-based, no Tailwind)
  models/Habit.ts   Realm schema: Habit + embedded HabitCompletion
  services/
    Database.ts       RealmProvider/useRealm (schema: [Habit, HabitCompletion])
    HabitService.ts    CRUD + scheduling/completion logic
    InsightsService.ts  derived stats: heatmap, streaks, categories, achievements, XP
  stores/useHabitStore.ts   Zustand store wrapping a live Realm query listener
  screens/
    onboarding/     WelcomeScreen, ProfileSetupScreen
    home/           HomeScreen
    habits/         HabitsScreen, AddHabitScreen
    insights/       InsightsScreen
    profile/        ProfileScreen
```

## 3. `future-improvements/` — what's parked there and why

`future-improvements/legacy-app/` contains the **entire previous implementation**, moved
as-is (not deleted, not rewritten): `app/` and `src/` in full, plus the placeholder Firebase
config files (`GoogleService-Info.plist`, `google-services.json`). `future-improvements/IMPROVEMENTS.md`
is the pre-revamp code audit — still accurate for that code, since nothing in it was changed,
only moved.

Nothing in there is broken — it's a complete, working snapshot of the multi-module app as it
existed before this revamp, useful as a direct reference when any of these modules gets
rebuilt into the active app.

| Parked module | Where | Depends on |
|---|---|---|
| Addiction recovery (streaks, urge logging, relapse tracking) | `screens/addiction/`, `widgets/addiction/`, `models/Addiction.ts`, `RelapseLog.ts`, `UrgeLog.ts`, `services/AddictionService.ts`, `UrgeService.ts`, `stores/useAddictionStore.ts`, `useUrgeStore.ts`, `animations/BrainRewireAnimation.tsx`, `UrgeWaveAnimation.tsx` | Realm |
| Emergency / calm-down tools | `screens/emergency/`, `widgets/emergency/` | — |
| Analytics dashboards | `screens/analytics/`, `widgets/analytics/`, `stores/useAnalyticsStore.ts` | Realm |
| Todos | `screens/todos/`, `models/Todo.ts`, `services/TodoService.ts`, `stores/useTodoStore.ts` | Realm |
| Reminders / notifications | `screens/reminders/`, `models/Reminder.ts`, `services/ReminderService.ts`, `stores/useReminderStore.ts`, `stores/useNotificationStore.ts`, `utils/notificationHelper.ts`, `widgets/home/NextReminderCard.tsx` | Realm, notifee |
| Multi-module onboarding & settings | `screens/onboarding/ModuleSelectionScreen.tsx`, `AddictionSetupScreen.tsx`, `widgets/onboarding/ModuleCard.tsx`, `AddictionSetupExtras.tsx`, `models/ModuleConfig.ts`, `stores/useModuleStore.ts`, `screens/settings/ModuleSettingsScreen.tsx` | Realm |
| Cloud backup & sync | `services/Database.ts`, `FirebaseService.ts`, `BackupService.ts`, `EncryptionService.ts`, `stores/useAuthStore.ts`, `useSyncStore.ts`, `screens/settings/BackupScreen.tsx` | Realm, Firebase |
| Original (Realm-backed) Habit implementation | `screens/habits/HabitsScreen.tsx`, `AddHabitScreen.tsx`, `models/Habit.ts`, `services/HabitService.ts`, `stores/useHabitStore.ts` | Realm |
| Full-app root wiring for the above | `app/addiction/[id].tsx`, `app/relapse/[id].tsx`, `app/phone-usage.tsx`, `app/(tabs)/emergency.tsx`, `analytics.tsx`, `todos.tsx`, `reminders.tsx`, `app/settings/backup.tsx`, `modules.tsx`, `app/(onboarding)/modules.tsx`, `addiction-setup.tsx` | — |
| Community / Leaderboard (Strive design) | `design/strive-design-system/leaderboard/` (design reference only — never implemented in RN) | a real backend + other real users |

The `theme/`, `components/`, `models/Habit.ts`, `services/`, and `stores/` under
`future-improvements/legacy-app/src/` belonged to the **pre-Strive** dark-glassmorphism UI
(purple/coral, `GlassCard`/`GlowButton`) and the old multi-model Realm schema. They were
superseded, not extended, once the Strive design arrived — the active `src/` now has its own
Strive-native versions of all of these (different palette, different component set, different
`Habit` schema shape). Don't try to merge the two; treat the legacy copies as frozen
historical reference only.

## 4. Reintroducing a parked module

When a module from the table above is ready to come back:

1. Copy (don't move) its files from `future-improvements/legacy-app/src/...` into the
   matching path under active `src/...`.
2. Reconcile shared-file conflicts — the legacy versions of `theme/`, `components/`, `utils/`
   may have drifted from the active copies by then; diff before overwriting.
3. If it depends on Realm, follow the schema-registration pattern in
   `future-improvements/legacy-app/src/services/Database.ts` — register the model's schema,
   wrap the root layout in `RealmProvider`, and initialize the corresponding store the same
   way `app/_layout.tsx` used to (see the legacy `RootLayoutInner`).
4. Re-add its route(s) under `app/`, and its tab under `app/(tabs)/_layout.tsx`.
5. Re-run the module through `future-improvements/IMPROVEMENTS.md` — some of those findings
   (e.g. the Firebase plaintext-storage issue, the `nextDue()` day-gating bug) should be
   fixed as part of bringing the module back, not carried forward again.

## 5. The offline Habit Tracker — what's implemented

Built against the `design/strive-design-system/` export (Home, All Habits, Insights,
Profile, Welcome — Community/Leaderboard excluded, see §3).

**Data model** (`src/models/Habit.ts`) — `Habit` is a `Realm.Object` with an embedded
`HabitCompletion` list (`{ date: 'yyyy-MM-dd', completedAt: Date }` per completion, not just
a flat date array) so Insights can derive a "most consistent hour" stat from real timestamps,
not just day-level data:

```
Habit { name, icon (MaterialCommunityIcons glyph), category, scheduleType: 'daily'|'custom',
        activeDays: int[] (0=Sun..6=Sat, only used when scheduleType='custom'),
        targetLabel (free text, e.g. "45 MINS"), status: 'active'|'paused'|'completed',
        completions: HabitCompletion[], currentStreak, longestStreak, createdAt, updatedAt }
```

- **Service** (`src/services/HabitService.ts`) — CRUD + `isScheduledOn`/`isCompletedOn`/
  `toggleToday`, which also recomputes `currentStreak`/`longestStreak` on every toggle via
  `streakCalculator`.
- **Derived stats** (`src/services/InsightsService.ts`) — everything the Insights and Profile
  screens show (heatmap values, category success rates, weekly completion trend, best streak,
  overall completion rate, most-consistent-hour, XP, achievements, recent activity) is computed
  from the live `Habit[]` array — nothing is stored redundantly or hardcoded.
- **Store** (`src/stores/useHabitStore.ts`) — Zustand store wrapping a live Realm query
  listener; screens read `habits` and never touch `realm` directly except to pass it into
  service/store calls.
- **XP and achievements are real, just not multiplayer** — `InsightsService.xpPoints` /
  `.achievements` are computed from the user's own local completion history (a simple
  `completions × 10 + bestStreak × 5` formula, and threshold-based badges like "on a ≥7-day
  streak" or "≥100 total completions"). This is different from the parked Leaderboard, which
  would need to compare against *other* real users.

**Known fidelity gaps** (visual approximations, not architectural gaps):
- **Fonts** — the design specifies Geist / Geist Mono, which aren't on Google Fonts and
  aren't bundled here (`expo-font` is installed and ready). `src/theme/typography.ts` uses
  system sans/monospace fallbacks but keeps the exact type *scale* (sizes, weights, negative
  letter-spacing) from `strive/DESIGN.md`. Drop real Geist `.ttf` files into `assets/fonts/`,
  load them via `expo-font` in `app/_layout.tsx`, and swap `fonts.sans`/`fonts.mono` in
  `typography.ts` to finish this.
- **"Streak Growth" chart** — the design shows a smooth historical streak line; since only
  completion events are stored (not historical streak snapshots), `InsightsService.weeklyCompletionTrend`
  uses weekly total completions as an honest proxy for momentum instead.
- **Heatmap grid** — approximates the design's exact 26-column CSS grid using percentage
  widths + wrap; close but not pixel-identical.
- **Welcome screen hero art** — the design's macro photography image is replaced with a
  plain icon placeholder (no image asset pipeline set up yet).

## 6. Target structure for when the app scales back out

The current `src/` layout is **type-based** (`screens/`, `widgets/`, `services/`, `models/`,
`stores/` at the top level, feature folders one level down). That was workable for one
module; it will get painful again the moment two or three modules come back, for the same
reason it did before: nothing stops a screen in one feature from reaching into another
feature's store.

Recommended direction for the next reorg pass (not done in this one — scoped out
deliberately, see change log below): move to **feature-based modules**, each self-contained:

```
src/
  features/
    habits/
      screens/       HabitsScreen.tsx, AddHabitScreen.tsx
      widgets/        HabitOverviewRow.tsx, ...
      model.ts         Habit schema
      service.ts        HabitService
      store.ts           useHabitStore
    addiction/
      ...same shape...
    reminders/
      ...
  shared/
    theme/
    components/
    utils/
  app-shell/          RootLayout wiring, Database.ts, onboarding gate
```

Rule of thumb once this lands: a feature folder may import from `shared/`, never from
another feature folder directly. Cross-feature communication (e.g. Home showing a Habits
summary) goes through a narrow exported interface (e.g. `features/habits/index.ts` exposing
only what other features need), not deep imports into another feature's internals. This is
what would have prevented the current `HomeScreen` → `useAddictionStore` + `useTodoStore` +
`useReminderStore` + `useHabitStore` coupling that made the original code hard to touch.

Do this reorg once there are at least two active modules — restructuring folders for a
single-module app is pure overhead.

## 7. Deferred / explicitly out of scope for this pass

- **No feature-folder refactor yet** — current active code keeps the existing type-based
  layout (§6 is the plan for *when*, not *now*). Habits is still the only real module, so
  there's nothing to isolate from yet.
- **Real Geist fonts, exact heatmap grid math, welcome-screen hero photography** — see the
  fidelity-gap list in §5. All visual, none architectural.
- **Community/Leaderboard** — parked per §3; would need a backend and real other users,
  which is a different project than "offline habit tracker."
- **`package.json` dependencies left untouched** — `realm`, `@realm/react` are now genuinely
  used by the active app. `@react-native-firebase/*`, `notifee`, `react-native-share`, etc.
  are still unused by the active app but remain real dependencies of the code parked in
  `future-improvements/`. Don't strip them without also deciding those modules are gone for
  good.
- **`future-improvements/IMPROVEMENTS.md` findings** — not fixed, just relocated. They apply
  to the parked code as-is and should be addressed when each module is reintroduced (§4).

## 8. Change log

- **2026-07-24 (a)** — Reset active scope to Habits + Onboarding + Settings. Moved the full
  previous implementation (addiction, todos, reminders, analytics, emergency, cloud sync,
  multi-module onboarding/settings, and the Realm-backed Habit implementation) to
  `future-improvements/legacy-app/`. Removed Firebase wiring from `app.json`. Rebuilt Home /
  Habits (placeholder) / Settings / Onboarding as a minimal AsyncStorage-only skeleton.
- **2026-07-24 (b)** — Implemented the real Habit Tracker against the Strive design system
  (`design/strive-design-system/`, moved from the repo root where it arrived as
  `stitch_vercel_habit_tracker_design_system/`). Dropped Community/Leaderboard from v1 nav
  (parked, needs a backend). Replaced the dark-glassmorphism `src/theme` and `src/components`
  with Strive-native tokens/primitives (old ones superseded in `future-improvements/legacy-app/`,
  not merged). Wired Realm for real: `Habit` + embedded `HabitCompletion` schema,
  `HabitService`, `InsightsService` (derived stats), `useHabitStore`. Built Home, Habits
  (list + add/edit), Insights, and Profile screens; merged Settings into Profile (4 tabs
  total, matching the design). Verified with `tsc --noEmit`, `eslint`, and an Android Metro
  bundle export (2025 modules, no resolution errors).
