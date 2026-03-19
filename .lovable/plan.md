

# Corrigir Redirecionamento Pós-Cadastro e Checkout

## Alteração 1: `src/pages/Auth.tsx`

Linhas 142-143 e 153-155: Remover a lógica condicional que verifica `levvia_selected_plan` para redirecionar ao `/checkout`. Tanto login quanto signup devem sempre navegar para `/today`.

```typescript
// Login (linha 143): de
showSuccessAndNavigate(hasPlan ? "/checkout" : "/today", false);
// para
showSuccessAndNavigate("/today", false);

// Signup (linha 155): de
showSuccessAndNavigate(hasPlan ? "/checkout" : "/today", true);
// para
showSuccessAndNavigate("/today", true);
```

Remover as variáveis `hasPlan` (linhas 142 e 153) que ficam sem uso.

## Alteração 2: `src/pages/Checkout.tsx`

Substituir o objeto `planDetails` (linhas 8-12) pelo novo modelo de negócio e adicionar redirect se plano inválido:

```typescript
const planDetails: Record<string, { name: string; price: string; subtitle: string }> = {
  "challenge-14": {
    name: "Desafio Levvia — 14 Dias",
    price: "R$ 29,90",
    subtitle: "pagamento único · sem recorrência",
  },
};
```

- Se `levvia_selected_plan` não existir ou não for `"challenge-14"`, redirecionar para `/plans`
- No card de resumo: exibir `plan.name`, `plan.price`, `plan.subtitle`
- Remover a linha "7 dias grátis inclusos" (linhas 80-83)

### Nenhum outro arquivo alterado

