

# Dia 5 V2 — Ajustes Finais (Padrão Ouro)

## 3 Arquivos

### 1. Modificar `src/components/journey/Day5MicroChallenge.tsx`
- Emoji header: 🌀 → 🏃‍♀️
- Emoji card: 🦶 → 🏃‍♀️
- Título: "Gire os Tornozelos" → "Marcha Parada — Desperte o Fluxo"
- Descrição: foco em linfonodos da virilha
- 5 passos da marcha parada (em pé, joelho direito, esquerdo, alternar, 20 reps)
- Adicionar bloco "Adaptações" (parede/cadeira, dor, sentada, cansaço) com tom acolhedor
- Benefício: texto expandido sobre movimento cíclico + linfonodos virilha + terapia drenagem ativa
- Dica Lavínia: "Querida, vamos dar um sacode no sistema?"
- Celebração: manter texto atual

### 2. Criar `src/components/journey/Day5Dashboard.tsx`
- Checklist visual 4 atividades (manhã/almoço/tarde/noite) com ✓ verde
- Helpers `getLunchName`/`getSnackName` para traduzir IDs
- Insights personalizados para TODOS os 4 cenários de `legsSensation`:
  - `muito_mais_leves`: celebração + causa-efeito
  - `um_pouco_mais_leves`: validação + gradualidade
  - `iguais`: normalização + consistência
  - `mais_pesadas`: validação emocional + explicação hormonal/calor
- Fogo Interno com explicação clara (alto = ruim, baixo = bom) + 3 faixas de feedback (≤50, 51-70, >70)
- Mensagem Lavínia + teaser Dia 6
- Sticky footer "Finalizar Dia 5 →"
- Props: `movementData` + `onContinue`

### 3. Modificar `src/components/journey/Day5Flow.tsx`
- Adicionar `"dashboard"` ao type `Day5Step` e ao `STEPS_ORDER`
- Import `Day5Dashboard`
- `Day5Closing.onComplete` → navega para `"dashboard"` (não salva ainda)
- Novo case `dashboard`: renderiza `Day5Dashboard` com `movementData` e `onContinue={handleDay5Complete}`

### Fluxo final: 9 steps
welcome → movement → lunch → snack → microChallenge → legsElevation → journal → closing → dashboard

