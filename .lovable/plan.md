

## Problema Identificado

A etapa 17 (step 16) do onboarding diz "plano de 14 dias", mas a página `/plans` oferece planos mensal/trimestral/anual. Isso gera incoerencia. Alem disso, o diagnostico atual e superficial (so mostra o "Fogo Interno") e nao detalha o perfil da cliente.

## Novo Fluxo Proposto

```text
Onboarding (17 steps)
  └─ Step 16 (última): remove menção a "14 dias", texto genérico de conclusão
       ↓
  "Começar Agora" → /diagnosis (NOVA PÁGINA)
       ↓
Diagnosis Page (nova)
  - Resumo completo do perfil baseado nas respostas:
    • Nome, idade, sexo, peso/altura, IMC calculado
    • Nível de dor → "Fogo Interno" com ícone e cor
    • Áreas afetadas listadas
    • Nível de atividade física
    • Condições de saúde
    • Objetivo principal
    • Restrições alimentares
  - Texto persuasivo personalizado por nível de fogo
  - CTA "Ver Planos" → /plans
       ↓
Plans Page (existente, ajustada)
  - Remove seção de diagnóstico (que migrou para /diagnosis)
  - Mantém countdown, cards de planos, animações
  - Ao selecionar plano → /auth (cadastro simplificado)
       ↓
Auth Page (ajustada)
  - Modo signup simplificado (nome pré-preenchido do onboarding)
  - Após cadastro → /checkout (NOVA PÁGINA)
       ↓
Checkout Page (nova, mockup)
  - Resumo do plano escolhido
  - Campos de cartão mockados (visual only)
  - Botão "Confirmar Pagamento" → simula sucesso → /today
       ↓
Today (tela principal, já existente)
```

## Mudanças por Arquivo

### 1. `src/data/onboarding.ts`
- Step 16 (info): alterar texto para remover "14 dias" — dizer algo como "Análise completa! Vamos ver seu diagnóstico personalizado."

### 2. `src/pages/Onboarding.tsx`
- No `handleNext` final: redirecionar para `/diagnosis` ao invés de `/plans`

### 3. `src/pages/Diagnosis.tsx` (NOVO)
- Lê `levvia_onboarding` do localStorage
- Calcula IMC (peso/altura²)
- Mostra seções animadas com framer-motion:
  - Saudação com nome
  - Card "Fogo Interno" (nível, cor, descrição)
  - Card "Seu Perfil" (idade, sexo, IMC, atividade)
  - Card "Áreas de Atenção" (áreas afetadas, condições)
  - Card "Seu Objetivo" (objetivo principal)
  - Texto persuasivo personalizado pelo nível de fogo, explicando como o Levvia vai ajudar
- CTA "Ver Planos Disponíveis" → `/plans`

### 4. `src/pages/Plans.tsx`
- Remover seção de diagnóstico/fogo interno do topo (já está na página de diagnóstico)
- Manter countdown, cards de planos, animações
- Ao selecionar plano: salvar em localStorage e ir para `/auth`

### 5. `src/pages/Auth.tsx`
- Pré-preencher nome do onboarding no signup
- Após signup com sucesso: redirecionar para `/checkout` (se tem plano selecionado) ao invés de `/today`

### 6. `src/pages/Checkout.tsx` (NOVO, mockup)
- Lê plano selecionado do localStorage
- Mostra resumo (nome do plano, preço, período)
- Formulário mockado: número do cartão, validade, CVV, nome no cartão
- Botão "Confirmar Pagamento" com loading fake de 2s → toast de sucesso → navigate `/today`

### 7. `src/App.tsx`
- Adicionar rotas: `/diagnosis`, `/checkout`

### 8. `src/pages/Index.tsx`
- Ajustar fluxo: usuário onboarded mas não logado → `/diagnosis` (ao invés de `/plans`)

## Resultado
Fluxo coerente: Onboarding → Diagnóstico detalhado (convence) → Planos (escolhe) → Cadastro → Pagamento (mockup) → App principal.

