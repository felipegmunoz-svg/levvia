

# Modo Linear de Teste — Plano

## Resumo
Converter o app de jornada temporal (bloqueios 24h) para modo sequencial imediato, permitindo testar todos os 6 dias em ~30 minutos.

## Arquivos a modificar

### 1. `src/pages/Today.tsx`
**Remover** toda lógica temporal (WaitingScreen, startOfDay, addDays) entre linhas 322-435.

**Substituir** por lógica sequencial simples:
- Calcular `completedCount` a partir dos estados `day1Done`...`day6Done`
- Determinar `nextDay = completedCount + 1`
- Se todos 6 completos → tela "Jornada Completa 🎉" com botão para `/journey`
- Se `nextDay` entre 1-3 → renderizar DayXFlow direto (sem espera)
- Se `nextDay` === 4 e sem premium → PaywallModal
- Se `nextDay` entre 4-6 com premium → renderizar DayXFlow direto
- Remover imports de `startOfDay`, `addDays`, `WaitingScreen`
- Remover estados `dayXCompletedAt` (não mais necessários para gating)
- Manter review mode e debug replay intactos

**onComplete** de cada flow: `() => setDayXDone(true)` (sem `window.location.reload`)

### 2. `src/pages/Journey.tsx`
**Tornar todos dias 1-6 clicáveis** (não apenas completados + próximo):
- Remover lógica `isLocked` para dias 1-6
- Dias 7-14 permanecem bloqueados ("Em breve")
- Badge: "Rever" se completado, "Próximo" se é o próximo sequencial, círculo vazio se disponível
- Click: se completado → `/today?review=N`; se não completado → `/today` (flow normal trata)

### 3. Auth — **Não modificar**
Manter autenticação atual. Auto-login é risco desnecessário e o login já funciona.

## O que NÃO muda
- Day1-6 Flow components (intactos)
- HeatMapInteractive, UI components
- Database schema
- DayReview component
- Design system, BottomNav

## Resultado
Completar Dia 1 → Dia 2 aparece imediatamente → ... → Dia 6 → "Jornada Completa!"

