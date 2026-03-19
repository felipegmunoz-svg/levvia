

# Fix: Loop entre Day1ClosingPublic e /today

## Problema
Quando `Day1ClosingPublic` salva o diário no localStorage e navega para `/today`, o `Day1Flow` em `/today` vê `day1_completed = false` no banco e mostra step 4 (MealSuggestion) → step 5 (Day1Closing) → novo save → loop. A sincronização do diário local só existe em `handleHeatMapDone`, que não roda nesse cenário.

## Fix — `src/components/journey/Day1Flow.tsx`

No `determineStep`, ANTES de definir step 4, verificar se existe `levvia_day1_local_completed` no localStorage. Se existir, sincronizar o diário com o banco, marcar `day1_completed = true` e chamar `onComplete()` — quebrando o loop.

```text
determineStep flow (FIXED):
  ...
  welcomeShown ✓, heatMapDone ✓, onboardingDone ✓
    → Check levvia_day1_local_completed?
      YES → sync diary to DB, mark day1_completed, call onComplete()
      NO  → setStep(4) (normal flow)
```

Isso reutiliza a mesma lógica de sync que já existe em `handleHeatMapDone`, movida para uma função compartilhada.

## Arquivo alterado
- `src/components/journey/Day1Flow.tsx` — adicionar sync do diário local no `determineStep`

