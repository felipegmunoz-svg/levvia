import { motion } from "framer-motion";
import logoAzul from "@/assets/logo_livvia_azul_icone.png";

interface Day4WelcomeProps {
  onContinue: () => void;
}

const Day4Welcome = ({ onContinue }: Day4WelcomeProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <motion.img
        src={logoAzul}
        alt="Levvia"
        className="w-14 h-auto mb-6"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6"
      >
        <span className="text-5xl mb-4 block">🌙</span>
        <h1
          className="text-foreground italic mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
          }}
        >
          Dia 4 — O Sono que Cura
        </h1>
        <p className="text-foreground/60 text-base" style={{ fontWeight: 300 }}>
          Quando Você Dorme, Seu Corpo Se Regenera
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-5 max-w-sm w-full mb-8"
      >
        <p
          className="text-foreground/70 text-center italic leading-relaxed"
          style={{ fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8 }}
        >
          "Eu honro meu corpo com o descanso que ele merece. O sono é meu aliado
          na jornada de leveza."
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-foreground/60 text-center max-w-[440px] mb-10"
        style={{ fontWeight: 300, fontSize: "0.9rem", lineHeight: 1.8 }}
      >
        Hoje você vai descobrir como transformar suas noites em um ritual de cura.
        O sono não é tempo perdido — é quando seu corpo se repara, desinfla e se renova.
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="w-full max-w-xs py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm"
      >
        Preparar Meu Ritual de Sono →
      </motion.button>
    </div>
  );
};

export default Day4Welcome;
