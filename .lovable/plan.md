
# Reverter mudanças do Dia 1 (e Day2-5Flow)

## Diagnóstico
A remoção de `theme-light` do `DayTouchpointView.tsx` é a causa principal. Essa classe força variáveis CSS claras (`--background`, `--foreground`, etc.) — sem ela, todos os componentes internos (cards `levvia-card`, textos `text-levvia-fg`) passam a usar o tema escuro, quebrando o layout que foi desenhado para tema claro.

## Arquivos a reverter (7 arquivos)

### 1. `DayTouchpointView.tsx` — linha 146
```
"levvia-page min-h-screen"  →  "theme-light levvia-page min-h-screen"
```

### 2. `Day1Flow.tsx` — linha 249
```
border-white/[0.08] bg-background/80 backdrop-blur-sm  →  border-levvia-border bg-white
```

### 3-6. `Day2Flow.tsx`, `Day3Flow.tsx`, `Day4Flow.tsx`, `Day5Flow.tsx`
Mesma reversão do header sticky.

### 7. Slots (MorningSlot, LunchSlot, AfternoonSlot, NightSlot)
Reverter `text-[#7a8ba0]` → `text-gray-400` (mudança mínima, mas mantém consistência com o `theme-light` que força tema claro).

## Arquivos que NÃO serão alterados (mantêm correções)
- `DiaryReflection.tsx` — inputs corrigidos ✓
- `ActivityCard.tsx` — border corrigido ✓
- `DayDashboard.tsx` — border corrigido ✓
- `DayReview.tsx` — `theme-light` removido ✓ (esse tinha problema real)
