

# Add completion indicator to LunchSlot recipe cards

## Changes — `src/components/journey/touchpoints/LunchSlot.tsx`

### Recipe card styling (lines 74–117)

When `isAlreadyCompleted` is true (slot done):
- **Selected/completed recipe card**: Add `bg-primary/10` background, replace selection border with a checkbox-style completion indicator showing `☑ Receita preparada` (using `CheckSquare` from lucide-react) with green styling
- **Non-selected recipe cards**: Add `opacity-40` to dim them, remove click handler

When `isAlreadyCompleted` is false, keep current behavior unchanged.

### Implementation detail

```tsx
// Inside the recipes.map callback:
const isSelected = selectedRecipeId === recipe.id;
const isThisCompleted = isAlreadyCompleted && isSelected;
const isNotChosen = isAlreadyCompleted && !isSelected;

// Card className:
className={`levvia-card p-4 transition-all ${
  isThisCompleted
    ? "bg-primary/10 border-primary/20"
    : isNotChosen
    ? "opacity-40 border-border"
    : isSelected
    ? "border-primary border-2 ring-1 ring-primary/20 cursor-pointer"
    : "border-border cursor-pointer"
}`}

// Inside completed card, add after recipe label:
{isThisCompleted && (
  <div className="flex items-center gap-2 mt-2">
    <CheckSquare size={16} className="text-green-500" />
    <span className="text-sm text-green-600 font-medium">Receita preparada</span>
  </div>
)}
```

Import `CheckSquare` from `lucide-react`.

## Files modified
- `src/components/journey/touchpoints/LunchSlot.tsx`

