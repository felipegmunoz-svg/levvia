import { useState } from "react";
import { motion } from "framer-motion";

type ToolType = "pain" | "swelling" | "fatigue" | "sensitivity";

type AreaId =
  | "panturrilha_esq"
  | "panturrilha_dir"
  | "coxa_esq"
  | "coxa_dir"
  | "quadril_esq"
  | "quadril_dir"
  | "abdomen"
  | "braco_esq"
  | "braco_dir";

interface AreaMark {
  area: AreaId;
  type: ToolType;
}

interface Day2InflammationMapProps {
  onComplete: (mapData: {
    markedAreas: AreaMark[];
    notes: Record<string, string>;
    createdAt: string;
  }) => void;
}

const areaLabels: Record<AreaId, string> = {
  panturrilha_esq: "Panturrilha E",
  panturrilha_dir: "Panturrilha D",
  coxa_esq: "Coxa E",
  coxa_dir: "Coxa D",
  quadril_esq: "Quadril E",
  quadril_dir: "Quadril D",
  abdomen: "Abdômen",
  braco_esq: "Braço E",
  braco_dir: "Braço D",
};

const tools: { type: ToolType; emoji: string; label: string; color: string }[] = [
  { type: "pain", emoji: "🔴", label: "Dor", color: "rgba(220,38,38,0.7)" },
  { type: "swelling", emoji: "🟡", label: "Inchaço", color: "rgba(234,179,8,0.7)" },
  { type: "fatigue", emoji: "🔵", label: "Peso", color: "rgba(59,130,246,0.7)" },
  { type: "sensitivity", emoji: "🟣", label: "Sensibilidade", color: "rgba(147,51,234,0.7)" },
];

const allAreas: AreaId[] = [
  "braco_esq", "braco_dir", "abdomen",
  "quadril_esq", "quadril_dir",
  "coxa_esq", "coxa_dir",
  "panturrilha_esq", "panturrilha_dir",
];

const Day2InflammationMap = ({ onComplete }: Day2InflammationMapProps) => {
  const [currentTool, setCurrentTool] = useState<ToolType>("pain");
  const [markedAreas, setMarkedAreas] = useState<AreaMark[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showNotes, setShowNotes] = useState(false);

  const isMarked = (area: AreaId, type: ToolType) =>
    markedAreas.some((m) => m.area === area && m.type === type);

  const toggleArea = (area: AreaId) => {
    if (isMarked(area, currentTool)) {
      setMarkedAreas(markedAreas.filter((m) => !(m.area === area && m.type === currentTool)));
    } else {
      setMarkedAreas([...markedAreas, { area, type: currentTool }]);
    }
  };

  const getAreaColor = (area: AreaId): string => {
    const marks = markedAreas.filter((m) => m.area === area);
    if (marks.length === 0) return "rgba(237,242,247,0.08)";
    // Use the color of the most recently added tool for that area
    const lastMark = marks[marks.length - 1];
    return tools.find((t) => t.type === lastMark.type)?.color || "rgba(237,242,247,0.08)";
  };

  const getAreaMarks = (area: AreaId): string => {
    const marks = markedAreas.filter((m) => m.area === area);
    return marks.map((m) => tools.find((t) => t.type === m.type)?.emoji || "").join("");
  };

  const handleSave = () => {
    const mapData = {
      markedAreas,
      notes,
      createdAt: new Date().toISOString(),
    };
    console.log("💾 Salvando Mapa da Inflamação:", mapData);
    onComplete(mapData);
  };

  if (showNotes) {
    const uniqueAreas = [...new Set(markedAreas.map((m) => m.area))];
    return (
      <div className="min-h-screen bg-background flex flex-col items-center px-6 py-10">
        <h2 className="text-foreground text-center mb-2" style={{ fontWeight: 500, fontSize: "1.1rem" }}>
          📝 Descreva Suas Sensações
        </h2>
        <p className="text-foreground/60 text-center mb-6 text-sm">
          Opcional: adicione notas para cada área marcada.
        </p>

        <div className="w-full max-w-sm space-y-4 mb-8">
          {uniqueAreas.map((area) => {
            const areaMarks = markedAreas.filter((m) => m.area === area);
            return (
              <div key={area} className="glass-card p-4">
                <p className="text-foreground text-sm font-medium mb-1">
                  {areaLabels[area]} {areaMarks.map((m) => tools.find((t) => t.type === m.type)?.emoji).join(" ")}
                </p>
                <textarea
                  value={notes[area] || ""}
                  onChange={(e) => setNotes({ ...notes, [area]: e.target.value })}
                  placeholder="Como você sente essa área..."
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-3 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-secondary/40 transition-colors resize-none"
                  style={{ minHeight: "60px" }}
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSave}
          className="w-full max-w-xs py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm"
        >
          Salvar Meu Mapa →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-10">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-secondary text-center mb-2 tracking-[0.2em]"
        style={{ fontWeight: 500, fontSize: "0.75rem" }}
      >
        MAPA DA INFLAMAÇÃO
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-foreground text-center mb-2"
        style={{ fontWeight: 500, fontSize: "1.1rem" }}
      >
        ✍️ Onde a inflamação se manifesta?
      </motion.h2>

      <p className="text-foreground/60 text-center mb-4 max-w-sm text-sm" style={{ fontWeight: 300 }}>
        Selecione uma ferramenta e toque nas áreas do corpo. Este mapa será sua bússola para os próximos dias.
      </p>

      {/* Tool selector */}
      <div className="flex gap-2 mb-6 flex-wrap justify-center">
        {tools.map((t) => (
          <button
            key={t.type}
            onClick={() => setCurrentTool(t.type)}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-all border ${
              currentTool === t.type
                ? "border-secondary bg-secondary/15 text-secondary"
                : "border-white/10 bg-white/[0.06] text-foreground/70"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Body grid */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-xs mb-6">
        {allAreas.map((area) => (
          <button
            key={area}
            onClick={() => toggleArea(area)}
            className={`p-3 rounded-xl text-xs font-medium transition-all border text-center ${
              markedAreas.some((m) => m.area === area)
                ? "border-secondary/50 bg-secondary/10"
                : "border-white/10 bg-white/[0.06]"
            }`}
          >
            <span className="text-foreground/80 block">{areaLabels[area]}</span>
            {getAreaMarks(area) && (
              <span className="text-sm mt-1 block">{getAreaMarks(area)}</span>
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <p className="text-foreground/40 text-xs text-center mb-6 italic">
        {markedAreas.length === 0
          ? "Toque nas áreas onde sente desconforto"
          : `${markedAreas.length} marcação(ões) feita(s)`}
      </p>

      <button
        onClick={() => {
          if (markedAreas.length > 0) setShowNotes(true);
          else handleSave();
        }}
        disabled={markedAreas.length === 0}
        className={`w-full max-w-xs py-4 rounded-3xl font-medium text-sm transition-all ${
          markedAreas.length > 0
            ? "gradient-primary text-foreground"
            : "bg-white/10 text-foreground/30 cursor-not-allowed"
        }`}
      >
        {markedAreas.length > 0 ? "Adicionar Notas →" : "Marque pelo menos 1 área"}
      </button>
    </div>
  );
};

export default Day2InflammationMap;
