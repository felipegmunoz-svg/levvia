

# Corrigir Fluxo do Dia 1: Diagnóstico → Momentos 4-5 → Planos

## Problema

O fluxo atual é: Onboarding → Diagnóstico → **Planos** → Auth → Checkout → /today (Day1Flow)

A usuária ainda não está autenticada quando sai do Diagnóstico, então os Momentos 4-5 (que salvam no Supabase com `user_id`) não podem rodar nesse ponto. O Diagnóstico redireciona direto para `/plans`.

## Solução

Criar uma rota pública `/day1-journey` que exibe os Momentos 4-5 **sem autenticação**, salvando dados no localStorage. Quando a usuária finalmente chegar ao `/today` (autenticada), o Day1Flow sincroniza esses dados para o banco.

## Alterações

### 1. Criar página pública `Day1Journey.tsx`

**Arquivo:** `src/pages/Day1Journey.tsx`

- Componente com estado `step` (4 ou 5)
- Step 4: renderiza `Day1MealSuggestion` usando perfil do localStorage (via `useProfile`, que já tem fallback para localStorage)
- Step 5: renderiza uma versão do closing que salva no localStorage (`levvia_day1_diary`) em vez do Supabase
- Após salvar: navega para `/plans`

### 2. Criar `Day1ClosingPublic.tsx`

**Arquivo:** `src/components/journey/Day1ClosingPublic.tsx`

- Mesmo layout visual do `Day1Closing` existente
- Em vez de salvar no Supabase, salva no localStorage: `levvia_day1_diary = { leg_sensation, guilt_before, guilt_after, notes }`
- Marca `levvia_day1_local_completed = true` no localStorage
- Botão de encerramento navega para `/plans` em vez de `/today`

### 3. Alterar Diagnóstico → `/day1-journey`

**Arquivo:** `src/pages/Diagnosis.tsx` (linha ~324)

- Mudar `navigate("/plans")` para `navigate("/day1-journey")`

### 4. Registrar rota pública

**Arquivo:** `src/App.tsx`

- Adicionar `<Route path="/day1-journey" element={<Day1Journey />} />`

### 5. Ajustar Day1Flow no /today

**Arquivo:** `src/components/journey/Day1Flow.tsx`

- Na inicialização, verificar se existe `levvia_day1_local_completed` no localStorage
- Se sim: sincronizar dados do localStorage (`levvia_day1_diary`) para o Supabase (tabelas `daily_diary` e `profiles`), marcar `day1_completed = true`, limpar localStorage, e chamar `onComplete()`
- Isso garante que a versão pública dos momentos 4-5 seja reconhecida quando a usuária chega ao /today autenticada

## O que NÃO será alterado

- Onboarding existente
- Day1Welcome e HeatMapInteractive (momentos 1-2 continuam no /today)
- Day1Closing original (continua disponível para uso autenticado)
- Auth, checkout, admin

## Fluxo Final

```text
Onboarding → Diagnóstico → Day1Journey (M4+M5, público, localStorage)
  → Planos → Auth → Checkout
  → /today (Day1Flow detecta localStorage, sincroniza, marca completo)
  → Today normal
```

