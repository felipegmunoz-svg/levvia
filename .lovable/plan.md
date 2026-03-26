

# Correção Logo — Tamanho + Review Mode

## 7 Arquivos a Modificar

### 1. `src/pages/Journey.tsx` (linha 80)
- `h-8` → `h-10`

### 2-5. `Day1Flow.tsx`, `Day2Flow.tsx`, `Day3Flow.tsx`, `Day4Flow.tsx`, `Day5Flow.tsx`
Todos usam `import logoIcon from "@/assets/logo_livvia_azul_icone.png"` e `<img src={logoIcon} className="h-7" />` no review mode header.

**Mudança em cada:**
- Trocar import: `logoIcon` → `import logoFull from "@/assets/logo_livvia_azul.png"`
- Review mode header: centralizar + `h-10`
```tsx
<div className="p-4 border-b border-levvia-border bg-white sticky top-0 z-10">
  <div className="flex justify-center">
    <img src={logoFull} alt="Levvia" className="h-10" />
  </div>
</div>
```

### 6. `src/components/journey/DayTemplate.tsx` (linha 4, 86)
- Trocar import: `logoIcon` → `import logoFull from "@/assets/logo_livvia_azul.png"`
- Linha 86: centralizar + `h-10`
```tsx
<header className="px-6 pt-8 pb-2">
  <div className="flex justify-center">
    <img src={logoFull} alt="Levvia" className="h-10" />
  </div>
</header>
```

Isso cobre Day6Flow automaticamente (usa DayTemplate).

