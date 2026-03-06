

# Renomear LipeVida para Levvia

Substituição de textos e chaves localStorage em 8 arquivos. Nenhuma lógica alterada.

---

## 1. `index.html`
- title: `"Levvia - Bem-estar para Lipedema"`
- meta description: `"Levvia — Seu caminho para a leveza. App de bem-estar para mulheres com Lipedema."`
- meta author: `"Levvia"`
- og:title, twitter:title: `"Levvia - Bem-estar para Lipedema"`
- og:description, twitter:description: mesma description acima

## 2. `src/data/onboarding.ts`
- `"Bem-vinda ao LipeVida"` → `"Bem-vinda ao Levvia"`
- `"O LipeVida é um aplicativo..."` → `"O Levvia é um aplicativo..."`
- `"experiência no LipeVida"` → `"experiência no Levvia"`
- `"o LipeVida vai te apoiar..."` → `"o Levvia vai te apoiar..."`
- Subtitle da welcome: adicionar tagline `"Seu caminho para a leveza."`

## 3. `src/data/challengeDays.ts`
- `"O LipeVida é seu aliado..."` → `"O Levvia é seu aliado..."`
- `"o LipeVida não faz milagres..."` → `"o Levvia não faz milagres..."`

## 4. `src/pages/Profile.tsx`
- `"Membro LipeVida"` → `"Membro Levvia"`
- `"Os conteúdos do LipeVida..."` → `"Os conteúdos do Levvia..."`
- Todas as chaves localStorage: `lipevida_*` → `levvia_*`

## 5. `src/pages/Onboarding.tsx`
- `lipevida_onboarding` → `levvia_onboarding`
- `lipevida_onboarded` → `levvia_onboarded`

## 6. `src/pages/Today.tsx`
- `lipevida_onboarding` → `levvia_onboarding`
- `lipevida_challenge_start` → `levvia_challenge_start`
- `lipevida_challenge_progress` → `levvia_challenge_progress`

## 7. `src/data/mealPlan.ts`
- `lipevida_onboarding` → `levvia_onboarding`
- `lipevida_meal_plan` → `levvia_meal_plan`

## 8. `src/pages/Index.tsx`
- `lipevida_onboarded` → `levvia_onboarded`

## 9. Bloco de Migração (novo: `src/lib/migrateLegacyStorage.ts`)
Função executada uma vez no `main.tsx` que migra chaves antigas para novas:

```
const MIGRATION_MAP = {
  lipevida_onboarding → levvia_onboarding,
  lipevida_onboarded → levvia_onboarded,
  lipevida_checklist → levvia_checklist,
  lipevida_challenge_start → levvia_challenge_start,
  lipevida_challenge_progress → levvia_challenge_progress,
  lipevida_welcome_dismissed → levvia_welcome_dismissed,
  lipevida_meal_plan → levvia_meal_plan,
}
```

Para cada chave: se existe dados na chave antiga e não existe na nova, copiar e remover a antiga. Marcar migração feita com `levvia_migrated=true`.

## 10. `src/main.tsx`
- Importar e chamar `migrateLegacyStorage()` antes do `ReactDOM.createRoot`.

