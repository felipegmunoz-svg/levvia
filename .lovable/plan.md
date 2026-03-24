

## Dia 5 — Múltipla Escolha Smoothie

### Mudança

**Arquivo: `src/components/journey/Day5Snack.tsx`**

Reescrever o componente seguindo o padrão do `Day4CardapioNoturno.tsx`:

1. Adicionar `useState<string | null>(null)` para `selectedSnack`
2. Criar array `snacks` com 3 opções (Verde Detox, Tropical, Vermelho Antioxidante) — cada uma com id, name, subtitle, emoji, benefit, ingredients, instructions
3. Cards clicáveis com radio visual e `AnimatePresence` para auto-expansão dos detalhes (ingredientes + preparo) ao selecionar
4. Botão desabilitado até selecionar, com texto dinâmico
5. Manter sticky footer mobile e classes do design system (`glass-card`, `text-foreground`, `text-foreground/60`, etc.) consistentes com Day4
6. Adicionar imports: `useState` do React, `motion`/`AnimatePresence` do framer-motion

### Arquivos modificados: 1
- `src/components/journey/Day5Snack.tsx` — reescrita completa

