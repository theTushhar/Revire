# Revire (React Native)

**Revire** — an offline-first habit tracker built with React Native (Expo), Realm, and Zustand.

The app is a single focused module (Habits, backed by Realm). See [ARCHITECTURE.md](ARCHITECTURE.md) for the full plan, current scope, and roadmap.

> Note: `future-improvements/` (parked modules: addiction recovery, reminders,
> analytics, todos, emergency tools, Firebase cloud sync) and `design/` (design
> references) are intentionally **not** pushed to GitHub — they are local-only
> reference material (see `.gitignore`). The `google-services.json` /
> `GoogleService-Info.plist` placeholders kept there are dummy values, not real
> credentials.

## Prerequisites

Ensure you have Node.js and npm installed on your system.

## Getting Started

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Run the App:**
   ```bash
   # Start the Expo development server
   npm run start

   # Run on Android
   npm run android

   # Run on iOS
   npm run ios
   ```

## Available Scripts

In the project directory, you can run:

- `npm run start`: Starts Expo Go and development tools.
- `npm run android`: Starts the development server and opens the app on an Android emulator or connected device.
- `npm run ios`: Starts the development server and opens the app on an iOS simulator.
- `npm run lint`: Runs ESLint on the project to check for lint errors.
- `npm run format`: Runs Prettier to auto-format files.
- `npm run test`: Runs Jest unit tests.
- `npm run tsc`: Type-checks the project with TypeScript (`--noEmit`).
