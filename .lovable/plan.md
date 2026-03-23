
Objetivo: corrigir os 2 bloqueadores críticos e blindar a persistência do desafio para funcionar entre dispositivos sem depender de cache local obsoleto.

1. Corrigir a rota do diagnóstico
- Arquivo: `src/pages/Diagnosis.tsx`
- Troca direta no CTA final:
  - de `navigate("/day1-journey")`
  - para `navigate("/today")`
- Efeito esperado:
  - a usuária sai do diagnóstico e entra no fluxo protegido real do Dia 1
  - o `challenge_start` continua sendo definido apenas no fechamento correto do Dia 1

2. Eliminar o risco de loading infinito no Day1Flow
- Arquivo: `src/components/journey/Day1Flow.tsx`
- Problema atual:
  - `handleHeatMapDone` faz update assíncrono no perfil, mas não controla `loading` localmente com `try/catch/finally`
  - se houver erro ou estado intermediário inconsistente, o fluxo pode travar perceptivelmente
- Implementação:
  - envolver `handleHeatMapDone` em `try/catch/finally`
  - ligar `setLoading(true)` no início da persistência
  - garantir `setLoading(false)` no `finally`
  - manter a ordem de negócio atual:
    1. salvar `heat_map_day1`
    2. se onboarding não concluído → `/onboarding`
    3. se houver diário local concluído → sincronizar e finalizar dia 1
    4. caso normal → avançar para `setStep(4)`
- Blindagem adicional:
  - aplicar o mesmo padrão em `handleWelcomeDone` para evitar estados pendurados em falhas de rede
  - evitar navegação imperativa dentro do render (`if (step === 3) navigate(...)`), movendo esse redirect para `useEffect` ou retornando `<Navigate />`, para reduzir loops e estados instáveis

3. Blindar a persistência cross-device do timer de 24h
- Arquivo principal: `src/hooks/useChallengeData.tsx`
- Problema atual:
  - o cálculo de `currentDay` usa `challengeStart || localStorage.getItem("levvia_challenge_start")`
  - isso é bom como fallback, mas ainda permite cache local influenciar o dia atual
  - `saveProgress()` regrava `challenge_start` usando `localStorage`, o que pode reintroduzir valor stale no banco
- Implementação:
  - priorizar explicitamente o valor carregado do backend como fonte canônica
  - usar localStorage apenas como fallback temporário quando ainda não houve resposta do backend
  - alterar `saveProgress()` para:
    - salvar `challenge_progress`
    - enviar `challenge_start` a partir do estado `challengeStart` em memória, nunca lendo direto do localStorage
    - idealmente não atualizar `challenge_start` dentro de `saveProgress` se ele já não mudou
- Resultado:
  - o dia atual passa a refletir o banco de forma consistente entre devices
  - o cache deixa de “contaminar” o progresso

4. Invalidar caches de desafio no login/logout
- Arquivo: `src/hooks/useAuth.tsx`
- Problema atual:
  - `signOut()` não limpa caches de jornada
  - `onAuthStateChange` também não invalida progresso local ao trocar usuário/sessão
- Implementação:
  - limpar no logout:
    - `levvia_challenge_start`
    - `levvia_challenge_progress`
    - caches locais do Dia 1/2 relacionados à jornada
  - limpar/revalidar no `SIGNED_IN` e `INITIAL_SESSION` antes de recarregar dados, para forçar nova leitura do backend
- Efeito esperado:
  - ao entrar em outro dispositivo ou relogar, `/today` busca o estado real do banco
  - desaparece a necessidade de “limpar cache manualmente”

5. Ajustar a leitura inicial de /today para respeitar backend primeiro
- Arquivo: `src/pages/Today.tsx`
- Estado atual:
  - já busca `day1_completed`, `day1_completed_at`, `day2_completed`, `challenge_start` do backend
  - isso está correto, mas deve ser alinhado com a blindagem do hook
- Implementação:
  - manter `day1_completed_at` vindo do backend como base da régua de 24h
  - não depender de `levvia_challenge_start` para decidir liberação do Dia 2
  - usar `day1_completed_at` como fonte do countdown / waiting gate
- Observação:
  - isso já está parcialmente correto hoje; a correção principal aqui é consistência com o hook e eliminação de stale cache

6. Revisão de pontos que podem reintroduzir inconsistência
- Arquivos a revisar:
  - `src/pages/Auth.tsx`
  - `src/pages/Onboarding.tsx`
  - `src/lib/syncOnboarding.ts`
- Objetivo:
  - garantir que nenhum desses fluxos escreva `challenge_start` prematuramente
  - garantir que `levvia_onboarded` continue sendo setada apenas no final do onboarding
  - confirmar que o diagnóstico apenas navega para `/today`, sem inicializar desafio

Critérios de aceite esperados após implementação
1. Diagnóstico
- Clique em “Continuar” leva para `/today`
- `/today` renderiza `Day1Flow` quando `day1_completed = false`

2. Heat Map do Dia 1
- Após clicar em avançar, o spinner sempre encerra
- Em sucesso: segue para onboarding ou próxima etapa normal
- Em erro: mostra feedback e não fica preso em loading infinito

3. Timer de 24h
- Se `day1_completed_at` no banco tiver mais de 24h, o app libera Dia 2 automaticamente após login
- Isso deve funcionar mesmo com `localStorage` antigo no navegador

Arquivos que devem entrar na implementação
- `src/pages/Diagnosis.tsx`
- `src/components/journey/Day1Flow.tsx`
- `src/hooks/useChallengeData.tsx`
- `src/hooks/useAuth.tsx`
- `src/pages/Today.tsx`
- revisão pontual em:
  - `src/pages/Auth.tsx`
  - `src/pages/Onboarding.tsx`
  - `src/lib/syncOnboarding.ts`

Sem mudanças de banco previstas
- A correção é de fluxo e persistência no cliente
- Não há necessidade de migration para esta tarefa
