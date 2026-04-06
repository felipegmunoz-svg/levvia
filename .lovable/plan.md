
# Solução definitiva: NightSlot carrega o mapa direto do backend

## Diagnóstico
O seu direcionamento está correto: a cadeia `Today → DayTouchpointView → NightSlot → HeatMapInteractive` é frágil porque `{}` passa como truthy.

Há ainda um segundo ponto crítico: mesmo buscando no `NightSlot`, o `HeatMapInteractive` hoje inicializa o estado interno só no mount. Então, se o mapa chegar depois via `useEffect`, ele pode continuar visualmente vazio.

## O que vou implementar

### 1. `src/components/journey/touchpoints/NightSlot.tsx`
Adicionar carregamento direto dos dados no próprio componente:
- importar `useAuth`
- importar `supabase`
- criar estado para o mapa carregado
- criar `useEffect` que roda com `user?.id` e `dayNumber`

Fluxo da busca:
1. buscar `heat_map_day1` e `challenge_progress` em `profiles`
2. se `dayNumber >= 2`, tentar primeiro `challenge_progress.touchpoints.day{N-1}.night.night_heat_map`
3. se não houver mapa válido, usar `heat_map_day1`
4. considerar válido apenas mapa com ao menos 1 valor numérico `> 0`

Observação técnica:
- vou usar `.maybeSingle()` no lugar de `.single()` para evitar erro quando não houver linha retornada

### 2. Evitar depender da cadeia de props no render do `HeatMapInteractive`
No caso `technique.type === "heatmap"`:
- trocar `initialData={previousHeatMapData || heatMapDay1Data || profileHeatMap || undefined}`
- para usar o dado carregado diretamente no `NightSlot`

## Ajuste essencial para funcionar de verdade
Como o `HeatMapInteractive` não reage automaticamente a mudanças tardias em `initialData`, vou aplicar uma destas abordagens seguras:

### Opção escolhida
Montar o `HeatMapInteractive` apenas depois que a busca terminar, ou forçar remount com `key` baseada no mapa carregado.

Isso evita o problema de:
```text
render vazio -> effect carrega dados -> prop muda -> estado interno do HeatMapInteractive não atualiza
```

## Escopo dos arquivos
### Será alterado
- `src/components/journey/touchpoints/NightSlot.tsx`

### Não precisa alterar para esta solução
- `src/pages/Today.tsx`
- `src/components/journey/DayTouchpointView.tsx`

Esses arquivos podem continuar passando props, mas o `NightSlot` deixará de depender delas para o mapa noturno.

## Resultado esperado
- Dia 1: o slot da noite usa diretamente `heat_map_day1`
- Dia 2+ : o slot da noite prioriza o `night_heat_map` do dia anterior salvo em `challenge_progress`
- se a cadeia de props falhar, o mapa continua funcionando
- sem regressão na lógica de conclusão do slot, diário ou `onComplete`

## Detalhes técnicos
- manter validação: só aceitar mapa com valores numéricos maiores que zero
- preservar o comportamento atual dos demais tipos de técnica (`breathing`, `food-traffic-light`, `heatmap-comparative`, etc.)
- evitar mudanças amplas em componentes compartilhados para não reabrir regressões no Dia 1
