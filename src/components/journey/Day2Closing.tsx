import { useState } from "react";
import { motion } from "framer-motion";
import logoAzul from "@/assets/logo_livvia_azul_icone.png";

interface Day2ClosingProps {
  onComplete: () => void;
}

const Day2Closing = ({ onComplete }: Day2ClosingProps) => {
  const [saving, setSaving] = useState(false);

  const handleComplete = async () => {
    setSaving(true);
    await onComplete();
    setSaving(false);
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
        🎉 Sua Jornada Continua
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-foreground/70 text-center max-w-[480px] mb-8"
        style={{ fontWeight: 300, fontSize: "1rem", lineHeight: 1.9 }}
      >
        Você sentiu o alívio, entendeu o fluxo e fez uma escolha consciente.
        O "Mapa da Inflamação" que você criou hoje será a bússola para os
        próximos passos.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass-card p-5 max-w-sm w-full mb-10"
      >
        <p className="text-secondary text-sm font-medium mb-2">📅 Amanhã: Dia 3</p>
        <p
          className="text-foreground/60 leading-relaxed"
          style={{ fontWeight: 300, fontSize: "0.9rem", lineHeight: 1.7 }}
        >
          Amanhã é o nosso dia mais importante. Vamos consolidar sua clareza
          nutricional para você decidir como quer seguir sua jornada de 14 dias.
          Vamos juntas?
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
        {saving ? "Salvando..." : "Completar Dia 2 →"}
      </motion.button>
    </div>
  );
};

export default Day2Closing;
