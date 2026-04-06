

# 3 correções no Dia 1

## 1. `src/hooks/useChallengeData.tsx` — linha 417-419
Remover condicional do `heatMapDay1Data`:
```tsx
// De:
heatMapDay1Data: effectiveNightTechnique.type === "heatmap-comparative"
  ? ((profile.heatMapDay1 as Record<string, number>) || null)
  : undefined,
// Para:
heatMapDay1Data: (profile.heatMapDay1 as Record<string, number>) || null,
```

## 2. `src/pages/Progress.tsx` — linha 63
Tornar `scoreLabel` contextual com `hasJourneyProgress`:
```tsx
const scoreLabel = !hasHeatMapData
  ? "⏳ Aguardando dados"
  : !hasJourneyProgress
  ? "📍 Seu Ponto de Partida"
  : flowScore <= 40 ? "🔥 Fogo Ativo"
  : flowScore <= 70 ? "🌊 Em Transição"
  : "💧 Fluxo Ativo";
```
Nota: `hasJourneyProgress` (linha 93) depende de `evoData` — precisa mover `scoreLabel` para depois de `evoData`. Reorganizar: mover a declaração de `scoreLabel` para após linha 93.

## 3. `src/pages/Progress.tsx` — linhas 197-237
Trocar o card de evolução para só renderizar com 2+ dias:
```tsx
{evoData.length > 1 && (
  <div className="levvia-card p-6">
    ...card inteiro...
  </div>
)}
```
Remove o estado vazio (mensagem "Complete os dias...") — o card simplesmente não aparece até haver 2+ dias.

## Arquivos modificados
- `src/hooks/useChallengeData.tsx` (1 linha)
- `src/pages/Progress.tsx` (2 edições)

