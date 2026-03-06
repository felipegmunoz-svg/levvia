

# Correções Visuais — Fogo Interno + Ícones Receita

## Diagnóstico

### Ajuste 1 — Fogo Interno
O problema está em `src/data/onboarding.ts`. Os `bgClass` dos perfis usam cores claras do Tailwind (`bg-yellow-50`, `bg-orange-50`, `bg-red-50`) que geram fundos creme/bege. Precisam ser substituídos por classes glassmorphism escuras.

### Ajuste 2 — Ícones Receita
`RecipeCard.tsx` já usa `UtensilsCrossed` com `strokeWidth={1.5}` e cor accent. **Este ajuste já está correto no código atual** — nenhuma alteração necessária.

---

## Alterações

### `src/data/onboarding.ts` (linhas 153-187)

Substituir os `bgClass` e `colorClass` por classes compatíveis com o tema escuro:

| Perfil | bgClass atual | bgClass novo | colorClass atual | colorClass novo |
|--------|--------------|-------------|-----------------|----------------|
| Brisa Leve | `bg-primary-light` | `bg-white/[0.06]` | `text-primary` | `text-success` |
| Chamas Moderadas | `bg-yellow-50` | `bg-white/[0.06]` | `text-yellow-600` | `text-accent` |
| Incêndio Crescente | `bg-orange-50` | `bg-white/[0.06]` | `text-orange-600` | `text-orange-400` |
| Fogo Ardente (15-17) | `bg-red-50` | `bg-white/[0.06]` | `text-red-600` | `text-red-400` |
| Fogo Ardente (18+) | `bg-red-50` | `bg-white/[0.06]` | `text-red-600` | `text-red-400` |

### `src/pages/Onboarding.tsx` (linha 155)

Atualizar o card container do resultado para aplicar glassmorphism completo:

```
- <div className={`max-w-sm mx-auto rounded-2xl p-5 ${fireResult?.bgClass || "bg-secondary/20"}`}>
+ <div className={`max-w-sm mx-auto rounded-2xl p-5 glass-card ${fireResult?.bgClass || "bg-secondary/20"}`}>
```

Isso adiciona `border`, `backdrop-filter` e mantém o `bgClass` como override (que agora será `bg-white/[0.06]`).

Também atualizar o ícone container (linha 145) para usar glassmorphism em vez de `bgClass`:

```
- <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${fireResult?.bgClass || "bg-secondary/20"}`}>
+ <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-white/[0.06] border border-white/10">
```

---

2 arquivos alterados. Apenas classes CSS. Zero lógica modificada.

