

# Corrigir Fluxo do Dia 1: Welcome/HeatMap pulados

## Diagnóstico do Problema 1

O bug está no `Day1Flow.tsx` linhas 38-63. Quando a usuária chega ao `/today` (autenticada), o código verifica `levvia_day1_local_completed` no localStorage (setado pelo Day1ClosingPublic pré-auth). Se encontra, sincroniza o diário e chama `onComplete()` **imediatamente**, pulando Welcome (M1) e HeatMap (M2).

O fluxo correto deve ser:
1. Sempre verificar Welcome e HeatMap primeiro
2. Só sincronizar os dados do localStorage e marcar `day1_completed` **depois** que M1 e M2 forem concluídos

## Problema 2

Nenhum link/menu aponta para `/day1-journey` — apenas a rota no App.tsx e o redirect do Diagnóstico. Nada a remover.

## Alteração: `src/components/journey/Day1Flow.tsx`

### Lógica `determineStep` (linhas 38-63)

Remover o bloco de sync imediato do localStorage. A verificação de steps sempre começa por `welcomeShown` → `heatMapDone`, independentemente do estado do localStorage.

### Novo `handleHeatMapDone` (linhas 113-129)

Após salvar o heat map, verificar se existe `levvia_day1_local_completed` no localStorage:
- **Se sim**: sincronizar diário para o banco, marcar `day1_completed = true`, limpar localStorage, chamar `onComplete()`
- **Se não**: seguir fluxo normal (verificar onboarding → M4 → M5)

### Fluxo resultante

```text
Usuária chega ao /today (autenticada)
→ day1_welcome_shown = false → Tela de Acolhimento (M1)
→ heat_map_day1 vazio → Mapa de Calor (M2)
→ localStorage tem diary? → Sincroniza e completa Dia 1
→ Se não tem diary → Onboarding check → M4 → M5
```

### Nenhum outro arquivo alterado

