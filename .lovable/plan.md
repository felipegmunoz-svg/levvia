
Objetivo: instrumentar o onboarding para descobrir exatamente onde o fluxo quebra entre interação da usuária, atualização de `answers`, persistência em `localStorage` e leitura no sync.

1. Instrumentar `src/pages/Onboarding.tsx` no `useEffect([answers])`
- Adicionar log detalhado sempre que `answers` mudar:
  - total de chaves
  - chaves atuais
  - payload completo
- Adicionar branch explícita para estado vazio:
  - `⚠️ [useEffect] answers está vazio, não persistiu`
- Após `localStorage.setItem("levvia_onboarding", ...)`, reler a chave e logar a verificação:
  - conteúdo salvo
  - tamanho em chars
- Isso confirma se:
  - o effect dispara
  - `answers` realmente mudou
  - o browser aceitou a gravação

2. Instrumentar todos os pontos que chamam `setAnswers`
Mapear e adicionar logs antes e dentro do updater funcional nestes pontos já existentes:
- `handleSingleSelect`
- `handleMultiSelect`
- `handleNext` para:
  - `name`
  - `number`
  - `body_metrics`
  - `pantry`
- `handleSelectMostPantry`

Padrão dos logs:
- antes do `setAnswers`: step atual, `current.id`, tipo, valor recebido
- dentro do updater:
  - quantidade antes/depois
  - objeto final atualizado
Isso vai mostrar em quais steps o estado entra corretamente e em quais não entra.

3. Instrumentar finalização do onboarding antes da navegação
No bloco final de `handleNext` (`else` quando termina o onboarding):
- logar o snapshot completo antes do save final:
  - `answersLength`
  - `answersKeys`
  - `answersData`
  - `localStorage.getItem("levvia_onboarding")`
- logar também `finalAnswers` imediatamente antes do `setItem`
- adicionar erros explícitos se:
  - `answers` estiver vazio
  - `localStorage` estiver vazio
Assim fica claro se o problema está no state, no save incremental, ou no save final.

4. Instrumentar restauração inicial
Nos lazy initializers de:
- `answers`
- `nameInput`
- `numberInput`
- `weightInput`
- `heightInput`
Adicionar logs curtos de restore:
- chave encontrada ou não
- quantidade de respostas restauradas
Isso confirma se o componente está montando já vazio ou se está perdendo dados depois.

5. Instrumentar o lado do sync para fechar o circuito
Em `src/lib/syncOnboarding.ts`:
- manter o log atual de snapshot
- expandir com:
  - chaves de `answers`
  - tamanho do JSON bruto
  - presença dos backups (`pantry/objectives/restrictions`)
Isso permite comparar exatamente o que saiu do onboarding com o que chegou ao sync.

6. Resultado esperado da investigação
Com esses logs será possível isolar qual cenário está acontecendo:
- `setAnswers` nunca é chamado em certos steps
- `setAnswers` é chamado, mas `answers` não muda
- `answers` muda, mas `useEffect` não persiste
- persiste, mas a chave é sobrescrita depois
- persiste corretamente, mas chega vazia ao sync por limpeza/navegação posterior

7. Próxima ação provável após os logs
Dependendo do que aparecer, a correção mais provável será uma destas:
- centralizar updates em um helper `updateAnswer(stepId, value)` para evitar pontos sem log e sem persistência
- persistir imediatamente também nos steps de texto/número/body_metrics dentro dos handlers, não só via `useEffect`
- salvar explicitamente passos informativos/welcome se o produto realmente espera um `raw` com todos os IDs
- revisar se algum fluxo de navegação para `/diagnosis` ou `/auth` está recriando/limpando a chave

Arquivos envolvidos
- `src/pages/Onboarding.tsx` — principal instrumentação
- `src/lib/syncOnboarding.ts` — logs de leitura/snapshot

Critério de sucesso
- conseguir ver, em ordem, logs de:
  1. interação do step
  2. `setAnswers` chamado
  3. `answers` atualizado
  4. `useEffect` disparado
  5. `localStorage` verificado
  6. snapshot completo antes do sync
Se qualquer elo faltar, teremos identificado o ponto exato da quebra.
