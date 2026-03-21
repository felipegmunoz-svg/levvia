

# Implementation Plan: Fix 20s+ SPA Navigation Spinner

## Changes

### 1. `src/hooks/useAuth.tsx` — Fix token refresh flicker
- In `onAuthStateChange` callback (~line 33), only set `setRoleLoading(!!nextUser)` when `_event` is `SIGNED_IN` or `INITIAL_SESSION`
- Skip role loading reset on `TOKEN_REFRESHED` events

### 2. `src/hooks/useProfile.tsx` — Add module-level cache (60s TTL)
- Add `profileCache` variable at module level: `{ userId, profile, timestamp }`
- Initialize state from cache if valid (skip loading)
- Update cache after successful fetch
- Add `console.log('✅ [Cache] Perfil carregado do cache')` on cache hit

### 3. `src/hooks/useChallengeData.tsx` — Add module-level cache (5min TTL)
- Add `dataCache` variable at module level: `{ exercises, recipes, habits, ts }`
- In the fetch `useEffect`, check cache first; if valid, use cached data and skip fetch
- Update cache after successful fetch
- Add `console.log('✅ [Cache] Dados carregados do cache')` on cache hit

## Expected Result
- First load: ~3s (normal queries)
- SPA navigation: instant (cached, no spinner)
- Debug logs confirm cache hits in console

