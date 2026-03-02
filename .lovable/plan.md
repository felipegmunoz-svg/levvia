
# Sistema de Cardapio Personalizado com 100 Receitas

## Resumo
Implementar um sistema completo de cardapio diario personalizado com 100 receitas anti-inflamatorias, novas telas de onboarding para restricoes alimentares, e logica de filtragem para montar 5 refeicoes por dia durante os 14 dias do desafio.

**Dado o tamanho deste trabalho (100 receitas + logica de filtragem + onboarding + dashboard), recomenda-se dividir em 3 etapas de implementacao.**

---

## Etapa 1: Novas Telas de Onboarding

### `src/data/onboarding.ts`
Adicionar 2 novas telas ao fluxo de onboarding (antes da tela final "Pronto para Comecar"):

- **Tela "Restricoes Alimentares"** (id 10, type "multi"):
  - Opcoes: Vegetariano, Vegano, Sem Gluten, Sem Lactose, Alergia a Frutos do Mar, Alergia a Amendoim, Alergia a Oleaginosas, Outra (campo de texto livre)

- **Tela "Preferencias Alimentares"** (id 11, type "multi"):
  - Opcoes: Nao gosto de coentro, Nao gosto de pimenta, Prefiro refeicoes rapidas, Prefiro refeicoes com poucos ingredientes, Outra (campo de texto livre)
  - Marcar como opcional (pode pular sem selecionar nada)

### `src/pages/Onboarding.tsx`
- Ajustar `canProceed` para permitir avancar na tela de preferencias sem selecionar nada (opcional)
- Adicionar campo de texto livre para opcao "Outra" em ambas as telas
- As respostas serao salvas no mesmo objeto `lipevida_onboarding` do localStorage

---

## Etapa 2: Banco de 100 Receitas

### `src/data/recipes.ts` -- Reescrever completamente
Substituir as 12 receitas atuais por 100 receitas com a nova estrutura:

```text
interface Recipe {
  id: number;
  title: string;
  tipo_refeicao: string[];      // ["Cafe da Manha", "Lanche da Manha", ...]
  tags: string[];                // ["Vegano", "Sem Gluten", "Anti-inflamatorio", ...]
  ingredients: string[];
  instructions: string[];
  por_que_resfria: string;
  dica: string;
  // Campos mantidos para compatibilidade:
  category: string;              // Categoria principal derivada de tipo_refeicao
  time: string;                  // Estimativa de preparo
  servings: string;
  description: string;           // = por_que_resfria
  icon: string;
}
```

Distribuicao das 100 receitas por tipo:
- Cafe da Manha: 28 receitas (1-28)
- Almoco/Jantar: 44 receitas (29-72)
- Lanches: 20 receitas (73-92)
- Bebidas: 2 receitas (93-94)
- Lanches/Sobremesas: 6 receitas (95-100)

Muitas receitas possuem multiplos tipos de refeicao (ex: "Cafe da Manha, Lanche da Manha, Lanche da Tarde"), o que aumenta a cobertura.

---

## Etapa 3: Sistema de Cardapio Diario (5 Refeicoes)

### `src/data/mealPlan.ts` -- Novo arquivo
Logica de geracao do cardapio personalizado:

1. **Filtragem por restricoes**: Remover receitas que violem restricoes selecionadas no onboarding
   - "Vegetariano" -> excluir receitas sem tag "Vegetariano" ou "Vegano"
   - "Vegano" -> excluir receitas sem tag "Vegano"
   - "Sem Gluten" -> excluir receitas sem tag "Sem Gluten"
   - "Sem Lactose" -> excluir receitas sem tag "Sem Lactose"
   - "Alergia a Frutos do Mar" -> excluir receitas com peixes/frutos do mar nos ingredientes
   - "Alergia a Amendoim" -> excluir receitas com amendoim nos ingredientes
   - "Alergia a Oleaginosas" -> excluir receitas com nozes/castanhas/amendoas nos ingredientes

2. **Distribuicao por refeicao**: Para cada dia, selecionar 1 receita por slot:
   - Cafe da Manha: receitas com tipo "Cafe da Manha"
   - Lanche da Manha: receitas com tipo "Lanche da Manha" ou "Lanche"
   - Almoco: receitas com tipo "Almoco"
   - Lanche da Tarde: receitas com tipo "Lanche da Tarde" ou "Lanche"
   - Jantar: receitas com tipo "Jantar"

3. **Minimizar repeticoes**: Usar um algoritmo de distribuicao sequencial (round-robin) pelas receitas disponiveis para cada tipo, garantindo variedade ao longo dos 14 dias

4. **Fallback**: Se nao houver receitas suficientes para algum slot, exibir mensagem "Beba bastante agua e chas anti-inflamatorios"

### `src/data/challengeDays.ts` -- Atualizar
- Remover a propriedade `recipes` fixa (1 receita por dia)
- As receitas agora vem do sistema de cardapio dinamico

### `src/pages/Today.tsx` -- Atualizar dashboard
Substituir a secao "Receitas Sugeridas" (1 receita) por 5 secoes de refeicao:

```text
Cardapio do Dia
  Cafe da Manha: [receita filtrada]
  Lanche da Manha: [receita filtrada]
  Almoco: [receita filtrada]
  Lanche da Tarde: [receita filtrada]
  Jantar: [receita filtrada]
```

Cada refeicao sera um item clicavel (abre RecipeDetail) com botao "Marcar como Feito", mantendo a mesma logica de overlay ja implementada.

### `src/components/RecipeDetail.tsx` -- Atualizar
Adicionar campos novos ao detalhe da receita:
- "Por que Resfria" (secao explicativa)
- "Dica" (secao com dica pratica)

---

## Armazenamento (localStorage)

Chaves existentes mantidas:
- `lipevida_onboarding` -> inclui agora campos 10 (restricoes) e 11 (preferencias)
- `lipevida_challenge_progress` -> o mapa de progresso agora inclui IDs das 5 refeicoes por dia
- `lipevida_challenge_start` -> sem alteracao

Nova chave:
- `lipevida_meal_plan` -> cardapio gerado para os 14 dias (cache para evitar recalculo)

---

## Impacto e Compatibilidade

- As 12 receitas atuais serao substituidas pelas 100 novas. Algumas receitas similares existem (ex: Sopa de Abobora com Gengibre), entao os IDs dos challengeDays que referenciam receitas antigas precisarao ser atualizados
- O RecipeDetail existente sera atualizado para mostrar os novos campos
- O fluxo de exercicios e habitos no dashboard nao sera afetado
- O onboarding existente sera estendido (nao substituido)

---

## Detalhes Tecnicos

- Nenhuma nova dependencia necessaria
- Toda logica e front-end/localStorage
- As 100 receitas serao um arquivo de dados grande (~2000+ linhas), dividido em secoes com comentarios para organizacao
- A logica de filtragem sera um modulo separado (`mealPlan.ts`) para manter o codigo organizado
