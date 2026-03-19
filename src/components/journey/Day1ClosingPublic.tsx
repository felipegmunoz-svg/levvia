import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logoAzul from "@/assets/logo_livvia_azul_icone.png";

const sensations = [
  "Mais pesadas",
  "Iguais a antes",
  "Um pouco mais leves",
  "Muito mais leves",
];

/**
 * Public version of Day1Closing that saves to localStorage
 * instead of Supabase (user is not yet authenticated).
 */
const Day1ClosingPublic = () => {
  const navigate = useNavigate();
  const [legSensation, setLegSensation] = useState<string | null>(null);
  const [guiltBefore, setGuiltBefore] = useState<number | null>(null);
  const [guiltAfter, setGuiltAfter] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!legSensation) return;

    localStorage.setItem(
      "levvia_day1_diary",
      JSON.stringify({
        leg_sensation: legSensation,
        guilt_before: guiltBefore,
        guilt_after: guiltAfter,
        notes,
      })
    );
    localStorage.setItem("levvia_day1_local_completed", "true");

    setSaved(true);
  };

  const handleGoToPlans = () => {
    navigate("/today", { replace: true });
  };

  if (saved) {
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
          Você deu o primeiro passo.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-foreground/70 text-center max-w-[480px] mb-12"
          style={{ fontWeight: 300, fontSize: "1rem", lineHeight: 1.9 }}
        >
          Seu fogo tem nome agora — e você já começou a resfriá-lo. Amanhã,
          vamos trazer alívio diretamente para o seu corpo.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoToPlans}
          className="w-full max-w-xs py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm"
        >
          Começar minha jornada →
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-10">
      <h2
        className="text-foreground text-center mb-6"
        style={{ fontWeight: 500, fontSize: "1rem" }}
      >
        Como suas pernas se sentiram hoje?
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-8 max-w-sm mx-auto w-full">
        {sensations.map((s) => (
          <button
            key={s}
            onClick={() => setLegSensation(s)}
            className={`py-3 px-4 rounded-2xl text-sm font-medium transition-all border ${
              legSensation === s
                ? "border-secondary bg-secondary/15 text-secondary"
                : "border-white/10 bg-white/[0.06] text-foreground/80"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="max-w-sm mx-auto w-full mb-6">
        <p className="text-foreground/70 text-sm mb-1" style={{ fontWeight: 400 }}>
          Nível de culpa com o meu corpo
        </p>
        <p className="text-foreground/50 text-xs mb-4" style={{ fontWeight: 300 }}>
          Antes de ler o conteúdo de hoje
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setGuiltBefore(n)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${
                guiltBefore === n
                  ? "border-secondary bg-secondary/15 text-secondary"
                  : "border-white/10 bg-white/[0.06] text-foreground/60"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-sm mx-auto w-full mb-8">
        <p className="text-foreground/50 text-xs mb-4" style={{ fontWeight: 300 }}>
          Depois de ler o conteúdo de hoje
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setGuiltAfter(n)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${
                guiltAfter === n
                  ? "border-secondary bg-secondary/15 text-secondary"
                  : "border-white/10 bg-white/[0.06] text-foreground/60"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-sm mx-auto w-full mb-8">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações do meu Dia 1..."
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-4 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-secondary/40 transition-colors resize-none"
          style={{ minHeight: "80px", fontWeight: 400 }}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={!legSensation}
        className={`w-full max-w-xs mx-auto py-4 rounded-3xl font-medium text-sm transition-all ${
          legSensation
            ? "gradient-primary text-foreground"
            : "bg-white/10 text-foreground/30 cursor-not-allowed"
        }`}
      >
        Salvar meu Dia 1
      </button>
    </div>
  );
};

export default Day1ClosingPublic;
