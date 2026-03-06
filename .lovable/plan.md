

# Melhorar instruções iOS no InstallPWAPrompt

Arquivo único: `src/components/InstallPWAPrompt.tsx`

## Alterações

1. **Imports**: Adicionar `PlusSquare`, `CheckCircle` do lucide-react

2. **Steps iOS** (linhas 12-15): Substituir os 3 passos por objetos com `icon`, `title`, `description`:
   - Step 1: `Share` → "Toque nos 3 pontinhos" / "No Safari, toque no ícone ••• no canto inferior direito da tela"
   - Step 2: `PlusSquare` → "Toque em 'Tela de Início'" / "Role a lista para baixo e toque em 'Adicionar à Tela de Início'"
   - Step 3: `CheckCircle` → "Toque em 'Adicionar'" / "Confirme no canto superior direito e o Levvia aparece na sua tela inicial"

3. **Steps Android**: Manter iguais mas adaptar estrutura para incluir `title`/`description` (consistência)

4. **Nota Safari**: Adicionar `<p>` com aviso "⚠️ Funciona apenas no Safari..." acima dos passos, condicionalmente apenas no iOS

5. **Renderização**: Atualizar o map para mostrar `title` em `font-medium text-sm` e `description` em `text-xs text-muted-foreground` abaixo

