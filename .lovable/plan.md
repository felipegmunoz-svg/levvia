

## Restringir Debug Bar por Email — Plano

### Mudança

**Arquivo: `src/pages/Today.tsx` (linha 100)**

Alterar de:
```ts
const isDev = import.meta.env.MODE === 'development' || localStorage.getItem('levvia_debug') === 'true';
```

Para:
```ts
const DEBUG_EMAILS = ['felipegmunoz@gmail.com', 'teste_levvia_dia3_2026@gmail.com'];
const isDev = (import.meta.env.MODE === 'development' || localStorage.getItem('levvia_debug') === 'true') && !!user?.email && DEBUG_EMAILS.includes(user.email);
```

`user` já está disponível via `useAuth()` na linha 75. Isso garante que:
- Mesmo com `levvia_debug` no localStorage, a barra só aparece para os 2 emails autorizados
- O gate de 24h permanece ativo para todos os outros usuários
- Nenhum outro arquivo precisa ser alterado

### Arquivos modificados: 1
- `src/pages/Today.tsx` — 1 linha alterada (linha 100)

