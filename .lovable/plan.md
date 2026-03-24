

## Fix: Debug Bar Blocked by Loading Spinner

### Problem
Line 235-241 has an early `return` that exits the component when day states are `null` or `premiumLoading` is true. This happens **before** the debug bar on line 567, so the bar never renders during loading — and if loading hangs, it's permanently hidden.

### Solution
Move the debug bar **above** the loading check. Wrap both the loading spinner and the content-flow in the same fragment that always renders the debug bar first.

### Implementation

**File: `src/pages/Today.tsx`**

Replace the loading early-return (lines 235-241) and the final return (lines 567-584) so that:

1. The loading check on line 235 sets `content` to the spinner instead of doing an early `return`
2. The final `return` with the debug bar becomes the **only** return after line 234

```tsx
// Line 235-241: change from early return to content assignment
if (day1Done === null || day2Done === null || day3Done === null || day4Done === null || day5Done === null || premiumLoading) {
  content = (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <>
      {isDev && (
        <div className="bg-yellow-100 px-3 py-2 flex flex-wrap gap-2 items-center text-xs sticky top-0 z-50">
          <span className="font-semibold text-yellow-800">🐛 Debug:</span>
          {[1,2,3,4,5].map(d => (
            <button key={d} onClick={() => setReplayDay(d)} ...>Dia {d}</button>
          ))}
          <button onClick={handleResetLocal} ...>Resetar Local</button>
        </div>
      )}
      {content}
    </>
  );
}
```

The rest of the code (lines 243-584) stays as-is. This ensures the debug bar renders even during loading states.

### Files modified: 1
- `src/pages/Today.tsx` — add debug bar to the loading early-return block

