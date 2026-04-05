

# Reimportar conteúdo do ebook (rodada 2)

## 1. Migração SQL
```sql
CREATE POLICY "Temp public update ebook_sections" ON ebook_sections FOR UPDATE USING (true) WITH CHECK (true);
```

## 2. Criar `src/pages/admin/UpdateGuia.tsx`
Mesmo formato anterior: input JSON, itera array, faz `update({ content }).eq('section_title', ...).eq('chapter_number', ...)`, exibe contador sucesso/falha.

## 3. Adicionar rota em `src/App.tsx`
```tsx
import UpdateGuia from "./pages/admin/UpdateGuia";
<Route path="/admin/update-guia" element={<ProtectedRoute><UpdateGuia /></ProtectedRoute>} />
```

## Arquivos modificados
- Migração SQL (nova)
- `src/pages/admin/UpdateGuia.tsx` (novo)
- `src/App.tsx` (nova rota)

