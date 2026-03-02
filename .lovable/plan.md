

# Desafio de 14 Dias -- Dashboard com Evolucao Diaria

## Resumo
Transformar o dashboard "Hoje" de um checklist estatico em um sistema de **Desafio de 14 Dias** com conteudo diario personalizado, contador de dias, barra de progresso, feedback do dia anterior e mensagens de incentivo adaptadas ao nivel de fogo interno da usuaria.

---

## Arquivos a Criar

### 1. `src/data/challengeDays.ts` -- Conteudo dos 14 dias
Estrutura de dados principal do desafio. Cada dia contera:

```text
interface ChallengeActivity {
  id: string           // ex: "day1-ex1"
  type: "exercise" | "recipe" | "habit"
  label: string        // texto exibido no checklist
  exerciseId?: number  // ID do exercicio (para navegacao)
  recipeId?: number    // ID da receita (para navegacao)
  modalContent?: string // conteudo para habitos com modal
}

interface ChallengeDay {
  day: number          // 1-14
  title: string        // ex: "Foco na Conexao e Despertar"
  objective: string    // ex: "Iniciar a jornada com consciencia..."
  phrase: string       // frase motivacional do dia
  exercises: ChallengeActivity[]
  recipes: ChallengeActivity[]
  habits: ChallengeActivity[]
}
```

Conteudo dos 14 dias conforme especificado no documento, mapeando exercicios e receitas aos IDs existentes. Para os dias 11-14 que mencionam receitas novas, serao criadas 4 receitas adicionais no arquivo de receitas.

### 2. `src/data/recipes.ts` -- Adicionar 4 receitas (dias 11-14)
Adicionar as receitas sugeridas:
- ID 9: Tigela de Graos com Vegetais Assados (Dia 11)
- ID 10: Wrap de Frango com Abacate e Rucula (Dia 12)
- ID 11: Salada de Quinoa com Grao de Bico e Ervas (Dia 13)
- ID 12: Bowl de Frutas com Iogurte Natural e Sementes (Dia 14)

---

## Arquivos a Modificar

### 3. `src/pages/Today.tsx` -- Reescrever o dashboard
Substituir o checklist estatico pelo sistema de desafio. Elementos:

**Header atualizado:**
- Contador "Dia X de 14" em destaque
- Frase motivacional do dia (do `challengeDays`)
- Barra de progresso diaria (baseada nas atividades do dia atual)

**Feedback do dia anterior (a partir do Dia 2):**
- Card verde com icone de celebracao se 100% concluido
- Card amarelo com icone de alerta se incompleto
- Texto referenciando o dia anterior

**Secoes de atividades do dia:**
- Exercicios (com links para a tela de detalhe)
- Receitas (com links para a tela de detalhe)
- Habitos (com modais informativos ou checkboxes simples)

**Mensagens de incentivo dinamicas:**
- Baseadas no progresso atual (motivacional se baixo, celebratorio se alto)

**Logica de avanco de dia:**
- Armazenar `lipevida_challenge_start` (data de inicio) no localStorage
- Armazenar `lipevida_challenge_progress` (mapa de `{ [dayNumber]: { [activityId]: boolean } }`) no localStorage
- O dia avanca automaticamente: calcula-se `Math.floor((agora - inicio) / 86400000) + 1`, limitado a 14
- Se todas atividades do dia forem concluidas, o dia tambem pode avancar

**Personalizacao por nivel de fogo (simulada):**
- Para "Dor intensa" / "Dor muito intensa": nos primeiros 3-5 dias, reordenar para mostrar exercicios de Respiracao e Drenagem primeiro; frases mais focadas em gentileza
- Para "Sem dor" / "Dor leve": progressao padrao conforme definido

### 4. `src/pages/Profile.tsx` -- Atualizar reset
- A funcao `resetOnboarding` tambem deve limpar `lipevida_challenge_start` e `lipevida_challenge_progress`
- A funcao `resetChecklist` deve limpar `lipevida_challenge_progress`
- Manter o onboarding resetavel para testes

### 5. `src/data/checklist.ts` -- Manter (sem remover)
O arquivo de checklist estatico sera mantido no projeto mas nao sera mais importado pelo Today.tsx. Pode ser util como fallback ou referencia.

---

## Logica de Persistencia (localStorage)

```text
lipevida_challenge_start    -> data ISO de quando o desafio comecou (setada apos onboarding)
lipevida_challenge_progress -> { "1": { "day1-ex1": true, "day1-hab1": true }, "2": { ... } }
```

A data de inicio e definida na primeira vez que a usuaria acessa o dashboard apos o onboarding.

---

## Detalhes Tecnicos

- Nenhuma nova dependencia necessaria
- Toda persistencia via localStorage (padrao existente)
- Componente ChecklistItemCard reutilizado para as atividades do dia
- Navegacao para exercicios/receitas mantem o padrao existente (`/practices?tab=...&highlight=...`)
- O sistema e 100% front-end/simulado conforme solicitado

