

# Incorporar Logos Oficiais Levvia

3 arquivos editados + 2 assets copiados. Apenas substituições visuais.

---

## Assets

Copiar para `src/assets/`:
- `logo_livvia_branco.png` (logo completo)
- `logo_livvia_branco_icone.png` (símbolo/asas)

## 1. `src/pages/Onboarding.tsx`

**Welcome screen** — adicionar branch explícito para `current.type === "welcome"` no `renderContent()`, antes do bloco "Standard question screens" (antes da linha 191):

```tsx
if (current.type === "welcome") {
  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-8">
      <div className="flex justify-center mb-6">
        <img src={logoFull} alt="Levvia" className="w-[200px] h-auto" />
      </div>
      <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed">
        Seu caminho para a leveza.
      </p>
    </div>
  );
}
```

- Remove o título "Bem-vinda ao Levvia" (o logo já comunica a marca)
- Mantém apenas a tagline
- Import: `import logoFull from "@/assets/logo_livvia_branco.png"`

## 2. `src/pages/Today.tsx`

No header (linha ~179-183), adicionar o símbolo das asas à esquerda do greeting/nome:

```tsx
<header className="gradient-page px-6 pt-10 pb-8 rounded-b-3xl">
  <div className="flex items-center gap-3 mb-1">
    <img src={logoIcon} alt="Levvia" className="w-8 h-auto" />
    <p className="text-muted-foreground text-sm font-medium">{getGreeting()}</p>
  </div>
  <h1 className="text-2xl font-light text-foreground mt-1">
    ...
  </h1>
```

- Import: `import logoIcon from "@/assets/logo_livvia_branco_icone.png"`

## 3. `src/pages/Profile.tsx`

No avatar (linhas 50-53), substituir o Heart icon pelo símbolo:

```tsx
<div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
  <img src={logoIcon} alt="Levvia" className="w-10 h-auto" />
</div>
```

- Import: `import logoIcon from "@/assets/logo_livvia_branco_icone.png"`

---

3 arquivos + 2 assets. Zero lógica alterada.

