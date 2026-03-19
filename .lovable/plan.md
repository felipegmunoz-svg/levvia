

# Reestruturar Tela de Planos

## Arquivo: `src/pages/Plans.tsx`

Reescrever completamente o componente. Remover todo o código atual (countdown, 3 planos, badges, urgência).

### Nova estrutura

1. **Header**: Logo `logo_livvia_azul_icone.png` (48px), centralizado
2. **Título**: Playfair Display italic — "Você sentiu o começo da transformação."
3. **Subtítulo**: DM Sans 300 — texto sobre os 3 dias + 14 dias
4. **Divisor** sutil
5. **Card único** (glass card, border `rgba(46,196,182,0.3)`, border-radius 20px, padding 32px):
   - Label "DESAFIO LEVVIA" (#2EC4B6, tracking wide)
   - Título "14 Dias de Transformação"
   - Preço "R$ 29,90" (2.8rem)
   - Sub "pagamento único · sem recorrência"
   - Divisor interno
   - 6 benefícios com ✦ em #2EC4B6
6. **Botão primário** full-width: "Começar meu Desafio de 14 Dias →" → salva `levvia_selected_plan = "challenge-14"` e navega para `/auth?mode=signup`
7. **Texto** "Pagamento único. Sem assinatura. Sem renovação automática."
8. **Separador** "── ou ──"
9. **Link** "Continuar explorando gratuitamente" → navega para `/today`

### O que é removido
- `useCountdown` hook, `CountdownDigit` component, `plans` array, `Plan` interface
- Todas as importações não utilizadas (Check, Sparkles, Clock, Shield, Zap, AnimatePresence, useState, useEffect)

### O que NÃO muda
- Rota `/plans` continua existindo
- Lógica de navegação para `/auth?mode=signup` mantida
- Nenhum outro arquivo alterado

