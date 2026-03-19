

# Objetivos múltiplos no passo 13 do Onboarding

## Resumo
Converter o passo 13 ("Seu Objetivo em 14 Dias") de seleção única para múltipla (1-3 objetivos), incluindo migração do banco de dados.

## Mudanças

### 1. Migração do banco de dados
- Alterar coluna `objective` (text) para `objectives` (text[]) na tabela `profiles`
- SQL: `ALTER TABLE profiles RENAME COLUMN objective TO objectives; ALTER TABLE profiles ALTER COLUMN objectives TYPE text[] USING CASE WHEN objective IS NOT NULL AND objective != '' THEN ARRAY[objective] ELSE '{}'::text[] END; ALTER TABLE profiles ALTER COLUMN objectives SET DEFAULT '{}'::text[];`

### 2. `src/data/onboarding.ts`
- Passo id=13: trocar `type: "single"` para `type: "multi"`, subtitle para "Escolha até 3 objetivos para as próximas duas semanas."

### 3. `src/pages/Onboarding.tsx`
- No `handleMultiSelect`: se `current.id === 13`, limitar a 3 itens (ignorar clique quando já tem 3 e não está desselecionando)
- No `canProceed`: para step 13, exigir pelo menos 1 selecionado (já funciona pela lógica multi existente, mas confirmar que id 13 não está na lista de opcionais)
- Na tela `info` (step 16): adaptar texto personalizado para listar múltiplos objetivos (join com vírgula)

### 4. `src/pages/Auth.tsx`
- Linha 59: trocar `answers[13] as string` para `answers[13] as string[]`
- Linha 72: trocar `objective` para `objectives` no payload

### 5. `src/lib/profileEngine.ts`
- `UserProfile`: trocar `objective: string` para `objectives: string[]`
- `parseOnboardingFromLocal`: ler `data[13]` como `string[]`
- `parseOnboardingFromSupabase`: ler `data.objectives` como `string[]`
- `scoreExercise`: iterar sobre todos os objectives para somar score
- `selectHabitsForDay`: unir categorias prioritárias de todos os objectives

### 6. `src/components/EditProfileDialog.tsx`
- Trocar Select único por checkboxes (max 3) para objetivos
- Salvar como `objectives: string[]`

### 7. `src/hooks/useChallengeData.tsx`
- Adaptar qualquer uso de `profile.objective` para `profile.objectives`

## O que NÃO muda
- As 6 opções de objetivos
- Design visual dos botões (apenas círculo vira quadrado, já automático pelo type "multi")
- Progressão entre passos

