

# Fix build errors in GitHub-synced files

## Problem
Three files use `{ BottomNav }` (named import) but `BottomNav` is a default export.

## Changes

### 1. `src/pages/Guia.tsx` (line 5)
Change `import { BottomNav } from "@/components/BottomNav"` to `import BottomNav from "@/components/BottomNav"`

### 2. `src/pages/GuiaSection.tsx` (line 4)
Change `import { BottomNav } from "@/components/BottomNav"` to `import BottomNav from "@/components/BottomNav"`

### 3. `src/pages/SOSProtocol.tsx` (line 5)
Change `import { BottomNav } from "@/components/BottomNav"` to `import BottomNav from "@/components/BottomNav"`

The `exercise_sequence` type casting issue on line 33 of SOSProtocol.tsx should resolve once `types.ts` regenerates with the `sos_protocols` table schema (it already exists in the DB). If the error persists, we cast through `unknown` first: `as unknown as ExerciseSequenceItem[]`.

## Files modified
- `src/pages/Guia.tsx`
- `src/pages/GuiaSection.tsx`
- `src/pages/SOSProtocol.tsx`

