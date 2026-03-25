

# Dia 5 — Dashboard Completo + Mapa de Calor

## Diagnóstico
O fluxo `closing → dashboard` **já está correto** no código (linha 142: `goTo("dashboard")`). O botão do Day5Closing diz "Salvar Progresso" mas corretamente chama `onComplete` que navega para dashboard. Se o dashboard não aparece, pode ser um problema de cache/deploy anterior — mas vamos garantir tudo funciona e adicionar as melhorias solicitadas.

## Arquivos a Modificar (2)

### 1. `src/components/journey/Day5Dashboard.tsx`
Reescrever com 3 novas seções, mantendo as existentes:

**Adicionar prop `heatMapDay1`** (dados do mapa de calor do Dia 1)

**Nova seção: Mapa de Calor Comparação (Dia 1 vs Dia 5)**
- Usar `HeatMapInteractive` com `readOnly` e `size="small"` lado a lado
- Dia 1: dados originais do `heatMapDay1`
- Dia 5: dados calculados com melhora baseada em `legsSensation` (reduzir intensidade nas pernas se relatou melhora)
- Helper `calculateImprovedMap` que reduz intensidade em áreas de pernas baseado na sensação reportada
- Fallback se `heatMapDay1` não existir

**Nova seção: Timeline Progresso (Dias 1-5)**
- 5 items com ícone ✓ verde (dias 1-4) e número 5 em destaque (dia atual)
- Cada dia com título e subtítulo do tema
- Barra de progresso 5/14 (36%)

**Ordem final dos blocos:**
1. Header (✨)
2. Checklist 4 atividades
3. Mapa de Calor Comparação ← NOVO
4. Timeline Progresso ← NOVO
5. Insight personalizado (4 cenários)
6. Fogo Interno (score)
7. Lavínia (teaser Dia 6)
8. Botão sticky

### 2. `src/components/journey/Day5Flow.tsx`
- Importar `useProfile` hook
- Buscar `profile.heatMapDay1` 
- Passar como prop `heatMapDay1` ao `Day5Dashboard`

### 3. `src/components/journey/Day5Closing.tsx`
- Mudar texto do botão de "Salvar Progresso" para "Ver Resumo do Dia →" (clareza de navegação)

## Detalhes Técnicos

**HeatMapInteractive** já suporta `readOnly` e `size="small"` — reutilizar diretamente para as duas silhuetas lado a lado.

**`calculateImprovedMap`**: Se `legsSensation === "muito_mais_leves"`, reduz intensidade das pernas em 2. Se `"um_pouco_mais_leves"`, reduz em 1. Se `"iguais"` ou `"mais_pesadas"`, mantém original.

**useProfile** no Day5Flow: já disponível, retorna `profile.heatMapDay1` como `Record<string, number>`.

