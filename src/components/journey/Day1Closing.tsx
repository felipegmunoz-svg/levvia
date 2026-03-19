import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logoAzul from "@/assets/logo_livvia_azul_icone.png";

interface Day1ClosingProps {
  userId: string;
  onComplete: () => void;
}

const sensations = [
  "Mais pesadas",
  "Iguais a antes",
  "Um pouco mais leves",
  "Muito mais leves",
];

const Day1Closing = ({ userId, onComplete }: Day1ClosingProps) => {
  const navigate = useNavigate();
  const [legSensation, setLegSensation] = useState<string | null>(null);
  const [guiltBefore, setGuiltBefore] = useState<number | null>(null);
  const [guiltAfter, setGuiltAfter] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!legSensation) return;
    setSaving(true);

    // Insert diary entry
    await supabase.from("daily_diary" as any).insert({
      user_id: userId,
      day_number: 1,
      leg_sensation: legSensation,
      guilt_before: guiltBefore,
      guilt_after: guiltAfter,
      notes,
    } as any);

    // Mark day 1 as completed
    await supabase
      .from("profiles")
      .update({
        day1_completed: true,
        day1_completed_at: new Date().toISOString(),
      } as any)
      .eq("id", userId);

    setSaving(false);
    setSaved(true);
  };

  const handleGoToDay2 = () => {
    // Check if it's past midnight (next day)
    const now = new Date();
    const challengeStart = localStorage.getItem("levvia_challenge_start");
    if (challengeStart) {
      const start = new Date(challengeStart);
      const daysSince = Math.floor((now.getTime() - start.getTime()) / 86400000);
      if (daysSince >= 1) {
        onComplete();
        navigate("/today", { replace: true });
        return;
      }
    }
    // Still same day - show gentle message
    alert("Sua jornada continua amanhã. Descanse — você merece.");
    onComplete();
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
          onClick={handleGoToDay2}
          className="w-full max-w-xs py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm"
        >
          Ir para o Dia 2 →
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-10">
      {/* Title */}
      <h2
        className="text-foreground text-center mb-6"
        style={{ fontWeight: 500, fontSize: "1rem" }}
      >
        Como suas pernas se sentiram hoje?
      </h2>

      {/* Sensation grid */}
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

      {/* Guilt before */}
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

      {/* Guilt after */}
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

      {/* Notes */}
      <div className="max-w-sm mx-auto w-full mb-8">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações do meu Dia 1..."
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-4 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-secondary/40 transition-colors resize-none"
          style={{ minHeight: "80px", fontWeight: 400 }}
        />
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!legSensation || saving}
        className={`w-full max-w-xs mx-auto py-4 rounded-3xl font-medium text-sm transition-all ${
          legSensation && !saving
            ? "gradient-primary text-foreground"
            : "bg-white/10 text-foreground/30 cursor-not-allowed"
        }`}
      >
        {saving ? "Salvando..." : "Salvar meu Dia 1"}
      </button>
    </div>
  );
};

export default Day1Closing;
