

# Ajustar SVG do HeatMapInteractive — cobertura completa + braços maiores + preenchimento base

## Arquivo: `src/components/journey/HeatMapInteractive.tsx`

Apenas o bloco `<svg>` (linhas 93-218) será alterado.

## Mudanças

1. **Preenchimento base nas áreas clicáveis (nível 0)**
   - O nível 0 em `intensityColors` já é `rgba(237,242,247,0.08)` — confirmar que está aplicado. As áreas clicáveis sempre mostram a silhueta completa, mesmo sem clique.

2. **Adicionar paths decorativos (não-clicáveis)** preenchidos com `rgba(237,242,247,0.12)`:
   - Cabeça e pescoço (manter existentes)
   - Mãos esquerda e direita (pequenos paths no final dos braços)
   - Pés esquerdo e direito (paths abaixo das panturrilhas)

3. **Alargar paths dos braços** (`braco_esq`, `braco_dir`) em ~60% para melhor toque mobile

4. **Ajustar áreas clicáveis para cobrir corpo sem gaps**:
   - Abdômen: trocar `<rect>` por `<path>` que preenche de ombros até cintura
   - Quadris: encaixar entre abdômen e coxas
   - Coxas e panturrilhas: ajustar para continuidade perfeita

5. **Remover outline duplicado do torso/pernas** — as áreas clicáveis com preenchimento base passam a formar a silhueta

## O que NÃO muda
- IDs, labels, estado, toggleArea, handleSubmit, intensityColors, legenda, botão, animações

