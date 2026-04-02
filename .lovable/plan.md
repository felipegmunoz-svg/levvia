

# Add snack completion indicator in AfternoonSlot

## Change

**File:** `src/components/journey/touchpoints/AfternoonSlot.tsx` (after line 191)

After the "Ver Receita →" button (line 190-191), add the review-mode indicator:

```tsx
{isReviewMode && (
  <div className="flex items-center gap-2 mt-3">
    <CheckSquare size={14} className="text-primary" strokeWidth={1.5} />
    <span className="text-sm text-primary font-body">Receita preparada</span>
  </div>
)}
```

`CheckSquare` is already imported. No other changes needed.

## Files modified
- `src/components/journey/touchpoints/AfternoonSlot.tsx`

