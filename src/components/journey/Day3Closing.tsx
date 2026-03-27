import { useState } from "react";
import { motion } from "framer-motion";
import logoAzul from "@/assets/logo_livvia_azul_icone.png";

interface Day3ClosingProps {
  onComplete: () => void;
}

const Day3Closing = ({ onComplete }: Day3ClosingProps) => {
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

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-foreground text-center mb-5 italic"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
        }}
      >
        🎉 Parabéns! 3 Dias de Cuidado
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-foreground/70 text-center max-w-[480px] mb-8"
        style={{ fontWeight: 300, fontSize: "1rem", lineHeight: 1.9 }}
      >
        Você já identificou seu fogo, sentiu o alívio físico e ganhou clareza
        nutricional. Sinta orgulho do caminho percorrido!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="levvia-card p-5 max-w-sm w-full mb-6"
      >
        <p className="text-secondary text-sm font-medium mb-3">Suas Conquistas</p>
        <div className="space-y-2.5">
          <div className="flex items-start gap-2">
            <span className="text-success text-sm">✅</span>
            <p className="text-foreground/70 text-sm" style={{ fontWeight: 300 }}>
              <strong className="text-foreground/90">Dia 1:</strong> Mapeou seu Fogo Interno
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-success text-sm">✅</span>
            <p className="text-foreground/70 text-sm" style={{ fontWeight: 300 }}>
              <strong className="text-foreground/90">Dia 2:</strong> Sentiu alívio com drenagem linfática
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-success text-sm">✅</span>
            <p className="text-foreground/70 text-sm" style={{ fontWeight: 300 }}>
              <strong className="text-foreground/90">Dia 3:</strong> Ganhou clareza sobre alimentação anti-inflamatória
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="levvia-card p-5 max-w-sm w-full mb-10"
      >
        <p className="text-secondary text-sm font-medium mb-2">💜 O que vem a seguir</p>
        <p
          className="text-foreground/60 leading-relaxed"
          style={{ fontWeight: 300, fontSize: "0.9rem", lineHeight: 1.7 }}
        >
          Sua jornada de 14 dias tem muito mais a oferecer: sono restaurador,
          movimento sem dor, o poder das especiarias, e sua primeira grande
          vitória no Dia 7.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleComplete}
        disabled={saving}
        className="w-full max-w-xs py-4 rounded-3xl bg-primary text-primary-foreground font-medium text-sm"
      >
        {saving ? "Salvando..." : "Ver o Que Vem a Seguir →"}
      </motion.button>
    </div>
  );
};

export default Day3Closing;
