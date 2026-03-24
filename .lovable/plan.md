

## Unificação Visual: Mapa de Inflamação Dia 2 com SVG

### Objetivo
Substituir o grid de botões do `Day2InflammationMap.tsx` pela silhueta SVG do `HeatMapInteractive.tsx`, mantendo as 4 categorias de inflamação e a tela de notas.

### Abordagem
Reescrever `Day2InflammationMap.tsx` para usar o mesmo SVG do Dia 1, com um seletor de ferramentas (Dor/Inchaço/Peso/Sensibilidade) acima do mapa. Cada área pode receber múltiplos tipos. A tela de notas permanece como está.

Nao modificar `HeatMapInteractive.tsx` (manter Dia 1 intacto). Toda a lógica do Dia 2 fica encapsulada em `Day2InflammationMap.tsx`.

### Arquivo: `src/components/journey/Day2InflammationMap.tsx`

Mudanças:

1. **Substituir grid por SVG** — copiar a estrutura SVG do `HeatMapInteractive` (silhueta completa com cabeça, pescoço, mãos, pés decorativos + 9 áreas clicáveis)

2. **Cor das áreas** — em vez de intensidade (0-3), cada área mostra a cor do último tipo marcado. Se tem múltiplos tipos, usa a cor do tipo mais recente (comportamento atual do `getAreaColor` já faz isso)

3. **Emojis sobre as áreas** — adicionar `<text>` SVG sobre cada área mostrando os emojis dos tipos marcados (ex: "🔴🟡" se tem Dor + Inchaço)

4. **Seletor de ferramentas** — manter o seletor existente (4 botões pill), posicionado acima do SVG

5. **Legenda** — substituir a legenda de intensidade por legenda dos 4 tipos com suas cores

6. **Tela de notas** — manter exatamente como está (funciona bem)

7. **Narrativa** — título muda de "Onde a inflamação se manifesta?" para "Ontem você mapeou onde. Hoje vamos entender como." com subtítulo contextual

### Detalhes técnicos

**SVG paths** — extraídos diretamente do `HeatMapInteractive.tsx` (linhas 117-131), incluindo paths decorativos (cabeça, pescoço, mãos, pés) e 9 áreas interativas

**Coordenadas centrais para emojis** (aproximadas a partir dos paths):
- braco_esq: (44, 150), braco_dir: (176, 150)
- abdomen: (110, 130)
- quadril_esq: (82, 198), quadril_dir: (138, 198)
- coxa_esq: (82, 267), coxa_dir: (138, 267)
- panturrilha_esq: (80, 354), panturrilha_dir: (140, 354)

**Estado** — sem mudanças no estado (`markedAreas`, `notes`, `currentTool`, `showNotes`). A lógica de toggle e getAreaColor já está correta.

**onComplete** — interface e dados retornados permanecem idênticos, sem mudança no `Day2Flow.tsx`

### Arquivos modificados
- `src/components/journey/Day2InflammationMap.tsx` — reescrever render principal (substituir grid por SVG)

### Arquivos NÃO modificados
- `HeatMapInteractive.tsx` — intacto
- `Day2Flow.tsx` — intacto (já chama `Day2InflammationMap` corretamente)
- Supabase — sem migration (campo `day2_inflammation_map` JSONB já existe)

