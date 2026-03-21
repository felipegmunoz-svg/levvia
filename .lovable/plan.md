

# Plan: Fix Inflammation Map Save Bug

## Root Cause Analysis

The `saveWithRetry` function uses `as any` casts that obscure the Supabase query chain. More critically, `.update()` without `.select()` returns `{ data: null, error: null }` even when **zero rows are matched** — so the function reports success without verifying anything was actually written.

Additionally, the `handleMapComplete` in `Day2Flow.tsx` calls `saveWithRetry` but doesn't await verification. The data flows through correctly in React state, but the Supabase write may silently fail.

## Fix — 2 files

### 1. `src/lib/saveWithRetry.ts` — Add `.select()` and detailed logging

- Add `.select()` to the update chain so we get the returned row back
- Log the exact payload being sent before the update
- Log the returned data after update to verify the write
- Check that returned data is not empty (0 rows matched = silent failure)

```typescript
// Before update
console.log(`💾 saveWithRetry — table: ${table}, userId: ${userId}, payload:`, JSON.stringify(data));

// Change the query to include .select()
const { data: returned, error } = await supabase
  .from(table)
  .update(data)
  .eq("id", userId)
  .select()
  .maybeSingle();

// Verify the write
if (!error && returned) {
  console.log("✅ Dados salvos e verificados:", JSON.stringify(returned));
  return true;
}

if (!error && !returned) {
  console.warn("⚠️ Update executou sem erro mas 0 rows afetadas");
  // Treat as failure — retry
}
```

### 2. `src/components/journey/Day2Flow.tsx` — Add verification log in `handleMapComplete`

- Log `data` received from InflammationMap before saving
- After `saveWithRetry` returns, log success/failure explicitly
- Ensure `mapData` is non-empty before calling save

## Files

| Action | File |
|--------|------|
| Edit | `src/lib/saveWithRetry.ts` (add `.select()` + logging) |
| Edit | `src/components/journey/Day2Flow.tsx` (add verification logging) |

