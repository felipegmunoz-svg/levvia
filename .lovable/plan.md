

# Remover IMC da tela de diagnóstico

## Arquivo: `src/pages/Diagnosis.tsx`

### Remover
1. Variáveis `bmi` e `getBmiLabel` (linhas ~33-39)
2. O bloco condicional `{bmi && (...)}` que renderiza o card "IMC" dentro do grid de perfil (linhas ~131-138)

### Manter
Tudo o resto: nome, fogo interno, idade, peso, altura, atividade, áreas de atenção, perfil alimentar, seção CTA.

Nenhum outro arquivo precisa ser alterado — o IMC só é calculado/exibido neste componente.

