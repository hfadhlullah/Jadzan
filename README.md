# Jadzan — Monorepo

## Project Structure
```
Jadzan/
├── apps/
│   ├── admin/          # Next.js 14 Admin Panel (Web)
│   └── tv/             # Expo React Native TV App (Android)
├── supabase/
│   ├── migrations/     # SQL migration files
│   └── seed.sql        # Dev seed data
└── docs/               # Project documentation
```

## Prerequisites
- `bun` >= 1.3
- `node` >= 20
- Supabase CLI (`bunx supabase`)
- EAS CLI (`bunx eas-cli`) — for TV APK builds

## Getting Started

### 1. Admin Panel (JADZ-002)
```bash
cd apps/admin
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
bun install
bun run dev
# → http://localhost:3000
```

### 2. TV App (JADZ-003)
```bash
cd apps/tv
cp .env.example .env
bun install
# Download fonts (see assets/fonts/README.md)
bunx expo start
# → Scan QR with Expo Go or run on Android emulator
```

### 3. Database (JADZ-001)
```bash
# Connect to your Supabase project
bunx supabase link --project-ref <your-project-ref>
bunx supabase db push
# → Applies supabase/migrations/001_initial_schema.sql
```

### 4. Generate TypeScript Types
```bash
bunx supabase gen types typescript --linked > apps/admin/src/types/supabase.ts
```

## Package Manager
This project uses **bun** exclusively. Do not use `npm` or `yarn`.

## Story Index
See `docs/features/` for all implementation stories (JADZ-001 → JADZ-031).
