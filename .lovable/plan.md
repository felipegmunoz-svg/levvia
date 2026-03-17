

# Plano de Melhorias — Baseado no Relatório de Produto Levvia

O documento identifica funcionalidades faltantes e oportunidades. Abaixo está o plano priorizado de implementação, seguindo a ordem de criticidade do relatório.

---

## Fase 1 — Obrigatório para Lançamento (Semana 1)

### 1.1 Aba "Aprender" — Módulos Educativos

**O que**: Nova aba na navegação inferior com 7 módulos educativos desbloqueados progressivamente (1 por dia do desafio).

**Implementação**:
- Criar tabela `learn_modules` no banco (id, day, title, subtitle, content_paragraphs, surprising_fact, practical_tip, reflection_question, icon, sort_order, is_active)
- Criar tabela `user_module_progress` (user_id, module_id, completed_at) para rastrear desbloqueio
- Nova página `src/pages/Learn.tsx` com lista de módulos (bloqueados/desbloqueados baseado no dia do desafio)
- Componente `ModuleDetail` com layout: título metafórico → parágrafos → fato surpreendente → dica prática → pergunta reflexiva
- Adicionar aba "Aprender" ao `BottomNav` (ícone `GraduationCap` ou `BookOpen` — mover Práticas para outro ícone)
- Rota `/learn` protegida no `App.tsx`
- Seed dos 7 módulos da Semana 1 via migration SQL

### 1.2 Diário de Sintomas

**O que**: Registro diário de dor, inchaço, humor e nota livre, com histórico.

**Implementação**:
- Criar tabela `symptom_entries` (id, user_id, date, pain_level integer 0-10, swelling text, mood text, notes text, created_at)
- RLS: usuário lê/escreve apenas seus registros; admin lê todos
- Nova página `src/pages/Tools.tsx` ou seção dentro de `/today`
- Componente `SymptomDiary`: slider de dor (0-10), toggle inchaço (Leve/Moderado/Intenso), emoji selector de humor (5 opções), textarea opcional
- Salvar 1 entrada por dia (upsert por user_id + date)
- Exibir histórico dos últimos 14 dias em lista simples

---

## Fase 2 — Alta Prioridade (Semana 2)

### 2.1 Modo "Estou com Dor Agora"

**O que**: Botão de acesso rápido na aba Hoje que redireciona para conteúdo de alívio imediato.

**Implementação**:
- Integrar conteúdo da `/diagnosis` (posições de alívio, exercícios adaptados) como seção na aba Práticas ou modal dedicado
- Adicionar botão destacado na aba Hoje: "Estou com dor agora" com ícone de coração/alerta
- Filtrar exercícios por categoria "Alívio" ou nível "Fácil" + sugerir chá anti-inflamatório baseado nos aliados do onboarding

### 2.2 Gráfico de Evolução 14 Dias

**O que**: Visualização dos dados do diário de sintomas ao longo do desafio.

**Implementação**:
- Instalar/usar biblioteca de gráficos (recharts já disponível via shadcn/chart)
- Componente `EvolutionChart` com:
  - Gráfico de linha: dor ao longo dos dias
  - Gráfico de barras: dias com checklist completo vs incompleto
  - Resumo: "Você reduziu sua dor em X pontos"
- Exibir no `ProgressDashboard` ou nova seção na aba Perfil/Ferramentas

### 2.3 Notificações Push Inteligentes

**O que**: Ativar notificações automáticas (já existe infraestrutura parcial).

**Implementação**:
- A infraestrutura de push já existe (`push_subscriptions`, `sw-push.js`, edge function)
- Adicionar configuração de horário preferido no perfil da usuária
- Criar edge function de cron ou lógica no admin para disparar notificações por tipo (lembrete diário, motivacional após 2 dias sem uso, conquista desbloqueada)

---

## Fase 3 — Média Prioridade (Mês 2)

### 3.1 Compartilhamento de Conquistas

- Gerar card visual (canvas/SVG) com badge + nome + dado de progresso
- Botão "Compartilhar" no modal de conquista usando Web Share API

### 3.2 Diário de Fotos

- Criar tabela `photo_diary` (id, user_id, day, image_url, created_at)
- Upload via storage bucket existente (`content-images`)
- Solicitação de foto nos dias 1, 7 e 14
- Comparativo lado a lado

---

## Fase 4 — Pós-Lançamento (Mês 3)

### 4.1 Comunidade
- Feed de depoimentos anônimos
- Contador coletivo de desafio
- Escopo maior — planejamento separado

---

## Navegação Atualizada

O `BottomNav` passará de 3 para 4 abas:

```text
  Hoje  |  Práticas  |  Aprender  |  Perfil
   🏠        💪          📚          👤
```

---

## Tabelas a Criar

| Tabela | Colunas principais | RLS |
|---|---|---|
| `learn_modules` | id, day, title, content, fact, tip, question | Public read (active), admin manage |
| `user_module_progress` | user_id, module_id, completed_at | User own, admin read all |
| `symptom_entries` | user_id, date, pain_level, swelling, mood, notes | User own, admin read all |
| `photo_diary` | user_id, day, image_url | User own, admin read all |

---

## Resumo de Prioridade

1. **Aba Aprender** — Obrigatório. Transforma o app de "tracker" em "plataforma educativa"
2. **Diário de Sintomas** — Obrigatório. Permite percepção de melhora = retenção
3. **Modo "Estou com Dor"** — Alta. Diferencial único no mercado
4. **Gráficos de Evolução** — Alta. Argumento de conversão premium
5. **Push Inteligentes** — Alta. Motor de retenção
6. **Compartilhamento** — Média. Crescimento orgânico
7. **Diário de Fotos** — Média. Prova visual

Recomendo implementar na ordem: Fase 1 primeiro (Aprender + Diário de Sintomas), depois Fase 2.

