
# Debug Review Mode — Adicionar 4 Logs

## Objetivo
Inserir logs mínimos para confirmar:
- se `?review=N` está chegando em `Today.tsx`
- se o branch de review está sendo executado
- se `Day1Flow` está recebendo `isReviewMode={true}`
- se `Day1Flow` realmente entra no bloco de review

## Arquivos a alterar

### 1. `src/pages/Today.tsx`
Adicionar 2 logs:

**Após linha 82** (logo após `const reviewDay = ...`)
```tsx
console.log("DEBUG reviewDay:", reviewDay);
```

**Dentro do bloco `else if (reviewDay)`** (antes de `const goBack = ...`)
```tsx
console.log("DEBUG REVIEW MODE ATIVADO, dia:", reviewDay);
```

### 2. `src/components/journey/Day1Flow.tsx`
Adicionar 2 logs:

**No início do componente**, logo após a declaração:
```tsx
console.log("DEBUG Day1Flow isReviewMode:", isReviewMode);
```

**No início do bloco `if (isReviewMode)`**, antes do `if (loading)`:
```tsx
console.log("DEBUG Day1Flow ENTRANDO REVIEW MODE");
```

## Resultado esperado
Com esses 4 logs, ficará claro onde a falha está:
- se o parâmetro `review` não está chegando
- se `Today.tsx` não está entrando no branch de review
- se `Day1Flow` recebe `false` em vez de `true`
- ou se entra no componente mas não passa pelo bloco de review

## Impacto
- Mudança apenas de debug
- Sem alterar fluxo, layout ou persistência
- Apenas 2 arquivos
