
Objetivo: corrigir o problema real de escala no onboarding e recalibrar as zonas sem perder a intensidade visual atual.

1. Ajustar o gargalo de escala no onboarding
- Hoje a silhueta não cresce porque `src/components/journey/HeatMapInteractive.tsx` limita o wrapper a `w-[200px]` / `w-[160px]`.
- Vou remover esse limite fixo e trocar por um wrapper expansível, centralizado e sem padding/altura que apertem a imagem.
- Isso é necessário: só mexer em `FlowSilhouette.tsx` não resolve o tamanho no `/onboarding`.

2. Escala máxima da silhueta no `src/components/FlowSilhouette.tsx`
- No modo interativo (`onAreaClick` presente), o container passa a usar comportamento de tela cheia: `w-screen` com `max-w-[800px]`.
- Remover qualquer `max-h` e qualquer restrição local que esteja encolhendo a imagem.
- Manter `aspectRatio: "3 / 4"` e fazer a imagem ocupar 100% do container com `object-contain`.
- Nos usos não interativos (perfil/progresso), preservar um tamanho mais contido para não quebrar cards existentes.

3. Recalibrar zonas com os valores pedidos
- Braço esquerdo: `left: "32%"`
- Braço direito: `left: "60%"`
- Braços com rotação `18deg` e `-18deg`
- Coxa esquerda: mover 2% para o centro
- Coxa direita: mover 2% para o centro
- Panturrilha esquerda: mover 2% para o centro
- Panturrilha direita: mover 2% para o centro
- Demais dimensões e intensidades permanecem como estão, salvo onde o reposicionamento exigir consistência visual.

4. Preservar o visual forte já aprovado
- Manter cores vibrantes com opacidade `0.9`
- Manter blur reduzido em `5px`
- Manter linhas-guia azuis `#60A5FA`
- Aumentar espessura das linhas para `1.5px` em todas as zonas inativas clicáveis

5. Compatibilidade
- Preservar `calculateFlowScore`
- Preservar o wrapper legado de `Progress.tsx`
- Garantir que o modo gigante aconteça só no fluxo interativo, sem estourar o layout do perfil/progresso

Arquivos a alterar
- `src/components/FlowSilhouette.tsx`
- `src/components/journey/HeatMapInteractive.tsx`

Nota técnica importante
- A meta de “80% da altura da tela” entra em conflito com a proporção fixa `3 / 4` em celulares estreitos. A implementação correta será: ocupar a maior escala possível dentro do viewport, priorizando largura total no onboarding sem distorcer a imagem.