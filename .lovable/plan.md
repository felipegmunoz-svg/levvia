

# Add dev bypass for day lock

## Changes

### 1. Create `src/lib/config.ts`
```ts
// REMOVER ANTES DO BETA — apenas para testes internos
export const DEV_BYPASS_DAY_LOCK = true;
```

### 2. `src/pages/Journey.tsx`
Import the flag and add early return in `isDayUnlocked`:
```tsx
import { DEV_BYPASS_DAY_LOCK } from "@/lib/config";

const isDayUnlocked = (day: number) => {
  if (DEV_BYPASS_DAY_LOCK) return true;
  if (day === 1) return true;
  return isDayCompleted(day - 1);
};
```

### 3. `src/components/journey/DayLockedScreen.tsx`
Import the flag. In the countdown `useEffect`, skip the timer when bypass is active — and call `onUnlock()` immediately if `DEV_BYPASS_DAY_LOCK` is true.

## Files modified
- `src/lib/config.ts` (new)
- `src/pages/Journey.tsx`
- `src/components/journey/DayLockedScreen.tsx`

