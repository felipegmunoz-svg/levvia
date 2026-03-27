

# Fix HeatMap Inside NightSlot Accordion Card

## Changes

### 1. `src/components/journey/touchpoints/NightSlot.tsx` (lines 43-55)
Replace the heatmap non-review case to separate the title card from the HeatMap component, giving it its own unclipped container:

```tsx
return (
  <div className="space-y-4">
    <div className="levvia-card p-5 overflow-visible">
      <h3 className="font-semibold text-levvia-fg font-body text-sm mb-3">
        🗺️ {technique.title}
      </h3>
      {technique.description && (
        <p className="text-sm text-levvia-muted font-body mb-4">
          {technique.description}
        </p>
      )}
    </div>
    <div className="min-h-[480px]">
      <HeatMapInteractive onNext={() => setTechniqueDone(true)} />
    </div>
  </div>
);
```

### 2. `src/components/journey/HeatMapInteractive.tsx` (line 82)
Change `min-h-screen py-10` to `py-6` in the non-readOnly container class so the parent controls height.

## Files changed
- `src/components/journey/touchpoints/NightSlot.tsx`
- `src/components/journey/HeatMapInteractive.tsx`

