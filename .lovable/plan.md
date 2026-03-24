

## Dia 5 — Substituir SVGs por Imagens 3D Premium

### Mudanças

1. **Copiar 3 imagens para `public/illustrations/`**
   - `user-uploads://calf-raise-3d.png` → `public/illustrations/calf-raise-3d.png`
   - `user-uploads://plantar-flexion-3d.png` → `public/illustrations/plantar-flexion-3d.png`
   - `user-uploads://ankle-rotation-3d.png` → `public/illustrations/ankle-rotation-3d.png`

2. **Modificar `src/components/journey/Day5MovementGuide.tsx`**
   - Remover os 3 componentes SVG inline (`CalfRaiseSVG`, `PlantarFlexionSVG`, `AnkleRotationSVG`) — ~150 linhas de SVG eliminadas
   - Substituir a propriedade `Illustration` por `illustrationUrl` no array `exercises`
   - No render, trocar `<ExIllustration />` por `<img src={illustrationUrl} alt={title} className="w-64 h-64 object-contain rounded-lg mx-auto" loading="lazy" />`

### Arquivos modificados: 4
- `public/illustrations/calf-raise-3d.png` (novo)
- `public/illustrations/plantar-flexion-3d.png` (novo)
- `public/illustrations/ankle-rotation-3d.png` (novo)
- `src/components/journey/Day5MovementGuide.tsx` (modificado)

