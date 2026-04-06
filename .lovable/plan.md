

# Corrigir contraste: tema escuro em todos os componentes internos

## Problema
Múltiplos componentes user-facing ainda usam classes de tema claro (`bg-white`, `border-gray-200`, `border-gray-300`, `text-gray-400`, `theme-light`) que ficam ilegíveis no fundo escuro.

## Alterações por arquivo (18 arquivos)

### Grupo 1: Remover `theme-light` (3 ocorrências)
| Arquivo | Linha | Mudança |
|---------|-------|---------|
| `DayTouchpointView.tsx` | 146 | `theme-light levvia-page` → `levvia-page` |
| `DayReview.tsx` | 180 | `theme-light levvia-page` → `levvia-page` |
| `DayReview.tsx` | 551 | `theme-light levvia-page` → `levvia-page` |

### Grupo 2: `bg-white sticky` headers → `bg-background/80 backdrop-blur-sm` (5 arquivos)
| Arquivo | Linha | Mudança |
|---------|-------|---------|
| `Day1Flow.tsx` | 249 | `border-levvia-border bg-white` → `border-white/[0.08] bg-background/80 backdrop-blur-sm` |
| `Day2Flow.tsx` | 135 | idem |
| `Day3Flow.tsx` | 81 | idem |
| `Day4Flow.tsx` | 92 | idem |
| `Day5Flow.tsx` | 101 | idem |

### Grupo 3: DiaryReflection.tsx — inputs `bg-white` e `border-gray-200`
| Linha | Mudança |
|-------|---------|
| 51 | `border-levvia-border bg-white` → `border-white/[0.1] bg-white/[0.06]` no select |
| 96 | `border-gray-200` → `border-white/[0.1]` no energy button |
| 115 | `border-levvia-border bg-white` → `border-white/[0.1] bg-white/[0.06]` no textarea |

### Grupo 4: `text-gray-400` → `text-[#7a8ba0]` (5 arquivos)
| Arquivo | Linha |
|---------|-------|
| `DayTouchpointView.tsx` | 297 |
| `MorningSlot.tsx` | 221 |
| `LunchSlot.tsx` | 172 |
| `AfternoonSlot.tsx` | 216 |
| `NightSlot.tsx` | 318 |

### Grupo 5: `border-gray-300` → `border-white/[0.12]` (2 arquivos)
| Arquivo | Linha |
|---------|-------|
| `ActivityCard.tsx` | 30 |
| `DayDashboard.tsx` | 29 |

### Grupo 6: ExerciseCard.tsx e RecipeCard.tsx
Já usam `glass-card`, `text-foreground`, `text-muted-foreground` — compatíveis com tema escuro. **Sem mudanças necessárias.**

### Grupo 7: Componentes já corrigidos anteriormente
`ChecklistItemCard.tsx`, `EditProfileDialog.tsx`, `NotificationSettings.tsx`, `PainReliefMode.tsx`, `MotorAlivio.tsx`, `ProgressDashboard.tsx`, `SymptomDiary.tsx` — já usam `bg-white/[0.08]` e `border-white/[0.12]`. **Sem mudanças necessárias.**

### Grupo 8: ExerciseDetail.tsx e RecipeDetail.tsx
Já usam `text-foreground`, `text-muted-foreground`, `bg-background`, `levvia-card`, `bg-muted`. Compatíveis com tema escuro se as variáveis CSS estiverem corretas. **Sem mudanças necessárias.**

## Resumo
- 18 edições pontuais em 10 arquivos
- Zero lógica alterada — apenas classes CSS
- Foco nos problemas reais: `bg-white` puro, `theme-light`, `border-gray-*`, `text-gray-400`

