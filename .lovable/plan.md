

## Debug Replay — Plano

### Mudança
**Arquivo: `src/pages/Today.tsx`**

1. **Replay em debug mode**: Quando `isDev === true`, ignorar o estado `dayXDone` para o dia mais recente completado, forçando o re-render do DayXFlow. Lógica: antes de cada gate, se `isDev` e o dia já está completo, tratar como não completo para replay.

2. **Botão "Resetar Progresso Local"**: Visível apenas quando `isDev === true`, posicionado no topo da página (acima do header). Botão discreto que limpa todas as chaves localStorage dos dias (`levvia_day1_progress`, `levvia_day2_progress`, ..., `levvia_day5_progress`, `levvia_challenge_progress`) e recarrega a página.

### Implementação

**Gate override (linhas 237-312)**: Adicionar variável `debugReplay` que, quando `isDev`, força o último dia completado a ser re-exibido. Exemplo: se `day5Done === true` e `isDev`, tratar `day5Done` como `false` localmente para que o Day5Flow renderize.

Lógica concreta — criar variáveis override logo após a linha 229:
```ts
// Debug replay: force last completed day to replay
const d1 = isDev ? false : day1Done;
const d2 = isDev ? false : day2Done;
// ... etc for each day
```

Isso é muito agressivo — resetaria TODOS os dias. Melhor abordagem: um state `replayDay` que o botão de debug define, e apenas esse dia específico é forçado a replay.

**Abordagem final**:
- Adicionar `const [replayDay, setReplayDay] = useState<number | null>(null);`
- Quando `replayDay === 5`, ignorar `day5Done` e renderizar `Day5Flow`
- Botão debug no topo mostra opções de replay (Day 1-5)
- Botão "Resetar localStorage" limpa progress keys e recarrega

**Botão debug (antes do header, linha 346)**:
```tsx
{isDev && (
  <div className="bg-yellow-100 p-2 flex gap-2 items-center text-xs">
    <span>🐛 Debug:</span>
    {[1,2,3,4,5].map(d => (
      <button key={d} onClick={() => setReplayDay(d)} className="px-2 py-1 bg-yellow-300 rounded">
        Replay Dia {d}
      </button>
    ))}
    <button onClick={() => { /* clear localStorage keys, reload */ }}>
      Resetar Local
    </button>
  </div>
)}
```

**Nos gates**: Adicionar antes da linha 237:
```ts
if (replayDay === 1) return <Day1Flow onComplete={() => setReplayDay(null)} />;
if (replayDay === 2) return <Day2Flow onComplete={() => setReplayDay(null)} />;
// ... etc
```

Isso bypassa completamente todos os gates quando um replay está ativo.

### Arquivos modificados: 1
- `src/pages/Today.tsx` — adicionar `replayDay` state, barra debug com botões replay + reset localStorage

