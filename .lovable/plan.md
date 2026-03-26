
## Diagnóstico

O ajuste que você pediu em `Today.tsx` já está aplicado no código atual.

### Evidência encontrada
- `src/pages/Today.tsx` linhas 317–325:
```tsx
else if (reviewDay) {
  console.log("DEBUG REVIEW MODE ATIVADO, dia:", reviewDay);
  const goBack = () => navTo("/journey");
  if (reviewDay === 1) content = <Day1Flow onComplete={goBack} isReviewMode={true} />;
  else if (reviewDay === 2) content = <Day2Flow onComplete={goBack} isReviewMode={true} />;
  else if (reviewDay === 3) content = <Day3Flow onComplete={goBack} isReviewMode={true} />;
  else if (reviewDay === 4) content = <Day4Flow onComplete={goBack} isReviewMode={true} />;
  else if (reviewDay === 5) content = <Day5Flow onComplete={goBack} isReviewMode={true} />;
  else if (reviewDay === 6) content = <Day6Flow onComplete={goBack} isReviewMode={true} />;
}
```

- `src/components/journey/Day1Flow.tsx`:
  - recebe `isReviewMode?: boolean`
  - usa default `isReviewMode = false`
  - tem bloco `if (isReviewMode)` com layout claro e read-only

- `src/pages/Journey.tsx`:
```tsx
navigate(`/today?review=${day}`);
```

- `src/components/ProtectedRoute.tsx` não remove query params.
- O app registra PWA/service worker:
  - `src/main.tsx`: `registerSW({ immediate: true })`
  - `vite.config.ts`: `VitePWA({ registerType: "autoUpdate", ... })`

## Causa raiz mais provável

O problema não é mais “faltou passar `isReviewMode`”. No código atual, essa prop já está sendo passada corretamente.

A causa mais provável é cache de bundle/service worker: a usuária está vendo uma versão antiga do app, onde os flows ainda abriam no modo normal.

## O que corrigir

### 1. Forçar atualização real do frontend
Aplicar uma correção de cache-busting para garantir que preview/publicado carreguem o bundle novo:
- atualizar marcador de build em `src/main.tsx` e/ou `src/App.tsx`
- revisar estratégia de registro do service worker para não atrapalhar preview
- manter PWA, mas evitar que versão antiga continue servindo `/today`

### 2. Remover logs temporários
Depois da correção de cache:
- remover os 2 logs de `Today.tsx`
- remover os 2 logs de `Day1Flow.tsx`

### 3. Validar review mode ponta a ponta
Testar `/journey` → clicar “Rever” nos dias 1–6 e confirmar:
- fundo claro
- logo azul no topo
- conteúdo em scroll vertical
- sem step-by-step
- sem salvar
- botão “Voltar para Jornada”
- Dia 6 via `DayTemplate` também em review

## Arquivos a ajustar
- `src/main.tsx`
- `src/App.tsx`
- possivelmente `vite.config.ts` se precisar endurecer invalidação de cache no PWA
- `src/pages/Today.tsx` (limpar logs)
- `src/components/journey/Day1Flow.tsx` (limpar logs)

## Resultado esperado
Sem mexer na lógica dos dias, o review mode volta a funcionar porque a aplicação finalmente passa a servir a versão atual do código, que já contém `isReviewMode={true}` para os dias 1–6.
