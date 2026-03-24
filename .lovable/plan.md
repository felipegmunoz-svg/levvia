

## Fix: Debug Bar Not Appearing for Authorized Email

### Problem
Two issues on line 101 of `src/pages/Today.tsx`:
1. Email comparison is case-sensitive — if the user's email has any uppercase letters, it won't match
2. `useAuth()` loading state isn't considered — `user` may still be `null` when `isDev` is evaluated

### Solution

**File: `src/pages/Today.tsx`**

1. **Line 75**: Destructure `loading` from `useAuth()`:
   ```ts
   const { user, loading: authLoading } = useAuth();
   ```

2. **Lines 100-101**: Add `.toLowerCase()`, console.log, and use `isAuthorized`:
   ```ts
   const DEBUG_EMAILS = ['felipegmunoz@gmail.com', 'teste_levvia_dia3_2026@gmail.com'];
   const isAuthorized = !!user?.email && DEBUG_EMAILS.includes(user.email.toLowerCase());
   const isDev = (import.meta.env.MODE === 'development' || localStorage.getItem('levvia_debug') === 'true') && isAuthorized;
   console.log("Debug Check:", { email: user?.email, isAuthorized, isDev, authLoading });
   ```

No other changes needed. The debug bar rendering already uses `isDev`, so fixing the condition propagates everywhere.

### Files modified: 1
- `src/pages/Today.tsx` — 2 edits (line 75, lines 100-101)

