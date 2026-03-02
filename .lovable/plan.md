

# Corrigir Fluxo de Exercicios e Receitas no Dashboard

## Problemas Identificados

1. **Exercicios e receitas nao sao marcados como feitos** -- ao clicar, o progresso e salvo silenciosamente mas a usuaria nao tem controle; ao voltar, o check nao aparece de forma intuitiva
2. **Voltar vai para Praticas, nao para o Dashboard** -- o clique navega para `/practices?tab=...`, e o botao "voltar" do detalhe apenas fecha o detalhe dentro de Praticas, nunca retorna ao `/today`
3. **Nao ha botao "Feito"** -- nas telas de detalhe de exercicio/receita nao existe um botao explicito para marcar a atividade como concluida

## Solucao

Em vez de navegar para a pagina `/practices`, abrir o detalhe do exercicio/receita **dentro da propria pagina Today**, com um botao "Marcar como Feito" que salva o progresso e volta ao dashboard.

---

## Mudancas

### 1. `src/pages/Today.tsx`
- Remover a navegacao para `/practices?tab=...&highlight=...`
- Adicionar estados locais `selectedExercise` e `selectedRecipe` para abrir o detalhe inline
- Ao clicar num exercicio: buscar o exercicio pelo `exerciseId` nos dados e mostrar o componente `ExerciseDetail` dentro do Today (sem mudar de rota)
- Ao clicar numa receita: buscar a receita pelo `recipeId` e mostrar `RecipeDetail` dentro do Today
- Passar uma prop `onMarkDone` para os componentes de detalhe, que ao ser chamada marca o progresso e fecha o detalhe
- O botao "voltar" dos detalhes fechara o detalhe e voltara ao dashboard (mesmo componente, sem navegacao)

### 2. `src/components/ExerciseDetail.tsx`
- Adicionar prop opcional `onMarkDone?: () => void`
- Quando `onMarkDone` estiver presente, exibir um botao fixo no rodape: "Marcar como Feito" (estilo gradient-primary)
- O botao `voltar` continuara chamando `onBack` (que no contexto do Today fechara o detalhe)

### 3. `src/components/RecipeDetail.tsx`
- Mesma logica: adicionar prop `onMarkDone?: () => void`
- Exibir botao "Marcar como Feito" no rodape quando a prop estiver presente
- O botao `voltar` chamara `onBack`

### 4. `src/components/ChecklistItemCard.tsx`
- Para exercicios e receitas ja marcados como feitos, permitir toggle (desmarcar) normalmente sem abrir o detalhe
- Para nao-marcados, o clique abrira o detalhe (comportamento controlado pelo Today)

## Resultado Esperado
- Clicar em exercicio/receita no dashboard abre o detalhe **sem sair do /today**
- Botao "Marcar como Feito" aparece no detalhe, marcando o progresso e voltando ao dashboard
- Botao voltar sempre retorna ao dashboard
- Habitos continuam funcionando como antes (toggle direto com modal)

