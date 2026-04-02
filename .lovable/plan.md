

# Tela "Dia Bloqueado" — DayLockedScreen

## 1. Novo componente `src/components/journey/DayLockedScreen.tsx`

Props: `dayNumber`, `theme`, `preview: string[]`, `isPreviousDayComplete`, `onUnlock`, `onGoBack?: () => void`.

Layout:
- Ícone Lock (lucide) centralizado + "Dia {N} · {theme}"
- Se `isPreviousDayComplete`: mensagem de descanso + countdown HH:MM:SS até meia-noite, chamando `onUnlock()` ao zerar
- Se `!isPreviousDayComplete`: mensagem "Conclua o Dia {N-1}" + botão "Voltar ao Dia {N-1}" que chama `onGoBack`
- Bloco "O que vem no Dia {N}:" com bullets do array `preview`
- Botão secundário "Lembrar-me à meia-noite" (apenas visual, sem ação real)
- Countdown via `useEffect` + `setInterval(1000)`, calcula `new Date().setHours(24,0,0,0) - Date.now()`

## 2. Integrar em `src/pages/Journey.tsx`

- Adicionar state `lockedDay: number | null`
- No `handleDayClick`: se dia bloqueado (`!isDayUnlocked(day)`), setar `lockedDay = day` em vez do toast atual; se dia é o próximo (unlocked mas não completo e `currentDay + 1`), também mostrar DayLockedScreen com `isPreviousDayComplete = true`
- Quando `lockedDay !== null`, renderizar `<DayLockedScreen>` como overlay/tela sobre a lista
- `isPreviousDayComplete`: `isDayCompleted(lockedDay - 1)`
- `preview`: array estático de 3 bullets por dia (usar `getTouchpointConfig(day)` para extrair theme; bullets estáticos genéricos por ora)
- `theme`: `getTouchpointConfig(lockedDay).theme`
- `onUnlock`: `setLockedDay(null)` + reload/navigate
- `onGoBack`: `setLockedDay(null)` (volta à lista)

## 3. Preview compacto após completar dia (NightSlot closing)

Em `DayTouchpointView.tsx`, quando `isDayComplete` e `dayNumber < 14`, renderizar uma versão compacta do DayLockedScreen (sem bloco de bloqueio, apenas countdown + preview do dia seguinte). Passará `isPreviousDayComplete={true}` e `onUnlock` para navegar ao próximo dia.

## Arquivos modificados
- `src/components/journey/DayLockedScreen.tsx` (novo)
- `src/pages/Journey.tsx`
- `src/components/journey/DayTouchpointView.tsx`

