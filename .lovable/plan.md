

## Limpar logs de diagnóstico + forçar novo fingerprint

### Alterações

**1. `src/lib/profileEngine.ts`** — Remover todos os `console.log` de diagnóstico

Linhas a remover/comentar:
- L165: `console.log('🔍 parseOnboardingFromSupabase — userId:' ...)`
- L174: `console.log('🔍 parseOnboardingFromSupabase — ERRO:' ...)`
- L178: `console.log('🔍 parseOnboardingFromSupabase — Sem dados...')`
- L183-186: 4 logs de onboarding_data, objectives, pantry_items, restrictions
- L694: `console.log('🆘 Motor — Fallback...')`
- L794-810: 2 blocos de log do Motor (perfil + top 5)
- L819: `console.log('🎲 Randomização...')`
- L835-839: `console.log('🏆 Receita vencedora...')`

Total: ~20 linhas de `console.log` removidas.

**2. `src/main.tsx`** — Atualizar comentário de versão para forçar novo hash de build

```ts
// build v3 – clean logs + force deploy
```

### Resultado

Após estas mudanças, você clica em **Publish → Update** e o novo bundle será gerado com:
- Zero logs de diagnóstico no console
- Novo hash de arquivo (não mais `index-Duey2WjR.js`)
- 3 smoothies no Day5Snack (código já presente)
- Debug bar corrigida (código já presente)

### Arquivos modificados: 2
- `src/lib/profileEngine.ts` — remover ~20 linhas de console.log
- `src/main.tsx` — atualizar comentário de versão

