

## Diagnóstico do Fluxo de Cadastro

### Problema Principal Encontrado

**O trigger `handle_new_user` não existe no banco de dados.** A função `handle_new_user()` está criada, mas a seção de triggers mostra "There are no triggers in the database." Isso significa que, ao criar uma conta, **nenhum perfil é automaticamente criado** na tabela `profiles`.

### Fluxo Atual e Pontos de Falha

```text
Onboarding → localStorage → /diagnosis → /plans → /auth?mode=signup
                                                        │
                                                   signUp()
                                                        │
                                         ┌──────────────┴──────────────┐
                                         │                             │
                                   Trigger (FALTANDO!)         syncOnboardingData()
                                   Deveria criar profile       Tenta update → 0 rows
                                   mas NÃO EXECUTA             Tenta insert → pode falhar
                                                               silenciosamente
```

### Problemas Identificados

1. **Trigger ausente**: A função `handle_new_user` existe mas não está vinculada a nenhum trigger em `auth.users`. Perfis nunca são criados automaticamente no signup.

2. **Fallback frágil no `syncOnboardingData`**: O insert de fallback não verifica erros. Se falhar (ex: RLS não reconhece o usuário recém-criado), o erro é engolido silenciosamente.

3. **Sem perfil quando não há onboarding**: Se o usuário acessa `/auth?mode=signup` diretamente (sem passar pelo onboarding), `syncOnboardingData` retorna imediatamente porque `localStorage("levvia_onboarding")` é null. Nenhum perfil é criado.

4. **Possível race condition**: Após `signUp()`, a sessão do Supabase pode não estar totalmente propagada quando `syncOnboardingData` executa operações autenticadas.

### Plano de Correção

**1. Recriar o trigger `handle_new_user`**
- Migração SQL para vincular a função existente `handle_new_user()` ao evento `AFTER INSERT ON auth.users`.
- Isso garante que todo novo usuário tenha um perfil criado automaticamente.

**2. Melhorar `syncOnboardingData` no Auth.tsx**
- Adicionar `await` com verificação de erro no insert de fallback.
- Adicionar um pequeno delay ou retry para garantir que a sessão está ativa antes de operações no banco.
- Garantir que um perfil é criado mesmo sem dados de onboarding (criar perfil mínimo com nome, email e phone do formulário).

**3. Garantir criação de perfil em todos os caminhos**
- No fluxo de signup (sem onboarding), após `signUp()`, criar/atualizar o perfil com os dados do formulário (nome, email, phone) independentemente de haver dados de onboarding no localStorage.

### Arquivos Alterados
- `supabase/migrations/` -- novo arquivo SQL para criar o trigger
- `src/pages/Auth.tsx` -- corrigir `syncOnboardingData` e garantir criação de perfil

