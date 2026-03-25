

## Diagnóstico: Gate está correto, problema é bundle desatualizado

### Evidências

1. **Banco de dados** confirma: `day5_completed=true`, `has_premium=true`, `day5_completed_at` presente
2. **Código fonte** confirma: gate `day5Done === true && hasPremium` existe na linha 343 do Today.tsx
3. **Lógica está correta**: a cadeia de `else if` funciona — com day1-5 todos `true` e `hasPremium=true`, a linha 343 é alcançada e mostra "Dia 6 em breve"

### Causa raiz

O bundle servido (`index-Duey2WjR.js`) **não contém** o gate da linha 343 porque foi compilado ANTES dessa mudança ser adicionada. É o mesmo problema de stale bundle que já identificamos.

O fato de o app mostrar "Dia 4 de 14" confirma: sem o gate, o código cai no fallback do dashboard (que usa `currentDay` calculado por data — que dá 4 baseado no `challenge_start`).

### O que fazer

Não há bug no código. A solução é garantir que o bundle seja republicado:

1. **Clique em Publish → Update** no painel do Lovable
2. **Aguarde o deploy completar** (verifique se o hash do JS muda no Network tab)
3. **Teste em modo incógnito** para garantir cache zero

### Como validar que o novo bundle carregou

No DevTools → Network → filtrar por `.js`:
- Se o nome do arquivo JS principal mudou (não é mais `index-Duey2WjR.js`), o deploy funcionou
- Se continua o mesmo nome, o deploy não propagou

### Nota importante

Se após Publish → Update o bundle continuar o mesmo, o problema é na pipeline de deploy/CDN do Lovable, e não no código. Nesse caso, a alternativa seria fazer uma mudança mais significativa em um arquivo core (como `App.tsx`) para forçar invalidação.

### Arquivos a modificar: 0

Nenhuma mudança de código necessária — o gate já está implementado corretamente.

