

# Add review-mode completion indicators to MorningSlot and AfternoonSlot

## Changes

### 1. `src/components/journey/touchpoints/MorningSlot.tsx`

**Import (line 2):** Add `CheckSquare` to lucide-react imports.

**Exercise card (after line 115, after "Ver Exercício Completo →" button):** Add:
```tsx
{isReviewMode && (
  <div className="flex items-center gap-2 mt-3">
    <CheckSquare size={14} className="text-primary" strokeWidth={1.5} />
    <span className="text-sm text-primary font-body">Exercício concluído</span>
  </div>
)}
```

**Shot card (after line 158, after "Ver Receita →" button):** Add:
```tsx
{isReviewMode && (
  <div className="flex items-center gap-2 mt-3">
    <CheckSquare size={14} className="text-primary" strokeWidth={1.5} />
    <span className="text-sm text-primary font-body">Shot tomado</span>
  </div>
)}
```

### 2. `src/components/journey/touchpoints/AfternoonSlot.tsx`

**Import (line 2):** Add `CheckSquare` to lucide-react imports.

**Micro-Movement card (after line 152, after "Ver Exercício →" button):** Add:
```tsx
{isReviewMode && (
  <div className="flex items-center gap-2 mt-3">
    <CheckSquare size={14} className="text-primary" strokeWidth={1.5} />
    <span className="text-sm text-primary font-body">Movimento concluído</span>
  </div>
)}
```

## Files modified
- `src/components/journey/touchpoints/MorningSlot.tsx`
- `src/components/journey/touchpoints/AfternoonSlot.tsx`

