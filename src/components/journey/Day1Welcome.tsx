import { motion } from "framer-motion";
import logoAzul from "@/assets/logo_livvia_azul_icone.png";

interface Day1WelcomeProps {
  onNext: () => void;
}

const Day1Welcome = ({ onNext }: Day1WelcomeProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      {/* Floating logo */}
      <motion.img
        src={logoAzul}
        alt="Levvia"
        className="w-[72px] h-auto mb-10"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-foreground text-center mb-6 italic"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2rem, 4vw, 3rem)",
        }}
      >
        A culpa não é sua.
      </motion.h1>

      {/* Body paragraphs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="max-w-[540px] text-center mb-12 space-y-6"
      >
        <p
          className="text-foreground/75 leading-[2.0]"
          style={{ fontWeight: 300, fontSize: "1.05rem" }}
        >
          Se você chegou até aqui, é provável que carregue uma história de
          dúvidas, frustrações e, talvez, a sensação de não ser compreendida.
        </p>
        <p
          className="text-foreground/75 leading-[2.0]"
          style={{ fontWeight: 300, fontSize: "1.05rem" }}
        >
          Por décadas, a experiência de mulheres como você foi invalidada. Dor
          ao toque, hematomas sem explicação, resistência a dietas — tudo isso
          foi chamado de &ldquo;falta de disciplina&rdquo;.
        </p>
        <p
          className="text-foreground/75 leading-[2.0]"
          style={{ fontWeight: 300, fontSize: "1.05rem" }}
        >
          Mas hoje, essa narrativa muda. O que você sente é real. A dor que
          você carrega tem nome, tem causa biológica e merece ser levada a
          sério. Sempre. A culpa nunca foi sua.
        </p>
      </motion.div>

      {/* Transition line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="text-secondary text-center mb-12"
        style={{ fontWeight: 400, fontSize: "0.95rem" }}
      >
        O Levvia vai te ajudar a visualizar seu fogo interno de uma forma que
        você nunca viu antes.
      </motion.p>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.4 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="w-full max-w-xs py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm"
      >
        Entender o meu fogo →
      </motion.button>
    </div>
  );
};

export default Day1Welcome;
