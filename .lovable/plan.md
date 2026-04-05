

# Classificar receitas e corrigir erro de build

## 1. Executar UPDATEs no banco
Classificar as 46 receitas sem tipo_refeicao + desativar 1 cabeçalho, conforme SQL fornecido.

## 2. Corrigir erro de build em `src/pages/Practices.tsx`
Linha 197 referencia `allExerciseTags` que não existe. Remover a linha:
```tsx
const currentTags = allExerciseTags;  // linha 197 — remover
```
Esta variável `currentTags` não é usada em nenhum lugar do JSX.

## Arquivos modificados
- Tabela `recipes` (dados atualizados via insert tool)
- `src/pages/Practices.tsx` (remover referência a variável inexistente)

