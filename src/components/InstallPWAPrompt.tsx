import logoFull from "@/assets/logo_livvia_azul.png";
import { Share, MoreVertical, PlusSquare, CheckCircle } from "lucide-react";

interface InstallPWAPromptProps {
  onDismiss: () => void;
}

const InstallPWAPrompt = ({ onDismiss }: InstallPWAPromptProps) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const steps = isIOS
    ? [
        { icon: <Share className="w-4 h-4" strokeWidth={1.5} />, title: "Toque nos 3 pontinhos", description: "No Safari, toque no ícone ••• no canto inferior direito da tela" },
        { icon: <PlusSquare className="w-4 h-4" strokeWidth={1.5} />, title: "Toque em 'Tela de Início'", description: "Role a lista para baixo e toque em 'Adicionar à Tela de Início'" },
        { icon: <CheckCircle className="w-4 h-4" strokeWidth={1.5} />, title: "Toque em 'Adicionar'", description: "Confirme no canto superior direito e o Levvia aparece na sua tela inicial" },
      ]
    : [
        { icon: <MoreVertical className="w-4 h-4" strokeWidth={1.5} />, title: "Toque nos 3 pontos do menu", description: "No Chrome, toque no ícone ⋮ no canto superior direito" },
        { icon: <PlusSquare className="w-4 h-4" strokeWidth={1.5} />, title: "Adicionar à tela inicial", description: 'Toque em "Adicionar à tela inicial"' },
        { icon: <CheckCircle className="w-4 h-4" strokeWidth={1.5} />, title: "Confirme a instalação", description: "Toque em 'Adicionar' para confirmar" },
      ];

  return (
    <div className="min-h-screen flex flex-col gradient-page">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <img src={logoFull} alt="Levvia" className="w-[160px] h-auto mb-8" />

        <h1 className="text-[28px] font-light text-foreground text-center mb-3 leading-tight">
          Instale o Levvia no{"\n"}seu celular
        </h1>
        <p className="text-[15px] text-muted-foreground text-center mb-8 max-w-xs">
          Para a melhor experiência, adicione à sua tela inicial.
        </p>

        <div className="glass-card p-5 w-full max-w-sm mb-8">
          <p className="text-xs text-muted-foreground font-medium mb-4 uppercase tracking-wider">
            {isIOS ? "iOS (Safari)" : "Android (Chrome)"}
          </p>

          {isIOS && (
            <p className="text-xs text-muted-foreground mb-3">
              ⚠️ Funciona apenas no Safari. Se estiver no Chrome, abra este link no Safari primeiro.
            </p>
          )}

          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 text-xs font-medium text-secondary-foreground">
                  {i + 1}
                </div>
                <div className="flex flex-col gap-0.5 pt-0.5">
                  <div className="flex items-center gap-2">
                    {step.icon && <span className="text-secondary">{step.icon}</span>}
                    <span className="text-sm font-medium text-foreground">{step.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{step.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="gradient-primary rounded-3xl py-4 w-full max-w-sm text-foreground font-medium text-base"
        >
          ✓ Já instalei — Continuar
        </button>
        <button
          onClick={onDismiss}
          className="text-muted-foreground text-sm mt-3 py-2"
        >
          Agora não
        </button>
      </div>
    </div>
  );
};

export default InstallPWAPrompt;
