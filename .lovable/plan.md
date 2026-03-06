

# Corrigir Nomenclatura dos Perfis "Fogo Interno"

Apenas 2 arquivos precisam de alteração:

## `src/data/onboarding.ts`
- Linha 160: `"Chamas Suaves"` → `"Chamas Moderadas"`
- Linha 168: `"Chamas Moderadas"` → `"Incêndio Crescente"`
- Linha 176: `"Chamas Intensas"` → `"Fogo Ardente"`
- Linha 184: `"Chamas Intensas"` → `"Fogo Ardente"`

**Importante**: as substituições devem ser feitas simultaneamente para evitar conflitos (ex: "Chamas Suaves" → "Chamas Moderadas" não deve ser depois sobrescrito por "Chamas Moderadas" → "Incêndio Crescente").

## `src/data/motivational.ts`
- Linha 30: `"chamas suaves"` → `"chamas moderadas"` (texto motivacional)
- Linha 44: `"chamas moderadas"` → `"o incêndio crescente"` (texto motivacional)

Nenhuma lógica será alterada, apenas strings de texto.

