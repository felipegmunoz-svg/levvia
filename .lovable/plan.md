

# Add "Outros (especifique)" Free-Text Field to Multi-Select Screens

## Summary
Add an "Outros (especifique)" option to the health conditions (id 7) and dietary restrictions (id 13) multi-select screens. When selected, a text input appears for the user to type custom info. On advance, the selection is saved as `"Outros: <typed text>"`.

## Clarification
The user referenced "tela 10" and "tela 15" by screen position. The actual step IDs in the data are **id 7** (Condições de Saúde) and **id 13** (Restrições Alimentares).

## Changes

### 1. `src/data/onboarding.ts`
- **Line 106**: Add `"Outros (especifique)"` at end of id 7 options array
- **Line 170**: Add `"Outros (especifique)"` at end of id 13 options array

### 2. `src/pages/Onboarding.tsx`

**New state** (~line 104, near other state declarations):
```ts
const [otherText, setOtherText] = useState("");
```

**Reset on step change**: In the existing step-change logic, add `setOtherText("")` when step changes.

**Render free-text input** (~after line 948, after the options map closes): When `current.type === "multi"` and `(current.id === 7 || current.id === 13)` and `"Outros (especifique)"` is selected, render a text input:
```tsx
{current.type === "multi" && (current.id === 7 || current.id === 13) && 
 isSelected("Outros (especifique)") && (
  <input
    type="text"
    placeholder="Descreva aqui..."
    value={otherText}
    onChange={(e) => setOtherText(e.target.value)}
    className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
  />
)}
```

**handleNext modification** (~line 232): For multi steps with id 7 or 13, before saving, replace `"Outros (especifique)"` with `"Outros: " + otherText` if otherText is non-empty:
```ts
if (current.type === "multi" && (current.id === 7 || current.id === 13)) {
  const items = (answers[current.id] as string[]) || [];
  const processed = items.map(item => 
    item === "Outros (especifique)" && otherText.trim()
      ? `Outros: ${otherText.trim()}`
      : item
  );
  setAnswers(a => ({ ...a, [current.id]: processed }));
}
```

## Files modified
- `src/data/onboarding.ts` — 2 lines added
- `src/pages/Onboarding.tsx` — state + render block + handleNext logic

