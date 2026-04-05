

# Limpeza pós-importação

## 1. Migração SQL
Remover as duas políticas temporárias de INSERT público:
```sql
DROP POLICY "Temp public insert ebook_sections" ON ebook_sections;
DROP POLICY "Temp public insert sos_protocols" ON sos_protocols;
```

## 2. Remover `src/pages/admin/ImportGuia.tsx`
Deletar o arquivo.

## 3. `src/App.tsx`
- Remover import de `ImportGuia`
- Remover a rota `/admin/import-guia`

## 4. `src/components/AdminLayout.tsx`
- Remover o item `{ label: "Importar Guia", icon: BookOpen, path: "/admin/import-guia" }` do array `navItems`

## Arquivos modificados
- Migração SQL (nova)
- `src/pages/admin/ImportGuia.tsx` (deletado)
- `src/App.tsx`
- `src/components/AdminLayout.tsx`

