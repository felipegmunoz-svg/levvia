import { useState } from "react";

interface DiaryReflectionProps {
  dayNumber: number;
  onSave?: (data: DiaryData) => void;
}

export interface DiaryData {
  legSensation: string;
  energyLevel: number;
  notes: string;
}

const LEG_OPTIONS = [
  { value: "muito_pesadas", label: "Muito pesadas" },
  { value: "um_pouco_pesadas", label: "Um pouco pesadas" },
  { value: "neutras", label: "Neutras" },
  { value: "um_pouco_mais_leves", label: "Um pouco mais leves" },
  { value: "muito_mais_leves", label: "Muito mais leves" },
];

const DiaryReflection = ({ dayNumber, onSave }: DiaryReflectionProps) => {
  const [legSensation, setLegSensation] = useState("");
  const [energyLevel, setEnergyLevel] = useState(0);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    onSave?.({ legSensation, energyLevel, notes });
  };

  return (
    <div className="space-y-5">
      {/* Leg sensation */}
      <div>
        <label className="text-[13px] font-medium text-levvia-fg font-body block mb-2">
          Como suas pernas se sentem hoje?
        </label>
        <select
          value={legSensation}
          onChange={(e) => setLegSensation(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-levvia-border bg-white text-[13px] font-body text-levvia-fg focus:border-levvia-primary focus:outline-none"
        >
          <option value="">Selecione...</option>
          {LEG_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
        disabled={!legSensation || energyLevel === 0}
        className="w-full py-3 rounded-xl bg-levvia-primary text-white font-medium text-[13px] font-body disabled:opacity-40 transition-opacity"
      >
        Salvar Reflexão
      </button>
    </div>
  );
};

export default DiaryReflection;
