

# Integrar 30 Exercicios Detalhados no LipeVida

## Resumo
Substituir os 10 exercicios atuais por 30 exercicios completos, organizados em 6 categorias, com um novo campo "Posicao Inicial" e conteudo mais detalhado em cada exercicio.

---

## Mudancas Necessarias

### 1. Atualizar a interface Exercise (`src/data/exercises.ts`)
- Adicionar campo `startPosition: string` para a "Posicao Inicial" de cada exercicio
- Atualizar `exerciseCategories` para as 6 novas categorias:
  - Respiracao e Relaxamento (5 exercicios)
  - Drenagem Linfatica Manual (6 exercicios)
  - Movimento Articular Suave (6 exercicios)
  - Fortalecimento Leve (6 exercicios)
  - Posicoes de Alivio de Dor (4 exercicios)
  - Caminhada e Movimento Funcional (3 exercicios)
- Substituir o array `exercises` com todos os 30 exercicios detalhados conforme o documento fornecido, incluindo steps mais detalhados, variacoes no formato "Mais facil: ... / Mais desafiador: ...", e o novo campo startPosition

### 2. Atualizar o componente ExerciseDetail (`src/components/ExerciseDetail.tsx`)
- Adicionar nova secao "Posicao Inicial" entre a secao "Sobre" e "Passo a Passo"
- Usar um icone apropriado (ex: `MapPin` ou `User`) para a secao
- Manter o mesmo estilo visual das demais secoes (card com fundo, icone, titulo)

### 3. Nao sera necessario alterar
- `ExerciseCard.tsx` -- ja exibe titulo, categoria, duracao e nivel
- `Practices.tsx` -- ja filtra por categoria/level e renderiza os cards
- Nenhum outro componente precisa mudar

## Observacao sobre Imagens
O documento menciona "gerar ilustracoes simples". Como o app usa icones Lucide (nao imagens reais), continuaremos usando icones relevantes para cada exercicio. Se desejar imagens geradas por IA no futuro, isso pode ser feito como uma melhoria separada.

