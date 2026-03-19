

# Reorganizar Onboarding + Despensa Personalizada

## Resumo
Reordenar passos 13-16 do onboarding, criar novo passo "Despensa" com filtro dinâmico baseado em restrições/preferências, salvar no banco, integrar com receitas e permitir edição no perfil.

## 1. Migração do banco de dados
- Adicionar coluna `pantry_items text[] DEFAULT '{}'::text[]` na tabela `profiles`

## 2. Reordenar passos em `src/data/onboarding.ts`
Nova ordem dos IDs:
- 13: Objetivos (atual 13) — mantém `type: "multi"`, max 3
- **Mover para:** ID 17
- 14: Restrições Alimentares (atual 14) — mantém no lugar
- 15: Preferências Alimentares (atual 15) — mantém no lugar
- 16: **NOVO** — Despensa ("O que você costuma ter em casa?")
- 17: Objetivos (movido do 13)
- 18: Análise Completa (atual 16, `type: "info"`)

Correção: relendo o pedido — a ordem final dos IDs será:
- IDs 0-13: sem mudança (até Objetivos que SAIA do 13)
- 14: Restrições (era 14, fica 14) ✓
- 15: Preferências (era 15, fica 15) ✓  
- 16: **NOVO** Despensa
- 17: Objetivos (era 13, vai para 17)
- 18: Análise Completa (era 16, vai para 18)

Isso significa que os IDs dos passos mudam. Preciso atualizar todas as referências a `answers[13]` (objetivos), `answers[14]` (restrições), `answers[15]` (preferências), `answers[16]` (info).

## 3. Novo tipo de passo: `pantry` em `src/data/onboarding.ts`
- Adicionar `"pantry"` ao union type de `OnboardingQuestion.type`
- Novo passo com `id: 16`, `type: "pantry"`, opções base definidas por categoria
- As opções serão filtradas dinamicamente no componente

## 4. Lógica de filtro dinâmico em `src/pages/Onboarding.tsx`
Quando `current.type === "pantry"`:
- Ler `answers[14]` (restrições) para filtrar ingredientes
- Regras: Vegano remove proteínas animais e laticínios; Vegetariano remove carnes/peixes; Sem Lactose remove laticínios e adiciona substitutos; Sem Glúten filtra carboidratos
- Renderizar ingredientes agrupados por categoria com emojis
- Botão "Tenho a maioria" marca ~75% dos itens filtrados
- Opcional (pode pular sem selecionar nada)

## 5. Atualizar referências de IDs em todos os arquivos

### `src/pages/Onboarding.tsx`
- `answers[13]` (objetivos) → `answers[17]`
- `handleMultiSelect` limit check: `current.id === 17`
- `canProceed`: ajustar IDs opcionais (7, 14, 15, 16 são opcionais)
- Adicionar renderização do tipo `pantry` com categorias e filtro
- Info screen: `answers[17]` para objectives

### `src/pages/Auth.tsx`
- `answers[13]` → `answers[17]` (objectives)
- `answers[14]` → `answers[14]` (restrictions, sem mudança)
- `answers[15]` → `answers[15]` (preferences, sem mudança)
- Adicionar `pantry_items: answers[16] || []` ao payload

### `src/lib/profileEngine.ts`
- `parseOnboardingFromLocal`: `data[13]` → `data[17]` para objectives
- Adicionar `pantryItems: string[]` ao `UserProfile`
- `parseOnboardingFromSupabase`: ler `pantry_items`

### `src/data/mealPlan.ts`
- `getRestrictions` lê `data[9]` — verificar se está correto (ID 14 para restrições, data[14])
- Nota: este arquivo usa IDs antigos do localStorage, precisa atualizar para `data[14]`

### `src/components/EditProfileDialog.tsx`
- Adicionar seção "Minha Despensa" com ToggleChips dos ingredientes
- Salvar `pantry_items`

## 6. Integração com receitas (`src/lib/profileEngine.ts`)
- Adicionar `scorePantryMatch(recipe, pantryItems)` que conta quantos ingredientes da receita estão na despensa
- Usar como boost no sorting de receitas (priorizar, não excluir)

## 7. Seção "Minha Despensa" no Perfil (`src/pages/Profile.tsx`)
- Adicionar card na seção de dados pessoais mostrando ingredientes marcados
- Botão "Atualizar minha despensa" que abre o EditProfileDialog na aba correspondente

## Arquivos alterados
- `supabase/migrations/` — nova migração para `pantry_items`
- `src/data/onboarding.ts` — reordenar + novo passo
- `src/pages/Onboarding.tsx` — filtro dinâmico, novo tipo pantry, atualizar IDs
- `src/pages/Auth.tsx` — atualizar IDs + salvar pantry_items
- `src/lib/profileEngine.ts` — pantryItems no UserProfile, atualizar IDs
- `src/data/mealPlan.ts` — corrigir referência de ID
- `src/components/EditProfileDialog.tsx` — seção despensa
- `src/pages/Profile.tsx` — mostrar despensa
- `src/pages/Diagnosis.tsx` — verificar referências de IDs

