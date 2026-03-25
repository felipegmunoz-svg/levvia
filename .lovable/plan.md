

# Dia 5 V2 — Expansão para 4 Touchpoints

## Resumo

Expandir o Dia 5 de 5 para 8 steps, adicionando 3 novos componentes (Day5Lunch, Day5MicroChallenge, Day5LegsElevation) e reorganizando o fluxo no Day5Flow.tsx. Os 5 componentes existentes permanecem inalterados.

## Arquivos a Criar

### 1. `src/components/journey/Day5Lunch.tsx`
- Refeição almoço anti-inflamatória com 3 opções (Bowl Quinoa, Salmão, Frango)
- Padrão idêntico ao Day5Snack: múltipla escolha com accordion expandível (ingredientes + preparo)
- Props: `onContinue: (choice: string) => void`
- Botão disabled até selecionar; texto dinâmico no footer sticky

### 2. `src/components/journey/Day5MicroChallenge.tsx`
- Micro-desafio tarde: giro de tornozelos (30s)
- Tela única com instruções numeradas, benefício, botão "Completei"
- Confetti simples ao completar (cores marca: #2EC4B6, #1B3F6B, #2E86AB)
- Props: `onContinue: () => void`
- Botão footer disabled até completar

### 3. `src/components/journey/Day5LegsElevation.tsx`
- Ritual pernas na parede: guia 5 passos + seleção duração (5/7/10 min)
- Fluxo: escolher duração → marcar completo → celebração
- Props: `onContinue: (duration: number) => void`
- Botão footer disabled até completar

### 4. Ilustração `legs-elevation-wall.png`
- Gerar via AI image generation (Nano banana pro)
- Silhueta feminina posição "L" invertida, gradiente teal, fundo branco
- Salvar em `/public/illustrations/legs-elevation-wall.png`

## Arquivo a Modificar

### 5. `src/components/journey/Day5Flow.tsx`
- Expandir `Day5Step` type: adicionar `"lunch" | "microChallenge" | "legsElevation"`
- `STEPS_ORDER`: `["welcome", "movement", "lunch", "snack", "microChallenge", "legsElevation", "journal", "closing"]`
- Expandir `MovementData` com: `lunchChoice`, `microChallengeCompleted`, `legsElevationDuration`
- Adicionar imports dos 3 novos componentes
- Adicionar 3 novos cases no render com AnimatePresence (padrão existente)
- Ajustar transições: movement→lunch, lunch→snack, snack→microChallenge, microChallenge→legsElevation, legsElevation→journal

## Persistência
- Sem mudanças no schema do banco — `day5_movement_data` já é JSONB e aceita campos adicionais
- Novos campos salvos automaticamente via `movementData` spread no Day5Flow

## Padrões Seguidos
- Sticky footer mobile-first (fixed bottom-0, bg-background/80, backdrop-blur-lg, pb-28)
- AnimatePresence mode="wait" com motion.div fade+slide (300ms)
- Glass-card para opções, ring-2 ring-secondary/60 para selecionado
- Tom Lavínia nos textos e dicas (💜)
- Confetti canvas-confetti nas cores da marca

## Ordem de Implementação
1. Gerar ilustração legs-elevation-wall.png
2. Criar Day5Lunch.tsx
3. Criar Day5MicroChallenge.tsx
4. Criar Day5LegsElevation.tsx
5. Atualizar Day5Flow.tsx com 8 steps

