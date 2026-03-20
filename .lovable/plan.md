

# Fix: Day1MealSuggestion infinite loading spinner

## Root Cause

The `useEffect` depends on `[profile]`. The `useProfile` hook emits twice: first with localStorage data, then with Supabase data. Here's the race:

1. First profile emission (localStorage, has name "Tere") → effect runs, `hasExecuted = true`, starts async `load()`
2. Second profile emission (Supabase data arrives) → React runs **cleanup** of previous effect, setting `cancelled = true`
3. New effect runs but `hasExecuted.current` is already `true` → returns early, no new load
4. Original async `load()` completes, but `cancelled === true` → `setSuggestedRecipe()` and `setLoading(false)` are both skipped

Result: loading stays `true` forever.

## Fix — `src/components/journey/Day1MealSuggestion.tsx` (line 55)

Change the effect dependency from `[profile]` to an empty array `[]`, and move the profile guard inside the load function with a retry pattern. Since `hasExecuted` already prevents re-execution, the `[profile]` dependency only causes harm.

Alternatively (simpler, minimal change): decouple the `cancelled` flag from the effect cleanup by using a ref instead of a local variable. But the cleanest fix is:

**Change line 55 from:**
```typescript
  }, [profile]);
```

**To:**
```typescript
  }, [profile.name, profile.pantryItems]);
```

Wait — this still has the same problem (cleanup runs on dependency change). The real fix:

**Move `cancelled` to a ref, so cleanup doesn't kill in-flight requests:**

```typescript
const cancelledRef = useRef(false);

useEffect(() => {
  if (hasExecuted.current) return;
  if (!profile.name && !profile.pantryItems?.length) return;

  hasExecuted.current = true;

  const load = async () => {
    setLoading(true);
    // ... same logic ...
    try {
      const recipe = await selectDay1Recipe(profile);
      if (!cancelledRef.current) setSuggestedRecipe(recipe);
    } catch (err) {
      console.error("Erro ao carregar receita:", err);
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  };
  load();
}, [profile]);
```

The `cancelledRef` is only set on unmount, not on dependency change. This way, when profile updates and cleanup runs, it does NOT cancel the in-flight load.

**Or even simpler** — since `hasExecuted` already guarantees single execution, just remove the cleanup entirely and the `cancelled` variable:

```typescript
useEffect(() => {
  if (hasExecuted.current) return;
  if (!profile.name && !profile.pantryItems?.length) return;

  hasExecuted.current = true;

  const load = async () => {
    setLoading(true);
    try {
      const recipe = await selectDay1Recipe(profile);
      setSuggestedRecipe(recipe);
    } catch (err) {
      console.error("Erro ao carregar receita:", err);
    } finally {
      setLoading(false);
    }
  };
  load();
}, [profile]);
```

This is safe because `hasExecuted` prevents any re-execution, and we only need cancellation for unmount scenarios (which would unmount the spinner anyway).

## Single file change
- `src/components/journey/Day1MealSuggestion.tsx` — remove `cancelled` variable and cleanup function from the useEffect (lines 28-55)

