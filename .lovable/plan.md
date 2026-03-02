

# Frase Motivacional Personalizada pelo "Fogo Interno"

## Problema
Atualmente, a frase motivacional no dashboard "Hoje" e genérica e roda com base no dia do ano (`getDailyPhrase`). A expectativa e que ela seja personalizada de acordo com o resultado do questionário "Fogo Interno" (Brisa Leve, Chamas Suaves, Chamas Moderadas, Chamas Intensas).

## Solucao

### 1. Criar frases motivacionais por nivel de fogo (`src/data/motivational.ts`)
Substituir o array unico de frases por um mapa organizado por nivel de fogo. Cada nivel tera seu proprio conjunto de 14 frases (uma para cada dia do desafio), com tom e conteudo adaptados:

- **Brisa Leve (Sem dor):** Frases de manutencao e celebracao do equilibrio
- **Chamas Suaves (Dor leve):** Frases de encorajamento gentil e prevencao
- **Chamas Moderadas (Dor moderada):** Frases de apoio e motivacao para mudanca
- **Chamas Intensas (Dor intensa/muito intensa):** Frases de acolhimento e cuidado especial

Manter tambem um array generico como fallback para usuarios que nao completaram o onboarding.

### 2. Atualizar `getDailyPhrase` para aceitar o nivel de fogo
A funcao passara a receber o nivel de dor como parametro opcional e retornara a frase correspondente ao dia + nivel. Se nenhum nivel for fornecido, usa o array generico.

### 3. Atualizar `src/pages/Today.tsx`
- Ler o `painAnswer` (resposta da pergunta 3 sobre dor) do `localStorage` (`lipevida_onboarding`)
- Passar esse valor para `getDailyPhrase(painAnswer)` para obter a frase personalizada

## Arquivos Modificados
1. **`src/data/motivational.ts`** -- Adicionar mapa de frases por nivel e atualizar `getDailyPhrase`
2. **`src/pages/Today.tsx`** -- Ler nivel de dor do localStorage e passar para `getDailyPhrase`

