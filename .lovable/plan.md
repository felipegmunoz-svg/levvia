

## Debug Mode via localStorage — Plano

### Situação atual
O código já tem `const isDev = import.meta.env.MODE === 'development'` que bypassa o gate de 24h, mas isso só funciona em ambiente local. Na preview/produção, `MODE === 'production'`, então QA não consegue testar.

### Mudança (1 linha)
**Arquivo: `src/pages/Today.tsx` (linha 100)**

Alterar de:
```ts
const isDev = import.meta.env.MODE === 'development';
```

Para:
```ts
const isDev = import.meta.env.MODE === 'development' || localStorage.getItem('levvia_debug') === 'true';
```

Isso é tudo. Todos os gates de 24h (Day 2–5) já usam `!isDev` como condição, então a mudança propaga automaticamente para todos os dias.

### Como usar
No console do navegador: `localStorage.setItem('levvia_debug', 'true')` e recarregar a página. Para desativar: `localStorage.removeItem('levvia_debug')`.

### Arquivos modificados: 1
- `src/pages/Today.tsx` — 1 linha alterada

