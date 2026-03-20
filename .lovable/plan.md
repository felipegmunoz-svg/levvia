

# Implementar Triplo Ajuste no Motor de Decisão

## Problema
O código atual (linhas 642-651) calcula `finalScore` com apenas 4 componentes. Os 3 novos componentes aprovados (complexityBonus, diversityScore, activityBoost) nunca foram escritos no arquivo.

## Mudança — `src/lib/profileEngine.ts` (linhas 642-651)

Expandir o `.map()` para incluir os 3 novos componentes antes do cálculo do `finalScore`:

**1. Complexity Bonus** (até 50 pts para despensas ≥10 itens):
```typescript
const ingredientCount = ((r as any).main_ingredients || []).length;
const complexityBonus = pantrySize >= 10 
  ? (Math.min(ingredientCount, 6) / 6) * 50 
  : 0;
```

**2. Diversity Score** (+15 pts por categoria nutricional detectada):
- Proteína (frango, salmão, ovo, tofu, lentilha, etc.)
- Vegetal (couve, brócolis, espinafre, cenoura, etc.)
- Gordura boa (salmão, azeite, abacate, castanhas, etc.)
- Carboidrato (arroz integral, quinoa, batata-doce, aveia)

**3. Activity Boost** (+100 pts se atividade intensa + proteína presente)

**4. Novo finalScore**:
```
finalScore = pantryScore×2 + goalOverlap×10 + inflammation×5 
           + commonWeighted×3 + complexityBonus + diversityScore + activityBoost
```

## Logs atualizados
Adicionar `complexity`, `diversity` (com categorias), e `activityBoost` nos logs do Top 5 e do vencedor.

## Após implementação
Clicar em **Publish → Update** para enviar a produção.

