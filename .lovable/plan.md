

# Novo Sistema de Design - Levvia (Dark Theme)

Mudança visual completa: tema escuro azul-noite, fonte DM Sans, cards glassmorphism, botões gradient. Nenhuma lógica alterada.

---

## 1. `src/index.css` -- Reescrever variáveis e utilitários

- Trocar import da fonte Nunito por DM Sans (weights 300, 400, 500)
- Substituir todas as variáveis CSS `:root` pelos novos valores convertidos para HSL:
  - `--background`: #0D1F36 (210 63% 13%)
  - `--foreground`: #EDF2F7 (214 32% 91%)
  - `--card`: rgba via custom property (será tratado com var especial)
  - `--primary`: #1B3F6B (212 59% 26%)
  - `--secondary`: #2E86AB (196 58% 42%)
  - `--accent`: #F4A535 (36 90% 58%)
  - `--muted-foreground`: #8BA8C4 (210 33% 65%)
  - `--success`: #2EC4B6 (174 63% 47%)
  - `--border`: rgba(255,255,255,0.10)
- Remover bloco `.dark` (app é sempre dark agora)
- Atualizar utilitários: `gradient-primary` → `linear-gradient(135deg, #2E86AB, #1B3F6B)`, `shadow-soft` e `shadow-card` para tons escuros
- Adicionar classe utilitária `.glass-card` para backdrop-filter blur
- Adicionar `.bg-page-gradient` para o gradiente de topo das telas

## 2. `tailwind.config.ts` -- Atualizar fonte e cores

- `fontFamily.sans`: `['DM Sans', 'sans-serif']`
- Manter estrutura de cores via CSS vars (já funciona), apenas ajustar `card` para usar uma variável especial que suporta rgba
- Adicionar cor `card` como valor direto (`rgba(255,255,255,0.06)`) em vez de hsl

## 3. `src/components/BottomNav.tsx` -- Estilo da nav inferior

- background: `rgba(13, 31, 54, 0.95)` + `backdrop-blur-[20px]`
- border-top: `rgba(255,255,255,0.08)`
- Ícone ativo: `text-[#2E86AB]`, inativo: `text-[#8BA8C4]`
- Label ativo: `text-[#EDF2F7] font-medium`, inativo: `text-[#8BA8C4]`
- Todos ícones: `strokeWidth={1.5}`

## 4. `src/components/ChecklistItemCard.tsx` -- Cards glassmorphism

- Fundo: `bg-white/[0.06]` + `border border-white/10` + `backdrop-blur-[10px]` + `rounded-2xl`
- Estado checked: `bg-white/[0.12]`
- Todos ícones: `strokeWidth={1.5}`

## 5. `src/components/ExerciseCard.tsx` -- Cards glassmorphism

- Mesma estilização glass dos cards
- Ícones: `strokeWidth={1.5}`

## 6. `src/components/RecipeCard.tsx` -- Cards glassmorphism

- Mesma estilização glass
- Ícones: `strokeWidth={1.5}`

## 7. `src/pages/Today.tsx` -- Fundo e header

- Container: `bg-[#0D1F36]` com gradiente no topo
- Header: `background: linear-gradient(180deg, #1B3F6B 0%, #0D1F36 100px)`
- Barra de progresso: track `bg-white/10`, fill `bg-gradient-to-r from-[#2E86AB] to-[#2EC4B6]`, h-1.5, rounded-full
- Modal: glass card styling
- Todos ícones: `strokeWidth={1.5}`
- Tipografia: títulos `font-light text-[#EDF2F7]`, corpo `text-[#8BA8C4]`

## 8. `src/pages/Onboarding.tsx` -- Fundo e botões

- Container: `bg-[#0D1F36]`
- Botão CTA: `bg-gradient-to-br from-[#2E86AB] to-[#1B3F6B] rounded-3xl text-[#EDF2F7]`
- Botão desabilitado: `bg-white/[0.06] text-[#8BA8C4]`
- Barra de progresso onboarding: mesma estilização (track white/10, fill gradient)
- Cards de opção: glass style
- Input: glass card + border white/10
- Ícones: `strokeWidth={1.5}`

## 9. `src/pages/Profile.tsx` -- Fundo e cards

- Container: `bg-[#0D1F36]` com gradiente
- Cards: glass style
- Tabs: glass style com ativo usando secondary color
- Ícones: `strokeWidth={1.5}`

## 10. `src/pages/Practices.tsx` -- Fundo e tabs

- Container: `bg-[#0D1F36]` com gradiente
- Tab switcher: glass background, ativo com `bg-white/[0.12]`
- Tag filters: glass pills
- Ícones: `strokeWidth={1.5}`

## 11. `src/components/ExerciseDetail.tsx` -- Header e cards

- Header gradient: `from-[#1B3F6B] to-[#0D1F36]`
- Cards internos: glass style
- Botão "Marcar como Feito": gradient CTA
- Ícones: `strokeWidth={1.5}`

## 12. `src/components/RecipeDetail.tsx` -- Header e cards

- Header: glass com accent tint
- Cards internos: glass style
- Botão "Marcar como Feito": gradient CTA
- Ícones: `strokeWidth={1.5}`

## 13. `src/components/ui/progress.tsx` -- Barra de progresso

- Track: `bg-white/10`
- Fill: `bg-gradient-to-r from-[#2E86AB] to-[#2EC4B6]`
- Height: `h-1.5`

## 14. `src/pages/NotFound.tsx` -- Fundo escuro

- `bg-[#0D1F36]` em vez de `bg-muted`

---

## Resumo

14 arquivos alterados. Apenas classes CSS, cores e strokeWidth. Zero alterações em lógica, rotas ou dados.

