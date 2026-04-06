

# Diagnóstico: Mapa de calor da noite vem vazio

## Causa raiz encontrada (sem precisar de console.log)

Consultei o banco de dados diretamente. Existem **dois problemas**:

### Problema 1: Dados são todos zero
Os profiles que TÊM `heat_map_day1` preenchido contêm valores como `{"abdomen": 0, "braco_dir": 0, "coxa_dir": 0, ...}` — todas as zonas com intensidade **0**. Isso significa que o onboarding salvou o mapa, mas a usuária não marcou nenhuma dor (ou o componente salvou o estado default).

O `HeatMapInteractive` inicializa com `{...defaultAreas, ...(initialData || {})}` — como `initialData` é `{abdomen:0, braco_dir:0,...}`, o mapa aparece visualmente "vazio" (tudo sem cor) porque intensidade 0 = sem preenchimento.

**Isso é comportamento correto** — se a usuária não marcou dor no onboarding, o mapa noturno começa limpo.

### Problema 2: Maioria dos profiles tem `heat_map_day1: {}`
3 dos 5 profiles com dados não-nulos têm `heat_map_day1` como objeto vazio `{}`. Isso indica que o sync do onboarding **não está salvando o heat map** para a maioria das usuárias. O problema está no `syncOnboarding.ts` — o `answers[9]` pode estar vindo como undefined/array em vez de Record.

### Problema 3: `{}` passa como truthy
No `useChallengeData.tsx`, a linha `(profile.heatMapDay1 as Record<string, number>) || null` — um objeto vazio `{}` é **truthy** em JavaScript, então nunca cai no fallback `null`. O `HeatMapInteractive` recebe `initialData = {}` que se espalha sobre `defaultAreas` sem mudar nada.

## Plano de correção (sem console.logs)

### 1. `src/hooks/useChallengeData.tsx` — linha 417
Verificar se o objeto tem chaves antes de passá-lo:
```tsx
// De:
heatMapDay1Data: (profile.heatMapDay1 as Record<string, number>) || null,
// Para:
heatMapDay1Data: profile.heatMapDay1 && Object.keys(profile.heatMapDay1).length > 0
  ? (profile.heatMapDay1 as Record<string, number>)
  : null,
```

### 2. `src/lib/profileEngine.ts` — linha 204
Filtrar `created_at` e verificar se tem dados reais:
```tsx
// De:
heatMapDay1: (data as any).heat_map_day1 && typeof ... === 'object' ? ... : {},
// Para: filtrar created_at e keys não-numéricas
```

### 3. `src/lib/syncOnboarding.ts` — verificar que `answers[9]` está sendo capturado
Investigar se o passo 9 do onboarding (heat map) está realmente populando o objeto antes do sync.

### 4. Adicionar console.logs temporários (como pedido)
Nos 3 arquivos indicados, para confirmar o fluxo em runtime.

## Recomendação

Antes de adicionar console.logs, posso aplicar a correção do `{}` truthy (problema 3) que é a causa técnica imediata. Quer que eu siga com as correções ou prefere os console.logs primeiro para validar?

