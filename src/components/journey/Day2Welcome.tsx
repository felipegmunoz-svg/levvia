import { motion } from "framer-motion";
import logoAzul from "@/assets/logo_livvia_azul_icone.png";

interface Day2WelcomeProps {
  onNext: () => void;
}

const Day2Welcome = ({ onNext }: Day2WelcomeProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <motion.img
        src={logoAzul}
        alt="Levvia"
        className="w-[72px] h-auto mb-10"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-secondary text-center mb-4 tracking-[0.2em]"
        style={{ fontWeight: 500, fontSize: "0.75rem" }}
      >
        DIA 2 — MOMENTO DESPERTAR
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-foreground text-center mb-6 italic"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
        }}
      >
        O Alívio em 5 Minutos
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="levvia-card p-6 max-w-md mb-8"
      >
        <p className="text-secondary text-sm font-medium mb-3">✨ Afirmação do Dia</p>
        <p
          className="text-foreground/80 italic leading-relaxed text-center"
          style={{ fontWeight: 300, fontSize: "1rem", lineHeight: 1.9 }}
        >
          "Eu honro meu corpo e ouço suas mensagens. Cada sensação é um guia
          para o meu bem-estar e eu tenho o poder de ativar meu fluxo interno."
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="max-w-md mb-12"
      >
        <p className="text-foreground/70 text-sm font-medium mb-2">🧘 Intenção</p>
        <p
          className="text-foreground/60 leading-relaxed"
          style={{ fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8 }}
        >
          Comece o dia com uma breve pausa, sentindo seu corpo. Observe sem
          julgamento. Onde você sente mais peso? Onde há inchaço? Apenas observe
          e respire profundamente, visualizando um fluxo suave de água em seu corpo.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="w-full max-w-xs py-4 rounded-3xl bg-primary text-primary-foreground font-medium text-sm"
      >
        Ativar meu fluxo →
      </motion.button>
    </div>
  );
};

export default Day2Welcome;
