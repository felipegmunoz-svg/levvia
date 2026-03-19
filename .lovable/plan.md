

# Corrigir Fluxo Dia 1: 3 Correções

## Diagnóstico

**Correção 1 — Bug real encontrado:** No `Day1Flow.tsx`, quando `determineStep` detecta `onboardingDone=false`, define `step=3`. Porém, step 3 não renderiza nada (linha 147 retorna `null`) e não redireciona. O redirect para `/onboarding` só acontece dentro de `handleHeatMapDone`, mas se a usuária recarregar a página com o HeatMap já salvo, fica presa numa tela em branco.

**Correção 2 — Fluxo correto já existe:** Após o onboarding, a navegação já segue Onboarding → `/diagnosis` → `/day1-journey` (M4+M5) → `/plans`. Os momentos 4 e 5 são exibidos na rota `/day1-journey` pré-auth. Quando a usuária chega ao `/today` autenticada, o `handleHeatMapDone` detecta `levvia_day1_local_completed` e sincroniza os dados sem re-exibir M4+M5 (já foram vistos). Não há alteração necessária aqui, apenas garantir que a Correção 1 funcione.

**Correção 3 — Frase encontrada:** Linha 60 de `Today.tsx`.

## Alterações

### 1. `src/components/journey/Day1Flow.tsx`

Adicionar tratamento para `step === 3`: quando renderizado, executar `navigate("/onboarding", { replace: true })` via useEffect ou renderização condicional. Isso resolve o caso onde a página é carregada com HeatMap já salvo mas onboarding pendente.

```typescript
// Antes do return null final, adicionar:
if (step === 3) {
  navigate("/onboarding", { replace: true });
  return null;
}
```

### 2. `src/pages/Today.tsx` (linha 60)

Remover a frase "Lembre-se: o Levvia não faz milagres, mas seu esforço transforma!" da função `getIncentiveMessage`. Quando `progress === 0`, não retornar mensagem nenhuma (retornar string vazia ou remover o caso).

```typescript
// De:
if (progress === 0) return "Lembre-se: o Levvia não faz milagres, mas seu esforço transforma!";
// Para:
if (progress === 0) return "";
```

E no JSX, condicionar a exibição para não mostrar mensagem vazia:
```typescript
{getIncentiveMessage(progressPercent) && (
  <p>💡 {getIncentiveMessage(progressPercent)}</p>
)}
```

### Nenhum outro arquivo alterado

