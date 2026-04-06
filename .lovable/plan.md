

# Remover "theme-light" e ajustar backgrounds para tema escuro

## Alterações

9 arquivos, apenas remoção de classe CSS e ajuste de background em 2 deles.

### Remoção simples de `theme-light` (7 arquivos)
| Arquivo | Linha | De → Para |
|---------|-------|-----------|
| `Today.tsx` | 211 | `"theme-light levvia-page"` → `"levvia-page"` |
| `Journey.tsx` | 122 | `"theme-light levvia-page min-h-screen pb-24"` → `"levvia-page min-h-screen pb-24"` |
| `Progress.tsx` | 115 | `"theme-light levvia-page min-h-screen pb-24"` → `"levvia-page min-h-screen pb-24"` |
| `Diary.tsx` | 78 | `"theme-light levvia-page min-h-screen pb-24"` → `"levvia-page min-h-screen pb-24"` |
| `Profile.tsx` | 302 | `"theme-light levvia-page min-h-screen pb-24"` → `"levvia-page min-h-screen pb-24"` |
| `Plans.tsx` | 24 | `"theme-light min-h-screen flex flex-col bg-background"` → `"min-h-screen flex flex-col bg-background"` |
| `Diagnosis.tsx` | 83 | `"theme-light min-h-screen bg-background flex flex-col"` → `"min-h-screen bg-background flex flex-col"` |

### Remoção de `theme-light` + troca de background (2 arquivos)
| Arquivo | Linha | De → Para |
|---------|-------|-----------|
| `Auth.tsx` | 111 | `"theme-light min-h-screen bg-background ..."` → `"min-h-screen bg-[#0a2540] ..."` |
| `Onboarding.tsx` | 982 | `"theme-light min-h-screen bg-background ..."` → `"min-h-screen bg-[#0a2540] ..."` |

## Nenhuma lógica alterada
Apenas classes CSS. BottomNav já está atualizado pelo sync do GitHub.

## Arquivos modificados
- `src/pages/Today.tsx`
- `src/pages/Journey.tsx`
- `src/pages/Progress.tsx`
- `src/pages/Diary.tsx`
- `src/pages/Profile.tsx`
- `src/pages/Auth.tsx`
- `src/pages/Onboarding.tsx`
- `src/pages/Plans.tsx`
- `src/pages/Diagnosis.tsx`

