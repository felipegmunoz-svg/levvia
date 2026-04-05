

# Desbloquear acesso à página de importação

## 1. Remover `requireAdmin` da rota em `src/App.tsx` (linha 86)

Alterar de:
```tsx
<Route path="/admin/import-guia" element={<ProtectedRoute requireAdmin><ImportGuia /></ProtectedRoute>} />
```
Para:
```tsx
<Route path="/admin/import-guia" element={<ProtectedRoute><ImportGuia /></ProtectedRoute>} />
```

## 2. Inserir role admin para felipegmunoz@gmail.com

O usuário não tem registro na tabela `user_roles`. Executar INSERT via ferramenta de inserção para adicionar a role `admin`.

## Arquivos modificados
- `src/App.tsx` (linha 86)
- Tabela `user_roles` (inserção de dados)

