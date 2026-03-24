import { useState } from "react";
import { motion } from "framer-motion";
import logoAzul from "@/assets/logo_livvia_azul_icone.png";

interface Day4ClosingProps {
  onComplete: () => void;
}

const Day4Closing = ({ onComplete }: Day4ClosingProps) => {
  const [saving, setSaving] = useState(false);

  const handleComplete = async () => {
    setSaving(true);
    try {
      await onComplete();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <motion.img
        src={logoAzul}
        alt="Levvia"
        className="w-16 h-auto mb-8"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6"
      >
        <span className="text-5xl mb-4 block">✨</span>
        <h1
          className="text-foreground italic mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
          }}
        >
          Parabéns! Dia 4 Completo
        </h1>
        <p className="text-foreground/60 text-base" style={{ fontWeight: 300 }}>
          Seu ritual de sono restaurador está pronto.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-5 max-w-sm w-full mb-6"
      >
        <p className="text-secondary text-sm font-medium mb-3">Suas Conquistas</p>
        <div className="space-y-2.5">
          {[
            { day: 1, text: "Mapeou seu Fogo Interno" },
            { day: 2, text: "Sentiu alívio com drenagem linfática" },
            { day: 3, text: "Ganhou clareza sobre alimentação anti-inflamatória" },
            { day: 4, text: "Preparou seu ritual de sono restaurador" },
          ].map((item) => (
            <div key={item.day} className="flex items-start gap-2">
              <span className="text-success text-sm">✅</span>
              <p className="text-foreground/70 text-sm" style={{ fontWeight: 300 }}>
                <strong className="text-foreground/90">Dia {item.day}:</strong> {item.text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass-card p-5 max-w-sm w-full mb-10"
      >
        <p className="text-secondary text-sm font-medium mb-2">💜 Amanhã: Dia 5</p>
        <p
          className="text-foreground/60 leading-relaxed"
          style={{ fontWeight: 300, fontSize: "0.9rem", lineHeight: 1.7 }}
        >
          Movimento Sem Dor — Você vai desbloquear o fluxo do seu corpo com
          movimentos gentis e seguros para o seu nível.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleComplete}
        disabled={saving}
        className="w-full max-w-xs py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm"
      >
        {saving ? "Salvando..." : "Salvar Progresso →"}
      </motion.button>
    </div>
  );
};

export default Day4Closing;
