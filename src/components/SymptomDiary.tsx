import { useState, useEffect } from "react";
import { Heart, Frown, Meh, Smile, SmilePlus, Angry, Droplets, Save, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const moods = [
  { value: "Muito mal", icon: Angry, color: "text-destructive" },
  { value: "Mal", icon: Frown, color: "text-accent" },
  { value: "Neutro", icon: Meh, color: "text-muted-foreground" },
  { value: "Bem", icon: Smile, color: "text-secondary" },
  { value: "Muito bem", icon: SmilePlus, color: "text-success" },
];

const swellingOptions = ["Nenhum", "Leve", "Moderado", "Intenso"];

const SymptomDiary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [painLevel, setPainLevel] = useState(0);
  const [swelling, setSwelling] = useState("Nenhum");
  const [mood, setMood] = useState("Neutro");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [hasTodayEntry, setHasTodayEntry] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Load today's entry
  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      const { data } = await supabase
        .from("symptom_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      if (data) {
        setPainLevel(data.pain_level);
        setSwelling(data.swelling || "Nenhum");
        setMood(data.mood || "Neutro");
        setNotes(data.notes || "");
        setHasTodayEntry(true);
      }
    };
    load();
  }, [user?.id, today]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);

    const entry = {
      user_id: user.id,
      date: today,
      pain_level: painLevel,
      swelling,
      mood,
      notes,
    };

    if (hasTodayEntry) {
      await supabase
        .from("symptom_entries")
        .update({ pain_level: painLevel, swelling, mood, notes })
        .eq("user_id", user.id)
        .eq("date", today);
    } else {
      await supabase.from("symptom_entries").insert(entry);
      setHasTodayEntry(true);
    }

    setSaving(false);
    toast({ title: "Diário salvo!", description: "Seus sintomas de hoje foram registrados." });
  };

  const painColor = painLevel <= 3 ? "text-success" : painLevel <= 6 ? "text-accent" : "text-destructive";

  return (
    <section className="mx-5 mt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full glass-card p-4 flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center">
          <Heart size={18} strokeWidth={1.5} className="text-accent" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-sm font-medium text-foreground">Diário de Sintomas</h3>
          <p className="text-xs text-muted-foreground">
            {hasTodayEntry ? "Registro de hoje salvo ✓" : "Como você está hoje?"}
          </p>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={16} className="text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 mt-2 space-y-5">
              {/* Pain level slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Nível de dor</span>
                  <span className={`text-lg font-light ${painColor}`}>{painLevel}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full accent-secondary h-1.5"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">Sem dor</span>
                  <span className="text-[10px] text-muted-foreground">Dor intensa</span>
                </div>
              </div>

              {/* Swelling */}
              <div>
                <span className="text-sm font-medium text-foreground mb-2 block">Inchaço</span>
                <div className="flex gap-2">
                  {swellingOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSwelling(opt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                        swelling === opt
                          ? "bg-secondary/20 text-secondary border border-secondary/30"
                          : "bg-white/[0.06] text-muted-foreground border border-white/[0.08]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div>
                <span className="text-sm font-medium text-foreground mb-2 block">Humor</span>
                <div className="flex justify-between gap-2">
                  {moods.map((m) => {
                    const Icon = m.icon;
                    const isSelected = mood === m.value;
                    return (
                      <button
                        key={m.value}
                        onClick={() => setMood(m.value)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl flex-1 transition-all ${
                          isSelected
                            ? "bg-white/[0.1] border border-secondary/30"
                            : "border border-transparent"
                        }`}
                      >
                        <Icon
                          size={22}
                          strokeWidth={1.5}
                          className={isSelected ? m.color : "text-muted-foreground"}
                        />
                        <span className={`text-[9px] ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                          {m.value}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <span className="text-sm font-medium text-foreground mb-2 block">Observações</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Como você se sentiu hoje? (opcional)"
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:border-secondary/30"
                />
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 rounded-3xl gradient-primary text-foreground font-medium text-sm flex items-center justify-center gap-2"
              >
                <Save size={16} strokeWidth={1.5} />
                {saving ? "Salvando..." : hasTodayEntry ? "Atualizar registro" : "Salvar registro"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SymptomDiary;
