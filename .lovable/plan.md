

# Ajustar Mapeamento de Horários para Refeição

## Alterações

### `src/components/journey/Day1MealSuggestion.tsx` (função `getMealSlot`, ~linha 15-21)

Substituir a lógica atual por:

```typescript
function getMealSlot(): { slot: MealSlot; label: string } {
  const hour = new Date().getHours();
  if (hour < 10) return { slot: "Café da Manhã", label: "Café da Manhã" };
  if (hour < 12) return { slot: "Lanche da Manhã", label: "Lanche da Manhã" };
  if (hour < 15) return { slot: "Almoço", label: "Almoço" };
  if (hour < 18) return { slot: "Lanche da Tarde", label: "Lanche da Tarde" };
  return { slot: "Jantar", label: "Jantar" };
}
```

Nenhum outro arquivo alterado.

