
# Grid compacto de 14 dias na Journey.tsx

## O que será feito
Adicionar um grid 7×2 entre o progress ring (linha 166) e o `<main>` (linha 168), usando a mesma lógica `isDayCompleted`/`isDayUnlocked`/`handleDayClick`.

## Implementação

### Arquivo: `src/pages/Journey.tsx`

Inserir após linha 166 (`</div>` do progress ring) e antes de linha 168 (`<main>`):

```tsx
{/* Grid compacto 7x2 */}
<div className="px-5 mb-6">
  <div className="grid grid-cols-7 gap-[6px]">
    {Array.from({ length: 14 }, (_, i) => {
      const day = i + 1;
      const completed = isDayCompleted(day);
      const unlocked = isDayUnlocked(day);
      const isNext = unlocked && !completed && (day === 1 || isDayCompleted(day - 1));
      const locked = !unlocked;

      return (
        <button
          key={`grid-${day}`}
          onClick={() => handleDayClick(day)}
          disabled={locked}
          className={`aspect-square rounded-[10px] flex items-center justify-center text-[13px] font-semibold font-body transition-all duration-200 ease-out cursor-pointer ${
            completed
              ? "bg-[rgba(79,209,197,0.12)] text-[#4fd1c5]"
              : isNext
              ? "bg-[#4fd1c5] text-white shadow-[0_0_16px_rgba(79,209,197,0.25)]"
              : locked
              ? "bg-[rgba(255,255,255,0.04)] text-[#4a5568] opacity-40 cursor-default"
              : "bg-[rgba(255,255,255,0.06)] text-white/60"
          }`}
        >
          {day}
        </button>
      );
    })}
  </div>
</div>
```

### Detalhes
- 7 colunas via `grid-cols-7`, naturalmente gera 2 linhas para 14 itens
- `aspect-square` garante células quadradas
- `px-5` = 20px de margem horizontal (mesmo que o `<main>`)
- Estado "disponível mas não é próximo" usa `bg-white/[0.06]` para não ficar invisível
- Lista vertical abaixo permanece inalterada

### Arquivo modificado
- `src/pages/Journey.tsx` (inserção de ~25 linhas)
