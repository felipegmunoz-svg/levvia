## Dia 3: Semáforo da Inflamação + Paywall — IMPLEMENTADO ✅

### Migration
- `day3_completed` (boolean), `day3_completed_at` (timestamptz), `has_premium` (boolean) adicionados à tabela `profiles`

### Componentes criados
- `Day3Flow.tsx` — Orchestrator (welcome → semáforo → cardápio → closing)
- `Day3Welcome.tsx` — Tela de boas-vindas Dia 3
- `FoodTrafficLight.tsx` — Semáforo Alimentar (Verde/Amarelo/Vermelho)
- `Day3CardapioPersonalizado.tsx` — 5 refeições com accordion inline
- `Day3Closing.tsx` — Encerramento + resumo conquistas
- `PaywallModal.tsx` — Paywall fullscreen com preview Dias 4-14
- `usePremium.tsx` — Hook verificação premium

### Arquivos modificados
- `Today.tsx` — Gate Dia 3 + gate premium Dia 4+
- `Day2Closing.tsx` — Copy de transição atualizado

### Checkout
- Via `VITE_CHECKOUT_URL` (variável de ambiente configurável)
