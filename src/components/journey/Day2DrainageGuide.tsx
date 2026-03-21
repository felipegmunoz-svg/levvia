import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import positionLegsUp from "@/assets/day2-position-legs-up.png";
import positionBridge from "@/assets/day2-position-bridge.png";
import positionTwist from "@/assets/day2-position-twist.png";

interface Day2DrainageGuideProps {
  onNext: () => void;
}

const positions = [
  {
    title: "Pernas para o Alto",
    duration: "2 minutos",
    image: positionLegsUp,
    description:
      "Deite-se de costas, eleve as pernas e apoie-as na parede. Mantenha os joelhos levemente flexionados. Respire profundamente, sentindo o sangue e a linfa fluírem de volta para o centro do corpo. Mantenha por 2 minutos.",
  },
  {
    title: "Ponte Suave",
    duration: "1 minuto",
    image: positionBridge,
    description:
      "Com os joelhos flexionados e os pés no chão, eleve o quadril suavemente. Essa pequena elevação ajuda a ativar a circulação na região pélvica. Mantenha por 1 minuto, respirando calmamente.",
  },
  {
    title: "Torção Relaxante",
    duration: "1 min cada lado",
    image: positionTwist,
    description:
      "Deite-se de costas, traga os joelhos flexionados para o peito e deixe-os cair suavemente para um lado, girando a cabeça para o lado oposto. Sinta o alongamento suave na coluna e a liberação de tensões. Troque de lado após 1 minuto.",
  },
];

const Day2DrainageGuide = ({ onNext }: Day2DrainageGuideProps) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-10">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-secondary text-center mb-2 tracking-[0.2em]"
        style={{ fontWeight: 500, fontSize: "0.75rem" }}
      >
        SEU PROTOCOLO DE ALÍVIO
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-foreground text-center mb-2"
        style={{ fontWeight: 500, fontSize: "1.1rem" }}
      >
        🧘‍♀️ 3 Posições de Drenagem Linfática
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-foreground/60 text-center mb-6 max-w-sm"
        style={{ fontWeight: 300, fontSize: "0.85rem" }}
      >
        Ontem, você visualizou o seu fogo interno. Hoje, vamos começar a resfriá-lo
        ativando o sistema de limpeza do seu corpo: o sistema linfático.
      </motion.p>

      {/* Card */}
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card p-5 w-full max-w-sm mb-6"
      >
        <img
          src={positions[current].image}
          alt={positions[current].title}
          className="w-full h-48 object-contain rounded-xl mb-4"
        />
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-foreground font-medium text-base">
            Posição {current + 1}: {positions[current].title}
          </h3>
          <span className="text-secondary text-xs font-medium bg-secondary/10 px-2 py-1 rounded-full">
            {positions[current].duration}
          </span>
        </div>
        <p
          className="text-foreground/60 leading-relaxed"
          style={{ fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.7 }}
        >
          {positions[current].description}
        </p>
      </motion.div>

      {/* Navigation dots + arrows */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="p-2 rounded-full border border-white/10 text-foreground/60 disabled:opacity-30 hover:border-secondary/30 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-2">
          {positions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === current ? "bg-secondary scale-110" : "bg-white/20"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrent(Math.min(2, current + 1))}
          disabled={current === 2}
          className="p-2 rounded-full border border-white/10 text-foreground/60 disabled:opacity-30 hover:border-secondary/30 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <p
        className="text-foreground/50 text-center italic mb-6 max-w-xs"
        style={{ fontWeight: 300, fontSize: "0.85rem" }}
      >
        Não é preciso força, apenas intenção e a posição correta.
      </p>

      <button
        onClick={onNext}
        className="w-full max-w-xs py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm"
      >
        Completei as 3 Posições →
      </button>
    </div>
  );
};

export default Day2DrainageGuide;
