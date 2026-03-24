
## Fix temporário de diagnóstico — Alert com email no Today

### O que vou alterar
**Arquivo:** `src/pages/Today.tsx`

1. **Ler também o estado de auth**
   - Trocar:
   ```ts
   const { user } = useAuth();
   ```
   - Por:
   ```ts
   const { user, loading: authLoading } = useAuth();
   ```

2. **Adicionar um `useEffect` temporário de diagnóstico**
   - Inserir logo após a lógica de `isAuthorized / isDev` um efeito que:
     - só roda se `localStorage.getItem('levvia_debug') === 'true'`
     - espera `authLoading === false`
     - mostra:
   ```ts
   alert('User Email: ' + user?.email);
   ```
   - Para evitar alert prematuro com `undefined`, o gate será baseado em `!authLoading`.

3. **Manter o diagnóstico atual no console**
   - O `console.log("Debug Check:", ...)` existente permanece, mas passa a incluir `authLoading` para cruzar com o alert.

### Implementação sugerida
```ts
const { user, loading: authLoading } = useAuth();

const DEBUG_EMAILS = ['felipegmunoz@gmail.com', 'teste_levvia_dia3_2026@gmail.com'];
const isAuthorized = !!user?.email && DEBUG_EMAILS.includes(user.email.toLowerCase());
const isDev = (import.meta.env.MODE === 'development' || localStorage.getItem('levvia_debug') === 'true') && isAuthorized;

console.log("Debug Check:", { email: user?.email, isAuthorized, isDev, authLoading });

useEffect(() => {
  if (authLoading) return;
  if (localStorage.getItem('levvia_debug') === 'true') {
    alert('User Email: ' + user?.email);
  }
}, [user?.email, authLoading]);
```

### Resultado esperado
- Quando `levvia_debug === 'true'`, o app mostra exatamente qual email está chegando no `Today.tsx`
- O alert só dispara depois que o usuário terminar de carregar
- Isso ajuda a confirmar se o problema é:
  - email diferente do esperado
  - casing do email
  - usuário ainda não carregado no momento da checagem

### Observação
Esse `alert` deve ser tratado como **temporário de debug**. Depois de validarmos o email real, o ideal é remover para não incomodar QA.

### Arquivos modificados: 1
- `src/pages/Today.tsx`
