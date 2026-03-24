
Objetivo: garantir que o `Day5Flow` tenha prioridade real de renderização em `/today` quando `day4_completed = true`, `day5_completed = false` e a usuária for premium.

1. Confirmar os pontos já verificados no código atual
- `day4Done` está sendo populado do banco em `Today.tsx` via `select(... day4_completed ...)` e `setDay4Done((data as any)?.day4_completed === true)`.
- A condição do Dia 5 já está antes do retorno da dashboard padrão:
  - gate Day 5 aparece antes de `if ((loading && !forceReady) || !todayData)` e antes do `return` principal da dashboard.
- Não há `useEffect` em `Today.tsx` resetando progresso após carregar, exceto o fallback do `catch`, que força `day1Done..day5Done = false` em erro/timeout.

2. Corrigir a causa mais provável
Hoje o componente usa `const { hasPremium } = usePremium();`, mas não espera `usePremium().loading`.
Isso cria uma janela em que:
- `day4Done === true`
- `day5Done === false`
- `hasPremium` ainda está no valor inicial `false`
Resultado: o gate do Dia 5 não entra e o componente cai na dashboard padrão.

Implementação:
- Ler também `loading` de `usePremium`.
- Bloquear a avaliação dos gates enquanto o status premium não estiver resolvido.
- Exemplo de ajuste:
  - `const { hasPremium, loading: premiumLoading } = usePremium();`
  - incluir `premiumLoading` no spinner inicial dos gates.

3. Reforçar a prioridade de renderização do Dia 5
Reorganizar a sequência de guards em `Today.tsx` para ficar explicitamente hierárquica:
- loading dos estados do dia
- loading do premium
- Day1
- Day2
- Day3
- Paywall Day4+
- Day4
- Day5
- só então dashboard padrão

Assim o `Day5Flow` fica impossível de ser “atropelado” por qualquer retorno genérico.

4. Eliminar inconsistência entre queries separadas
Hoje `Today.tsx` busca progresso em uma query e `usePremium` faz outra query separada.
Plano:
- opção preferida: usar o mesmo fetch inicial de `profiles` em `Today.tsx` para também preencher um estado local `isPremiumUser`.
- alternativa mínima: manter `usePremium`, mas travar a renderização até `premiumLoading === false`.

5. Blindar contra fallback indevido
No `catch` do fetch de progresso, hoje todos os dias viram `false`.
Ajuste planejado:
- não inferir progresso negativo agressivamente em erro transitório;
- manter estado “indefinido” até retry/loading finalizar, ou usar fallback local apenas se existir dado confiável.
Isso evita regressões onde a UI volta para fluxo antigo por timeout.

6. Verificação específica do Day 4 → Day 5
Ao revisar `Today.tsx`, validar também:
- `day4_completed_at` está sendo carregado corretamente.
- o gate de 24h só bloqueia quando houver timestamp válido e menos de 24h.
- se `day4Done === true` e `day4CompletedAt === null`, o app deve priorizar `Day5Flow` em vez da dashboard, não silenciar o fluxo.

7. Resultado esperado após ajuste
Cenário alvo:
- `day4_completed = true`
- `day5_completed = false`
- `has_premium = true`
- `day4_completed_at` com ou sem 24h já tratadas
Então `/today` deve renderizar `Day5Flow` antes de qualquer dashboard.

Arquivos a ajustar
- `src/pages/Today.tsx` — prioridade dos guards, espera do premium loading, possível unificação do estado premium.
- opcionalmente `src/hooks/usePremium.tsx` — apenas se for necessário melhorar a sincronização, mas o essencial resolve em `Today.tsx`.
