
# Reimportar conteúdo do ebook — página temporária de update

## 1. Migração SQL
Adicionar política temporária de UPDATE público na tabela `ebook_sections`:
```sql
CREATE POLICY "Temp public update ebook_sections" ON ebook_sections FOR UPDATE USING (true) WITH CHECK (true);
```

## 2. Criar `src/pages/admin/UpdateGuia.tsx`
Página com:
- Input de upload JSON
- Ao carregar o JSON, itera sobre cada item do array
- Para cada item, executa `supabase.from('ebook_sections').update({ content: item.content }).eq('section_title', item.section_title).eq('chapter_number', item.chapter_number)`
- Exibe contador de sucesso/falha em tempo real
- Mostra resultado final (X atualizados, Y falhas)

## 3. Adicionar rota em `src/App.tsx`
```tsx
import UpdateGuia from "./pages/admin/UpdateGuia";
// Na linha 92 (antes do catch-all):
<Route path="/admin/update-guia" element={<ProtectedRoute><UpdateGuia /></ProtectedRoute>} />
```
Sem `requireAdmin` para acesso direto.

## Arquivos modificados
- Migração SQL (nova)
- `src/pages/admin/UpdateGuia.tsx` (novo)
- `src/App.tsx` (nova rota)
