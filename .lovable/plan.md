

## Fix: Debug Bar Visibility

### Problem
The debug bar with replay buttons is inside the dashboard `return` block (line 361). It only appears when ALL day gates have passed and the main dashboard renders. If the user is in a day flow, waiting screen, or paywall, the debug bar is invisible — making it useless for QA.

### Solution
Move the debug bar to render **before** any gates, wrapping it around whichever content the gates produce. This way QA always sees the replay buttons regardless of current state.

### Implementation

**File: `src/pages/Today.tsx`**

1. **Remove** the debug bar from inside the dashboard return (lines 361-373).

2. **Wrap the entire component output** in a fragment that always shows the debug bar first:
   - After the loading spinner (line 235-241), all subsequent returns (gates, dashboard, etc.) should be wrapped.
   - Simplest approach: extract the gate logic into a variable, then return a single JSX block:

```tsx
// After the premiumLoading spinner (line 241), instead of multiple early returns:

// Compute which content to show
let content: React.ReactNode = null;

if (replayDay === 1) content = <Day1Flow onComplete={() => setReplayDay(null)} />;
else if (replayDay === 2) content = <Day2Flow onComplete={() => setReplayDay(null)} />;
// ... etc for days 3-5
else if (day1Done === false) content = <Day1Flow ... />;
else if (day2Done === false && day1Done === true) content = <Day2Flow ... /> (with 24h gate);
// ... all existing gates
else content = <dashboard JSX>;

return (
  <>
    {isDev && (
      <div className="bg-yellow-100 px-3 py-2 flex flex-wrap gap-2 items-center text-xs sticky top-0 z-50">
        <span className="font-semibold text-yellow-800">🐛 Debug:</span>
        {[1,2,3,4,5].map(d => (
          <button key={d} onClick={() => setReplayDay(d)} className="px-2 py-1 bg-yellow-300 text-yellow-900 rounded">
            Dia {d}
          </button>
        ))}
        <button onClick={handleResetLocal} className="px-2 py-1 bg-red-300 text-red-900 rounded ml-auto">
          Resetar Local
        </button>
      </div>
    )}
    {content}
  </>
);
```

This refactors the multiple `if (...) return` pattern into a single content variable, then wraps it with the debug bar. The debug bar gets `sticky top-0 z-50` so it stays visible even during scrolling within day flows.

3. **Remove** the duplicate debug bar from the dashboard section (old lines 361-373).

### Result
- Debug bar visible on **every** screen (day flows, waiting screens, paywall, dashboard)
- QA can click "Dia 5" to replay at any time, from any state
- "Resetar Local" always accessible
- No functional changes to gates or flows

### Files modified: 1
- `src/pages/Today.tsx` — refactor returns into content variable, move debug bar to top-level wrapper

