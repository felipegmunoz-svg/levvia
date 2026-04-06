

# Fix: Mapa de calor noturno recebe `{}` em vez de dados reais

## Causa raiz

A cadeia de dados tem **dois pontos de falha** onde objetos vazios `{}` passam como truthy:

1. **Today.tsx linha 182**: `(profile?.heatMapDay1 as Record<string, number>) ?? null` — o `??` só captura `null`/`undefined`, não `{}`. Resultado: `heatMapDay1 = {}`.

2. **DayTouchpointView.tsx linha 395**: `previousHeatMap || heatMapDay1` = `null || {}` = `{}`. O `{}` é truthy.

3. **NightSlot.tsx linha 124**: `previousHeatMapData || heatMapDay1Data || undefined` = `{} || null || undefined` = `{}`. O HeatMapInteractive recebe `initialData = {}`, que se espalha sobre `defaultAreas` sem mudar nada — mapa vazio.

O FlowSilhouette na Home funciona porque lê `heatMapData` diretamente com lógica própria que ignora zeros.

## Solução (2 pontos de correção)

### 1. `src/pages/Today.tsx` — linha 182
Validar o objeto antes de passar como prop:
```tsx
// De:
heatMapDay1={(profile?.heatMapDay1 as Record<string, number>) ?? null}
// Para:
heatMapDay1={
  profile?.heatMapDay1 && Object.values(profile.heatMapDay1).some(v => typeof v === 'number' && v > 0)
    ? (profile.heatMapDay1 as Record<string, number>)
    : null
}
```
Isso garante que `{}` e objetos com todos os valores em 0 retornem `null`.

### 2. `src/components/journey/touchpoints/NightSlot.tsx` — fallback direto via useProfile
Adicionar importação de `useProfile` e usar como último fallback:
```tsx
import { useProfile } from "@/hooks/useProfile";

// Dentro do componente:
const { profile } = useProfile();
const profileHeatMap = useMemo(() => {
  if (!profile?.heatMapDay1 || typeof profile.heatMapDay1 !== 'object') return undefined;
  const hasData = Object.values(profile.heatMapDay1).some(v => typeof v === 'number' && v > 0);
  return hasData ? (profile.heatMapDay1 as Record<string, number>) : undefined;
}, [profile?.heatMapDay1]);

// Na linha 124, atualizar:
initialData={previousHeatMapData || heatMapDay1Data || profileHeatMap || undefined}
```

### Lógica inalterada
- HeatMapInteractive continua recebendo `initialData` da mesma forma
- Nenhum outro componente afetado
- Se os dados do onboarding têm todos zeros (usuária não marcou dor), o mapa continua vazio — isso é correto

## Arquivos modificados
- `src/pages/Today.tsx` (1 edição, linha 182)
- `src/components/journey/touchpoints/NightSlot.tsx` (3 edições: import, useMemo, initialData)

