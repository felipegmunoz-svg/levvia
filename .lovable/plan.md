

# Componente InstallPWAPrompt + Integração no Index.tsx

2 arquivos: 1 novo componente, 1 editado.

---

## 1. Criar `src/components/InstallPWAPrompt.tsx`

Componente fullscreen com:

- **Detecção de plataforma**: `const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)`
- **Props**: `onDismiss: () => void`
- **Layout**: fundo `bg-[#0D1F36]` + gradiente topo, min-h-screen, flex col, centralizado
- **Logo**: `<img src={logoApp} className="w-[160px]" />` (import de `@/assets/logo_livvia_branco.png` — o logo completo branco, não o ícone do app)
- **Título**: "Instale o Levvia no seu celular" — `text-[28px] font-light text-[#EDF2F7]`
- **Subtítulo**: "Para a melhor experiência, adicione à sua tela inicial." — `text-[15px] text-[#8BA8C4]`
- **Card instruções**: glass-card, mostra iOS ou Android condicionalmente
  - iOS: 3 passos com ícone Share (lucide `Share`) e texto
  - Android: 3 passos com ícone MoreVertical (lucide `MoreVertical`)
  - Números em círculos `bg-[#2E86AB]` text-white w-6 h-6 rounded-full
- **Botão "Já instalei"**: `gradient-primary rounded-3xl py-4 w-full text-[#EDF2F7] font-medium` → chama `onDismiss()`
- **Link "Agora não"**: `text-[#8BA8C4] text-sm mt-3` → chama `onDismiss()`

## 2. Editar `src/pages/Index.tsx`

Transformar de redirect imediato para componente com estado:

```tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InstallPWAPrompt from "@/components/InstallPWAPrompt";

const Index = () => {
  const navigate = useNavigate();
  const [showInstall, setShowInstall] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as any).standalone === true;
    const dismissed = localStorage.getItem("levvia_install_dismissed") === "true";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile && !isStandalone && !dismissed) {
      setShowInstall(true);
    }
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!checked || showInstall) return;
    const onboarded = localStorage.getItem("levvia_onboarded");
    navigate(onboarded === "true" ? "/today" : "/onboarding", { replace: true });
  }, [checked, showInstall, navigate]);

  if (!checked) return null;

  if (showInstall) {
    return <InstallPWAPrompt onDismiss={() => {
      localStorage.setItem("levvia_install_dismissed", "true");
      setShowInstall(false);
    }} />;
  }

  return null;
};
```

Fluxo: check condições → se mobile+não instalado+não dispensou → mostra prompt → ao dispensar, navega normalmente.

---

2 arquivos. Zero lógica de onboarding/rotas alterada.

