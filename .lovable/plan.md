

## Blindagem contra Loading Infinito

### Objetivo
Adicionar timeout + fallback em dois pontos críticos para que o app nunca trave em spinner.

### 1. `src/hooks/useChallengeData.tsx` — Timeout no loadProgress

No `useEffect` que carrega progresso (linha 160), envolver a query Supabase em `Promise.race` com timeout de 5 segundos. No `catch`, usar localStorage como fallback. Sem fallback disponível, manter estado inicial (vazio). Não mudar a assinatura do hook nem outros efeitos.

```
Antes:
  const { data, error } = await supabase.from("profiles").select(...)

Depois:
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000));
  const { data, error } = await Promise.race([supabase.from(...), timeout]);
```

Adicionar `try/catch/finally` garantindo que mesmo com erro, o hook para de carregar.

### 2. `src/pages/Today.tsx` — Timeout de segurança no useEffect de day completion

No `useEffect` da linha 89 que busca `day1_completed/day2_completed`, adicionar:
- Timeout de 5 segundos via `Promise.race`
- No catch/timeout: setar `day1Done = false` e `day2Done = false` (estado seguro — renderiza Day1Flow)
- Garantir que o spinner da linha 184-190 (`day1Done === null`) nunca fica infinito

### 3. Fallback visual em `Today.tsx` linha 233

O spinner "Personalizando seu plano..." (quando `loading || !todayData`) já existe. Adicionar um `useEffect` com `setTimeout(8000)` que força `loading = false` caso o hook `useChallengeData` nunca resolva. Isso é um último recurso — se ativado, o dashboard renderiza vazio mas navegável.

### Arquivos modificados
- `src/hooks/useChallengeData.tsx` — timeout no loadProgress
- `src/pages/Today.tsx` — timeout nos dois spinners

### Arquivos NÃO modificados
- Day1Flow, Day2Flow, HeatMapInteractive, Day2InflammationMap — intactos
- Nenhuma migration necessária

