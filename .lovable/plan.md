

# Add "Seu Fogo Interno" card to Today screen

## Overview
Add a compact card below the header in DayTouchpointView showing a miniature heat map silhouette. Tapping it navigates to `/progress`.

## Changes

### 1. `src/components/journey/DayTouchpointView.tsx`

- Add imports: `useNavigate` from react-router-dom, `FlowSilhouette` from `@/components/FlowSilhouette`
- Add `heatMapDay1?: Record<string, number> | null` to `DayTouchpointViewProps`
- Destructure `heatMapDay1` in component props
- Add `const navigate = useNavigate()` inside the component
- After the Header `div` (line 122), before the Progress Bar, insert the "Seu Fogo Interno" card:

```tsx
{heatMapDay1 && Object.keys(heatMapDay1).length > 0 && (
  <div className="px-6 pb-2">
    <button
      onClick={() => navigate("/progress")}
      className="w-full levvia-card p-4 flex items-center gap-4 text-left active:opacity-80 transition-opacity"
    >
      <div className="w-[60px] shrink-0">
        <FlowSilhouette heatMapData={heatMapDay1} waterIntakeMl={0} waterGoalMl={1} size="small" animated={false} />
      </div>
      <div>
        <p className="text-sm font-heading font-semibold text-levvia-fg">Seu Fogo Interno</p>
        <p className="text-xs text-levvia-muted font-body mt-0.5">Toque para ver sua evolução →</p>
      </div>
    </button>
  </div>
)}
```

### 2. `src/pages/Today.tsx` (lines 159–166)

Add `heatMapDay1` prop to the `<DayTouchpointView>` call:

```tsx
heatMapDay1={(profile?.heatMapDay1 as Record<string, number>) ?? null}
```

## Files modified
- `src/components/journey/DayTouchpointView.tsx`
- `src/pages/Today.tsx`

