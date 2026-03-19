

# Redesenhar SVG da silhueta no HeatMapInteractive

## Escopo

Alterar **apenas os paths SVG** em `src/components/journey/HeatMapInteractive.tsx` para uma silhueta feminina com curvas naturais. Zero mudanças em lógica, áreas, IDs ou qualquer outro elemento.

## O que muda

- **Contorno do corpo** (cabeça, pescoço, torso): redesenhar com curvas Bézier — cintura estreita (~80px), quadris largos (~130px), ombros arredondados (~115px)
- **9 áreas clicáveis**: redesenhar os paths para se encaixar na nova silhueta, mantendo mesmos IDs (`braco_esq`, `braco_dir`, `abdomen`, `quadril_esq`, `quadril_dir`, `coxa_esq`, `coxa_dir`, `panturrilha_esq`, `panturrilha_dir`)
- ViewBox pode ajustar levemente para acomodar proporções melhores

## O que NÃO muda

- `AreaId` type, `areaLabels`, `intensityColors`
- Estado inicial, `toggleArea`, `handleSubmit`
- Legenda, texto, botão CTA
- Estilos CSS, animações framer-motion

## Arquivo alterado

`src/components/journey/HeatMapInteractive.tsx` — apenas o bloco `<svg>` (~linhas 90-175)

