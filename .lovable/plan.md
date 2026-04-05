

# Limpeza pós-atualização do Guia

## 1. Migração SQL
```sql
DROP POLICY "Temp public update ebook_sections" ON ebook_sections;
```

## 2. `src/App.tsx`
- Remover `import UpdateGuia from "./pages/admin/UpdateGuia";`
- Remover `<Route path="/admin/update-guia" ...>`

## 3. Deletar `src/pages/admin/UpdateGuia.tsx`

## Arquivos modificados
- Migração SQL (nova)
- `src/App.tsx`
- `src/pages/admin/UpdateGuia.tsx` (deletado)

