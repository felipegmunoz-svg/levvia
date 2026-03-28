

# Text Adjustments — 3 Files

## Changes

### 1. `src/data/onboarding.ts` — Line 54
Replace `"Qual o seu sexo biológico?"` → `"Qual o seu sexo?"`

### 2. `src/components/journey/HeatMapInteractive.tsx` — Line 100
Replace the single instruction line with multi-line instructions:
```
Toque nas áreas onde você sente mais dor, inchaço ou desconforto.
```
Plus 3 sub-instructions below:
- "Toque uma vez para dor leve (Amarelo)"
- "Toque duas vezes para dor moderada (Laranja)"
- "Toque três vezes para dor intensa (Vermelho)"

### 3. `src/pages/Diagnosis.tsx` — Line 97
Replace `"Seu Diagnóstico, {userName}"` → `"Seu Perfil Levvia, {userName}"`

### 4. `src/pages/Diagnosis.tsx` — Line 160
Replace `"Vamos focar nesses pontos nos próximos 14 dias."` → `"Estas são as áreas que você identificou com mais atenção em seu corpo. Acompanhe a evolução delas em sua jornada de leveza."`

## Files modified
- `src/data/onboarding.ts` — 1 text edit
- `src/components/journey/HeatMapInteractive.tsx` — 1 text edit (expanded instructions)
- `src/pages/Diagnosis.tsx` — 2 text edits

