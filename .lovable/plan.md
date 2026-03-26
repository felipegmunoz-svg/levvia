
# Correção Logo Jornada

## Arquivos

### 1. Copiar asset
`user-uploads://logo_livvia_azul.png` → `src/assets/logo_livvia_azul.png`

### 2. Modificar `src/pages/Journey.tsx`
- Adicionar import: `import logoFull from "@/assets/logo_livvia_azul.png";`
- Trocar header (linhas 78-85) para logo centralizado h-8 com `logoFull`
- Remover import do `logoIcon` (não mais usado)
