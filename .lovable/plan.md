

## Dia 5 — Ilustrações Premium (Substituir Stick Figures)

### Abordagem
Redesenhar os 3 SVGs inline em `Day5MovementGuide.tsx`, substituindo os bonecos de palito atuais por silhuetas femininas elegantes usando formas orgânicas (paths curvos, ellipses arredondadas). Sem dependências externas — tudo SVG inline no componente.

### Diretrizes visuais
- Silhuetas preenchidas (filled shapes) em vez de linhas finas (strokes)
- Gradiente linear `#2EC4B6` → `#3DD9C8` para o corpo
- Setas e indicadores de movimento em `#1B3F6B`
- Formas arredondadas com `rx/ry` generosos — proporções femininas anatomicamente corretas
- Cabeça como ellipse, torso como path curvo, membros como paths com espessura variável
- Destaque sutil nas áreas trabalhadas (panturrilhas, tornozelos, pés)

### 3 Ilustrações

**CalfRaiseSVG** — Silhueta feminina de perfil, em pé na ponta dos pés. Corpo inteiro preenchido com gradiente teal. Setas navy apontando para cima nos calcanhares. Destaque suave nas panturrilhas.

**PlantarFlexionSVG** — Silhueta feminina sentada em cadeira (cadeira em cinza sutil). Duas posições do pé sobrepostas (ponta elevada em tom mais claro, calcanhar elevado em tom original). Setas duplas indicando alternância.

**AnkleRotationSVG** — Silhueta feminina reclinada/sentada com uma perna elevada. Seta circular ao redor do tornozelo em navy. Ponto de destaque no tornozelo.

### Mudanças técnicas

**Arquivo: `src/components/journey/Day5MovementGuide.tsx`**

Substituir os 3 componentes SVG existentes (`CalfRaiseSVG`, `PlantarFlexionSVG`, `AnkleRotationSVG`) por versões redesenhadas usando:
- `<defs>` com `linearGradient` para o corpo
- Paths curvos (`<path d="...">`) para silhuetas orgânicas em vez de `<line>` retas
- `fill` em vez de `stroke` como linguagem visual principal
- ViewBox mantido mas ajustado conforme necessidade de cada pose
- Classes CSS mantidas (`w-48 h-48 mx-auto`)

Nenhum outro arquivo é alterado. A estrutura do componente (exercises array, lógica de steps, botões) permanece idêntica.

### Arquivos modificados: 1
- `src/components/journey/Day5MovementGuide.tsx` — redesenho dos 3 SVGs

