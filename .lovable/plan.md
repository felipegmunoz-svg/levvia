

# Fix: Card "Seu Fogo Interno" — mostrar áreas do heat_map_day1

## Problema
O `HeatMapCard` usa `profile.affectedAreas` e `profile.painLevel` (onboarding antigo) mas os dados reais estão em `heat_map_day1` no banco — JSON como `{"abdomen": 2, "coxa_esq": 1}`. O card nunca lê esse campo.

## Solução

### 1. Adicionar `heatMapDay1` ao `UserProfile` (`src/lib/profileEngine.ts`)
- Novo campo: `heatMapDay1: Record<string, number>`
- Em `parseOnboardingFromSupabase`: adicionar `heat_map_day1` ao SELECT e mapear
- Em `defaultProfile` e `parseOnboardingFromLocal`: default `{}`

### 2. Reescrever `HeatMapCard` (`src/components/HeatMapCard.tsx`)
- Ler `profile.heatMapDay1` em vez de `profile.affectedAreas`
- Usar o mesmo SVG do `HeatMapInteractive.tsx` (mesmos paths)
- Cores por intensidade:
  - 0: transparente
  - 1: `rgba(244,165,53,0.4)` (laranja claro)
  - 2: `rgba(244,165,53,0.75)` (laranja médio)
  - 3: `rgba(198,40,40,0.85)` (vermelho)

**Perfil de Fogo** — soma das intensidades:
- 0-4: "Brisa Leve"
- 5-9: "Chamas Moderadas"
- 10-14: "Incêndio Crescente"
- 15-18: "Fogo Ardente"

**Card miniatura**: SVG compacto com paths preenchidos conforme intensidade.

**Modal expandido**:
- SVG maior com mesmas cores
- Badge com perfil de fogo
- Lista de áreas afetadas com labels legíveis (usando `areaLabels` do HeatMapInteractive)
- Legenda (Leve/Moderado/Intenso)
- Texto: "Este é o seu mapa do Dia 1. Você poderá compará-lo com mapas futuros para ver sua evolução."
- Somente visualização (sem edição)
- Se `heatMapDay1` vazio ou soma=0: "Brisa Leve" + "Nenhuma área registrada"

## Arquivos alterados
- `src/lib/profileEngine.ts` — adicionar `heatMapDay1` ao UserProfile e parsing
- `src/components/HeatMapCard.tsx` — reescrever com SVG real e dados de `heatMapDay1`

