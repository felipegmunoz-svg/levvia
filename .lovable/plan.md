

# Criar tabelas do Guia + página de importação admin

## 1. Migração SQL

Criar 3 tabelas (`ebook_chapters`, `ebook_sections`, `sos_protocols`) com índices, RLS e políticas de leitura pública. Inserir os 13 capítulos. Adicionar políticas temporárias de INSERT público em `ebook_sections` e `sos_protocols` para importação.

A migração inclui exatamente o SQL fornecido, mais:
```sql
CREATE POLICY "Temp public insert ebook_sections" ON ebook_sections FOR INSERT WITH CHECK (true);
CREATE POLICY "Temp public insert sos_protocols" ON sos_protocols FOR INSERT WITH CHECK (true);
```

## 2. Nova página `src/pages/admin/ImportGuia.tsx`

- Usa `AdminLayout`
- 2 seções com file input (JSON) + botão de importação
- **Importar Seções do Ebook**: lê JSON array, para cada item faz lookup do `chapter_id` via `chapter_number` na tabela `ebook_chapters`, depois insere em `ebook_sections`
- **Importar Protocolos SOS**: lê JSON array, insere diretamente em `sos_protocols`
- Mostra barra de progresso e resultado (sucesso/erro count)

## 3. Rota em `src/App.tsx`

Adicionar:
```tsx
import ImportGuia from "./pages/admin/ImportGuia";
// ...
<Route path="/admin/import-guia" element={<ProtectedRoute requireAdmin><ImportGuia /></ProtectedRoute>} />
```

## 4. Link no `AdminLayout.tsx`

Adicionar item temporário na sidebar:
```tsx
{ label: "Importar Guia", icon: BookOpen, path: "/admin/import-guia" }
```

## Arquivos modificados
- Migração SQL (nova)
- `src/pages/admin/ImportGuia.tsx` (novo)
- `src/App.tsx`
- `src/components/AdminLayout.tsx`

