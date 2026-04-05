
# Corrigir o conteúdo da seção “Dedicatória e Prefácio” com substituição manual

## O que encontrei
A seção `bf31f496-9350-4ed7-9420-5df905ed8c6f` ainda contém o nome do autor no banco. O problema não é a tela: o texto salvo realmente inclui este trecho, com acentuação em Unicode decomposta e quebra de linha:

```text
Com carinho, respeito e compromisso,
Luís Cláudio da 

Viver com lipedema...
```

Além disso, `GuiaSection.tsx` normaliza quebras de linha ao renderizar:
```ts
.split(/\n\s*\n/)
.map((block) => block.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
```
Então esse trecho aparece na UI como uma frase contínua, mesmo quando buscas anteriores não encontraram o encoding corretamente.

## Correção a aplicar
Vou fazer exatamente a substituição manual pedida, apenas nessa seção:

1. Ler o conteúdo completo atual da seção `bf31f496-9350-4ed7-9420-5df905ed8c6f`
2. Identificar manualmente o bloco que começa em:
   - `Com carinho, respeito e compromisso`
   e termina imediatamente antes de:
   - `Viver com lipedema`
3. Montar um `UPDATE` com o conteúdo completo corrigido da seção, sem usar `REPLACE` nem `REGEXP_REPLACE`
4. Salvar o novo conteúdo com este trecho exato:
```text
Com carinho, respeito e compromisso, Equipe Levvia.
```
5. Confirmar com uma consulta de verificação mostrando cerca de 50 caracteres ao redor de `compromisso`

## SQL que será executado
A implementação será um `UPDATE ebook_sections SET content = '...texto completo corrigido...' WHERE id = 'bf31f496-9350-4ed7-9420-5df905ed8c6f';`

Depois, uma verificação como:
```sql
SELECT SUBSTRING(content FROM GREATEST(POSITION('compromisso' IN content) - 25, 1) FOR 100)
FROM ebook_sections
WHERE id = 'bf31f496-9350-4ed7-9420-5df905ed8c6f';
```

## Resultado esperado
Na tela `/guia/0/bf31f496-9350-4ed7-9420-5df905ed8c6f`, o nome do autor deixará de aparecer, porque ele será removido do conteúdo fonte salvo no banco.

## Detalhes técnicos
- A causa raiz é texto salvo com caracteres Unicode combinados (`é`, `ã`, etc.), o que pode quebrar buscas simples e substituições parciais.
- Não há necessidade de alterar `GuiaSection.tsx` para este caso específico.
- A correção é localizada e segura: somente 1 linha/tabela, 1 seção, 1 campo (`content`).

