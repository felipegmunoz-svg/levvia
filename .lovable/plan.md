

# Correções do Onboarding — Plano

## 1. Bug do Step Counter (Investigação)

Após análise do código atual, `handleMultiSelect` **não** altera `step`. O counter `{step + 1} de {total}` só muda via `setStep`, que só é chamado em `handleSingleSelect` e `handleNext`. O bug pode ser de uma versão anterior em cache. Contudo, vou adicionar uma proteção extra: converter `handleSingleSelect` para usar functional updater (como já feito no `handleMultiSelect`) para consistência e segurança.

## 2. Adicionar opções faltantes (`src/data/onboarding.ts`)

**Step 9 — Áreas afetadas:** Adicionar "Pernas", "Pés", "Abdômen/Barriga", "Glúteos" na ordem solicitada.

**Step 7 — Condições de saúde:** Adicionar "SOP (Síndrome do Ovário Policístico)", "Doença de Hashimoto", "Insuficiência venosa crônica" após "Linfedema".

## 3. Corrigir gênero gramatical (`src/data/onboarding.ts`)

**Step 6 — Atividade física:**
- "Moderado" → "Moderada"
- "Ativo" → "Ativa"

## 4. Fix `handleSingleSelect` (`src/pages/Onboarding.tsx`)

Converter para functional updater para consistência com `handleMultiSelect`:
```typescript
setAnswers((a) => ({ ...a, [current.id]: option }));
```

## Arquivos alterados
- `src/data/onboarding.ts` — opções dos steps 6, 7, 9
- `src/pages/Onboarding.tsx` — `handleSingleSelect` functional updater

