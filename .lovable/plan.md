

# Sprint 1.7: Janela de Preparação — Modo Leitura

## Resumo
Após completar um dia, a mulher pode clicar "Preparar meu amanhã →" e ver o conteúdo do dia seguinte em modo read-only (sem marcar conclusões).

## Alterações

### 1. `src/components/journey/DayTouchpointView.tsx`

**Adicionar prop `readOnly?: boolean`** na interface (linha 26-37):
```tsx
readOnly?: boolean;
```

**No componente** (linha 80-91), desestruturar `readOnly`:
```tsx
const DayTouchpointView = ({ ..., readOnly }: DayTouchpointViewProps) => {
```

**Banner no topo** — inserir logo após o header (antes dos slots, ~linha 230):
```tsx
{readOnly && (
  <div className="mx-5 mb-3 px-4 py-3 rounded-xl bg-secondary/10 border border-secondary/20">
    <p className="text-xs text-secondary font-body text-center">
      Modo Preparação — Conheça seu dia de amanhã
    </p>
    <p className="text-[10px] text-levvia-muted font-body text-center mt-1">
      As marcações serão liberadas às 00:00
    </p>
  </div>
)}
```

**Desabilitar conclusão de slots** — no `handleSlotComplete` (linha 103-115), adicionar guard:
```tsx
if (readOnly) return; // já existe guard para isReviewMode, adicionar readOnly
```

**Botão de conclusão nos slots** — onde passa `isReviewMode` a cada slot (linhas 348-397), adicionar `|| readOnly`:
```tsx
isReviewMode={isReviewMode || isDone || readOnly}
```
Isso faz cada slot renderizar em modo leitura (botões desabilitados).

**Esconder card de celebração** — o bloco `{allDone && ...}` (linha 412-443) não deve aparecer em readOnly:
```tsx
{allDone && !readOnly && (
```

**Tooltip visual nos slots em readOnly** — quando `readOnly` e o slot não está done, mostrar texto "Disponível amanhã" no lugar do chevron:
```tsx
{readOnly && !isDone ? (
  <span className="text-[10px] text-levvia-muted">Disponível amanhã</span>
) : isDone ? (
  // checkmark existente
) : (
  // chevron existente
)}
```

### 2. `src/hooks/useChallengeData.tsx`

**Expor função para gerar touchpoints de qualquer dia** — extrair a lógica do `useMemo` de `todayTouchpoints` para uma função reutilizável `buildTouchpoints(day, ...)` que aceita um número de dia. Usar essa função tanto para `currentDay` quanto para `currentDay + 1`.

**Adicionar ao retorno:**
```tsx
nextDayTouchpoints: useMemo(() => {
  if (currentDay >= 14 || dataLoading || profileLoading || !profile) return null;
  return buildTouchpoints(currentDay + 1, exercises, filteredRecipes, profile, rescueMode);
}, [currentDay, exercises, filteredRecipes, profile, dataLoading, profileLoading, rescueMode]),
```

### 3. `src/pages/Today.tsx`

**Adicionar estado de preview:**
```tsx
const [showPreview, setShowPreview] = useState(false);
```

**Desestruturar `nextDayTouchpoints`** do `useChallengeData`.

**No bloco principal** (linha 163-194), quando `isDayComplete` e `currentDay < 14` e `showPreview`:
```tsx
else if (isDayComplete && showPreview && nextDayTouchpoints && currentDay < 14) {
  content = (
    <DayTouchpointView
      dayNumber={currentDay + 1}
      touchpoints={nextDayTouchpoints}
      progress={{ morning: { done: false }, lunch: { done: false }, afternoon: { done: false }, night: { done: false } }}
      readOnly={true}
      onSlotComplete={() => {}}
    />
  );
}
```

**No card de celebração dentro do DayTouchpointView** (ou no Today.tsx após isDayComplete): substituir ou complementar o `DayLockedScreen` com o botão "Preparar meu amanhã →":
- Isso já existe parcialmente no `DayTouchpointView` (linha 424-442)
- Adicionar botão antes do `DayLockedScreen`:

```tsx
<button
  onClick={() => setShowPreview(true)}
  className="w-full py-3 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary font-medium text-sm font-body mt-3"
>
  Preparar meu amanhã →
</button>
```

Para isso funcionar, precisamos passar um callback `onPreviewNext` ao `DayTouchpointView` e chamá-lo no botão. Alternativamente, mover a lógica de preview para o `Today.tsx` verificando `isDayComplete`.

**Abordagem escolhida**: Detectar `isDayComplete` no Today.tsx e inserir o botão/preview lá, já que o Today.tsx controla o estado `showPreview`.

Na seção onde `todayTouchpoints` é renderizado (linha 163-194), adicionar lógica condicional:
- Se `isDayComplete` e `!showPreview`: mostrar o `DayTouchpointView` normal (com card de celebração) + botão extra
- Se `isDayComplete` e `showPreview`: mostrar o `DayTouchpointView` do dia seguinte com `readOnly=true`
- Adicionar botão "Voltar ao meu dia" no preview para sair

## Arquivos modificados
- `src/components/journey/DayTouchpointView.tsx` — prop `readOnly`, banner, guards
- `src/hooks/useChallengeData.tsx` — extrair `buildTouchpoints`, expor `nextDayTouchpoints`
- `src/pages/Today.tsx` — estado `showPreview`, lógica condicional, botão

## Lógica inalterada
- Conclusão de slots, confetti, navegação, paywall, debug — tudo preservado
- O `DayLockedScreen` com countdown continua funcionando normalmente dentro do card de celebração

