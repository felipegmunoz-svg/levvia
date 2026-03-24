

## Dia 5: Movimento Sem Dor — Plano de Implementação

### 1. Migration SQL
Adicionar 3 colunas à tabela `profiles`:
- `day5_completed` (boolean, default false)
- `day5_completed_at` (timestamptz)
- `day5_movement_data` (jsonb)

### 2. Componentes novos (6 arquivos em `src/components/journey/`)

**`Day5Flow.tsx`** — Orchestrator com 5 steps (welcome → movement → snack → journal → closing). AnimatePresence mode="wait", localStorage backup, saveWithRetry. Mesmo padrão Day4Flow.

**`Day5Welcome.tsx`** — Emoji 🏃‍♀️, título "Dia 5 — Movimento Sem Dor", afirmação sobre sistema linfático, CTA "Ativar Minha Bomba Linfática →". Sticky footer.

**`Day5MovementGuide.tsx`** — 3 exercícios em step-by-step com progress dots. Cada exercício mostra:
- Header com emoji + título
- **Ilustração SVG inline minimalista** mostrando a postura/movimento correto (silhueta simplificada com setas de direção) — não apenas emojis
- Instruções textuais + reps
- Botão "Completei Este Exercício" → feedback verde
- Botão "Próximo" desabilitado até marcar completo

**`Day5Snack.tsx`** — Smoothie Verde Detox com ingredientes e preparo inline. Benefício da bromelina em destaque.

**`Day5Journal.tsx`** — Grid 2x2 para sensação nas pernas (4 opções com emoji) + grid 2x2 para energia (4 opções). Textarea opcional para notas. **canvas-confetti** dispara ao selecionar "Muito Mais Leves" (particleCount: 50, cores Levvia #2EC4B6/#1B3F6B/#2E86AB) + mensagem celebratória motion.div. Botão desabilitado até selecionar ambos os campos.

**`Day5Closing.tsx`** — Lista conquistas Dia 1-5, teaser Dia 6 "O Poder das Especiarias". Sticky footer.

### 3. Today.tsx — Modificações
- Adicionar state `day5Done` e `day4CompletedAt` (linhas ~90)
- Na query existente (linha 110), adicionar `day5_completed, day4_completed_at` ao select
- Nos setters (linhas 116-122), adicionar `setDay5Done` e `setDay4CompletedAt`
- No catch (linha 129), adicionar `setDay5Done(false)`
- Após o bloco Day 4 gate (linha 287), adicionar gate Day 5:
  - Premium check → PaywallModal
  - 24h gate (day4CompletedAt) → WaitingScreen
  - `!day5Done` → Day5Flow
- Import Day5Flow

### 4. Dependência nova
- `canvas-confetti` — ~4kb gzipped, para celebração no Journal

### 5. Decisões técnicas
- **Ilustrações**: SVG inline dentro do componente (3 silhuetas minimalistas com setas de movimento — sem assets externos)
- **Confetti**: canvas-confetti real, não substituto motion.div
- **saveWithRetry** reutilizado
- **Textarea** do shadcn/ui para notas

### Arquivos
- **Novos**: 6 componentes + 1 dependência (canvas-confetti)
- **Modificado**: `src/pages/Today.tsx`
- **Migration**: 3 colunas em profiles

