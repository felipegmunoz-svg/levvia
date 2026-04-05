

# Padronizar tipo_refeicao e atualizar filtros no frontend

## Problema
Os valores de `tipo_refeicao` no banco estão inconsistentes (ex: `cafe`, `cafe_da_manha`, `almoco`, `lanche`, `jantar`). Os filtros no frontend usam essas chaves lowercase, mas o banco tem uma mistura de formatos. Precisamos padronizar no banco e ajustar o frontend para corresponder.

## 1. Executar UPDATEs no banco (via psql)
Padronizar todos os valores para formato legível em português:

```sql
UPDATE recipes SET tipo_refeicao = array_replace(tipo_refeicao, 'cafe', 'Café da Manhã') WHERE 'cafe' = ANY(tipo_refeicao);
UPDATE recipes SET tipo_refeicao = array_replace(tipo_refeicao, 'cafe_da_manha', 'Café da Manhã') WHERE 'cafe_da_manha' = ANY(tipo_refeicao);
UPDATE recipes SET tipo_refeicao = array_replace(tipo_refeicao, 'almoco', 'Almoço') WHERE 'almoco' = ANY(tipo_refeicao);
UPDATE recipes SET tipo_refeicao = array_replace(tipo_refeicao, 'jantar', 'Jantar') WHERE 'jantar' = ANY(tipo_refeicao);
UPDATE recipes SET tipo_refeicao = array_replace(tipo_refeicao, 'lanche', 'Lanche da Tarde') WHERE 'lanche' = ANY(tipo_refeicao);
UPDATE recipes SET tipo_refeicao = array_replace(tipo_refeicao, 'Lanche', 'Lanche da Tarde') WHERE 'Lanche' = ANY(tipo_refeicao);
UPDATE recipes SET tipo_refeicao = array_replace(tipo_refeicao, 'Lanche da Manhã', 'Lanche da Manhã') WHERE 'Lanche da Manhã' = ANY(tipo_refeicao);
```

Depois, verificar com:
```sql
SELECT DISTINCT unnest(tipo_refeicao) as tipo, COUNT(*) OVER (PARTITION BY unnest(tipo_refeicao)) as qtd
FROM recipes WHERE is_active = true ORDER BY tipo;
```

## 2. Atualizar filtros em `src/pages/Practices.tsx`
Ajustar as chaves do `MEAL_TYPES` para corresponder aos novos valores padronizados no banco:

```tsx
const MEAL_TYPES = [
  { key: "Café da Manhã", label: "Café da Manhã", icon: "☕" },
  { key: "Lanche da Manhã", label: "Lanche da Manhã", icon: "🍎" },
  { key: "Almoço", label: "Almoço", icon: "🍽️" },
  { key: "Lanche da Tarde", label: "Lanche da Tarde", icon: "🥤" },
  { key: "Jantar", label: "Jantar", icon: "🌙" },
];
```

Também padronizar `diet_profile` se necessário (atualmente `onivora`, `vegana`, `vegetariana` -- já estão consistentes).

## Arquivos modificados
- Banco de dados: tabela `recipes` (dados atualizados via psql)
- `src/pages/Practices.tsx` (chaves dos filtros ajustadas)

