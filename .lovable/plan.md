

# Correção Gate — Meia-Noite em vez de 24h

## Resumo
Trocar a lógica de gate de "24h exatas desde completion" para "passou meia-noite do dia civil". Duas mudanças simples.

## Arquivos a Modificar (2)

### 1. `src/pages/Today.tsx`
Substituir todos os 5 blocos de gate idênticos (`hoursSince < 24`) por uma função helper `isBeforeMidnight`:

```typescript
import { startOfDay, addDays } from 'date-fns';

const isBeforeMidnight = (completedAt: string): boolean => {
  const nextMidnight = startOfDay(addDays(new Date(completedAt), 1));
  return Date.now() < nextMidnight.getTime();
};
```

Cada gate muda de:
```typescript
const hoursSince = (Date.now() - new Date(dayXCompletedAt).getTime()) / 3600000;
if (hoursSince < 24) { ... }
```
Para:
```typescript
if (isBeforeMidnight(dayXCompletedAt)) { ... }
```

5 ocorrências: linhas 308-310, 324-326, 344-346, 360-362, 376-378.

### 2. `src/components/journey/WaitingScreen.tsx`
Mudar `getTimeRemaining` para contar até meia-noite em vez de +24h:

```typescript
import { startOfDay, addDays } from 'date-fns';

function getTimeRemaining(completedAt: string) {
  const nextMidnight = startOfDay(addDays(new Date(completedAt), 1));
  const diff = nextMidnight.getTime() - Date.now();
  if (diff <= 0) return null;
  // ... rest unchanged
}
```

Também atualizar texto de "O Dia X será liberado em breve" para "O Dia X será liberado à meia-noite".

## Dependência
`date-fns` já instalado (v3.6.0).

## Resultado
- Completa às 16h → disponível 00h00 (8h, não 24h)
- Completa às 23h50 → disponível 00h00 (10min)
- Countdown mostra tempo real até meia-noite

