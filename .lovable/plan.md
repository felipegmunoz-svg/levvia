

# Polimento visual: opacidades e interações

## Escopo
Atualizar `bg-white/[0.06]` → `bg-white/[0.08]` e `border-white/10` → `border-white/[0.12]` em todos os componentes user-facing, adicionar `cursor-pointer` e `transition-all duration-200 ease-out` onde ausentes.

**Nota:** ExerciseCard e RecipeCard já usam `glass-card` (que define seu próprio bg/border) e já têm `transition-all duration-200`. FilterChip já está atualizado. Esses não precisam de mudanças.

## Arquivos a modificar (12 arquivos)

### 1. `src/pages/Today.tsx` — linha 216
Search bar: `bg-white/[0.06]` → `bg-white/[0.08]`, `border-white/10` → `border-white/[0.12]`

### 2. `src/components/ChecklistItemCard.tsx` — linha 19
`bg-white/[0.06] border-white/10` → `bg-white/[0.08] border-white/[0.12]`
Adicionar `cursor-pointer` e `duration-200 ease-out` à classe do button.

### 3. `src/components/TodaySearchOverlay.tsx` — linha 134
`bg-white/[0.06] border border-white/10` → `bg-white/[0.08] border border-white/[0.12]`
Adicionar `cursor-pointer`.

### 4. `src/components/EditProfileDialog.tsx` — linha 68
`bg-white/[0.06]` → `bg-white/[0.08]`, `border-white/10` → `border-white/[0.12]`

### 5. `src/components/NotificationSettings.tsx` — linhas 168, 196
`bg-white/[0.06]` → `bg-white/[0.08]`, `border-white/10` → `border-white/[0.12]`

### 6. `src/components/PainReliefMode.tsx` — linha 77
`bg-white/[0.06]` → `bg-white/[0.08]`

### 7. `src/components/MotorAlivio.tsx`
`bg-white/[0.06]` → `bg-white/[0.08]` em botões close/interativos

### 8. `src/components/ProgressDashboard.tsx` — linhas 121, 172
`bg-white/[0.06]` → `bg-white/[0.08]` (barras de progresso)

### 9. `src/pages/Profile.tsx` — linhas 316, 334, 536, 571
`bg-white/[0.06]` → `bg-white/[0.08]`, `border-white/10` → `border-white/[0.12]`

### 10. `src/pages/Checkout.tsx` — linha 59
`bg-white/[0.06]` → `bg-white/[0.08]`, `border-white/10` → `border-white/[0.12]`

### 11. `src/pages/ResetPassword.tsx` — linhas 101, 114
`bg-white/[0.06]` → `bg-white/[0.08]`, `border-white/10` → `border-white/[0.12]`

### 12. `src/components/journey/ActivityCard.tsx` — linha 23
Adicionar `duration-200 ease-out cursor-pointer` ao button.

## Fora do escopo
- Páginas admin (não são user-facing)
- ExerciseCard, RecipeCard, FilterChip (já atualizados)
- `glass-card` class (definida no CSS, não nos componentes)

## Nenhuma lógica alterada — apenas classes CSS.

