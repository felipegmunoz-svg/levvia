

# Reestruturação da Navegação — Menu 3 Abas + Histórico + Cards de Referência

## Resumo

Substituir o menu de 4 abas por 3 abas (Hoje, Histórico, Perfil), criar a nova página Histórico com sub-rotas, e adicionar dois cards de referência rápida no topo do `/today`.

## Alterações

### 1. Atualizar BottomNav — 3 abas

**Arquivo:** `src/components/BottomNav.tsx`

- Remover abas "Práticas" (`/practices`) e "Aprender" (`/learn`)
- Adicionar aba "Histórico" (`/history`) com ícone `BookOpen`
- Ordem: Hoje (Home) → Histórico (BookOpen) → Perfil (User)
- Manter estilo visual existente (glassmorphism, tema escuro)

### 2. Criar página Histórico

**Arquivo:** `src/pages/History.tsx`

- 3 cards grandes empilhados: Receitas (🍃), Exercícios (🌊), Conhecimento (📚)
- Subtítulo dinâmico: "X itens desbloqueados" baseado nos dias completados do challenge (lidos via `useChallengeData`)
- Ao tocar: navega para sub-rotas `/history/recipes`, `/history/exercises`, `/history/knowledge`
- Estilo glass card consistente com o app

### 3. Criar sub-páginas do Histórico

**Arquivos:** `src/pages/HistoryRecipes.tsx`, `src/pages/HistoryExercises.tsx`, `src/pages/HistoryKnowledge.tsx`

- Lista de cards com: nome do item, "Dia X da jornada", ícone/imagem
- Ao tocar: abre conteúdo completo (reutiliza `ExerciseDetail`, `RecipeDetail` existentes)
- Items desbloqueados = items dos dias já completados (dia ≤ currentDay com progresso)
- Estado vazio: mensagem orientando a completar dias da jornada
- Dados carregados via `useChallengeData` / `profileEngine` (mesma lógica do Today)

### 4. Adicionar Cards de Referência Rápida no /today

**Arquivo:** `src/pages/Today.tsx`

Inserir acima do conteúdo atual dois cards lado a lado:

**Card 1 — "Seu Fogo Interno" (Mapa de Calor):**
- Glass card com miniatura visual das áreas afetadas (baseado em `profile.affectedAreas` e `profile.painLevel`)
- Label + subtítulo com nome do perfil de dor
- Ao tocar: abre modal com mapa completo e opção de atualizar intensidade

**Card 2 — "Seu Semáforo" (Semáforo Alimentar):**
- Glass card com 3 barras coloridas (verde/amarelo/vermelho) com amostra de alimentos
- Dados derivados de `profile.antiInflammatoryAllies` (verde), `profile.dietaryPreferences` (amarelo), `profile.inflammatoryEnemies` (vermelho)
- Ao tocar: abre modal com semáforo completo personalizado

**Componentes auxiliares:** `src/components/HeatMapCard.tsx`, `src/components/FoodTrafficLightCard.tsx`, e modais correspondentes

### 5. Registrar novas rotas

**Arquivo:** `src/App.tsx`

- Adicionar rotas: `/history`, `/history/recipes`, `/history/exercises`, `/history/knowledge` (todas protegidas com `ProtectedRoute`)
- Manter `/practices` e `/learn` acessíveis via URL direta

### 6. Remover lógica de trial no BottomNav

O `useTrialStatus` que oculta o menu durante o trial deve ser removido do BottomNav, pois o menu agora é **sempre visível** em todas as fases.

## O que NÃO será alterado

- Autenticação, assinaturas, checkout
- Onboarding, diagnosis, admin
- Checklist/rotinas do /today (parte inferior)
- Conteúdo das rotas /practices e /learn
- Qualquer lógica de Supabase existente

## Detalhes Técnicos

- Os dados de "dias completados" vêm de `challengeProgress` (objeto com keys por dia, cada uma com atividades marcadas)
- Para o Histórico, itens de um dia são considerados "desbloqueados" se o dia foi alcançado (currentDay ≥ dia) ou se há progresso registrado
- Os módulos de conhecimento (Learn) serão consultados via `supabase.from("learn_modules")` para listar pílulas por dia
- Mapa de Calor: representação visual simples usando divs posicionadas com cores baseadas na intensidade de dor por área
- Semáforo: listas derivadas do perfil da usuária (já disponíveis em `UserProfile`)

