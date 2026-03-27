import { useState } from "react";

interface DiaryReflectionProps {
  dayNumber: number;
  onSave?: (data: DiaryData) => void;
}

export interface DiaryData {
  legSensation: string;
  energyLevel: number;
  lightnessScore: number | null;
  notes: string;
}

const LEG_OPTIONS = [
  { value: "muito_pesadas", label: "Muito pesadas" },
  { value: "um_pouco_pesadas", label: "Um pouco pesadas" },
  { value: "neutras", label: "Neutras" },
  { value: "um_pouco_mais_leves", label: "Um pouco mais leves" },
  { value: "muito_mais_leves", label: "Muito mais leves" },
];

const getLightnessColor = (n: number, selected: boolean) => {
  if (!selected) return "bg-muted text-muted-foreground border border-border";
  if (n <= 3) return "bg-red-500 text-white border border-red-500";
  if (n <= 5) return "bg-orange-400 text-white border border-orange-400";
  if (n <= 7) return "bg-yellow-400 text-foreground border border-yellow-400";
  return "bg-primary text-white border border-primary";
};

const DiaryReflection = ({ dayNumber, onSave }: DiaryReflectionProps) => {
  const [legSensation, setLegSensation] = useState("");
  const [energyLevel, setEnergyLevel] = useState(0);
  const [lightnessScore, setLightnessScore] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    onSave?.({ legSensation, energyLevel, lightnessScore, notes });
  };

  return (
    <div className="space-y-5">
      {/* Leg sensation (optional) */}
      <div>
        <label className="text-[13px] font-medium text-levvia-fg font-body block mb-2">
          Como suas pernas se sentem hoje?
        </label>
        <select
          value={legSensation}
          onChange={(e) => setLegSensation(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-levvia-border bg-white text-[13px] font-body text-levvia-fg focus:border-levvia-primary focus:outline-none"
        >
          <option value="">Selecione... (opcional)</option>
          {LEG_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Lightness Scale 1-10 */}
      <div>
        <label className="text-[13px] font-medium text-levvia-fg font-body block mb-1">
          Escala de Leveza
        </label>
        <p className="text-xs text-levvia-muted font-body mb-3">
          1 = Muito pesada/dor &nbsp;|&nbsp; 10 = Leveza total
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              onClick={() => setLightnessScore(n)}
              className={`w-8 h-8 rounded-full text-xs font-medium font-body transition-all ${getLightnessColor(n, lightnessScore === n)}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Energy level */}
      <div>
        <label className="text-[13px] font-medium text-levvia-fg font-body block mb-2">
          Nível de energia:
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setEnergyLevel(level)}
              className={`w-10 h-10 rounded-full border-[1.5px] text-[13px] font-medium font-body transition-all ${
                energyLevel === level
                  ? "border-levvia-primary bg-levvia-primary/10 text-levvia-primary"
                  : "border-gray-200 text-levvia-muted hover:border-levvia-primary/30"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="text-[13px] font-medium text-levvia-fg font-body block mb-2">
          Notas do dia:
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Como você se sentiu hoje? Algo que notou..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-levvia-border bg-white text-[13px] font-body text-levvia-fg placeholder:text-levvia-muted/60 focus:border-levvia-primary focus:outline-none resize-none"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={lightnessScore === null || energyLevel === 0}
        className="w-full py-3 rounded-xl bg-levvia-primary text-white font-medium text-[13px] font-body disabled:opacity-40 transition-opacity"
      >
        Salvar Reflexão
      </button>
    </div>
  );
};

export default DiaryReflection;
