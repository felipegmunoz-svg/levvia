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
  { type: "pain", emoji: "🔴", label: "Dor", color: "rgba(239,68,68,0.7)" },
  { type: "swelling", emoji: "🟡", label: "Inchaço", color: "rgba(245,158,11,0.7)" },
  { type: "fatigue", emoji: "🔵", label: "Peso", color: "rgba(59,130,246,0.7)" },
  { type: "sensitivity", emoji: "🟣", label: "Sensibilidade", color: "rgba(168,85,247,0.7)" },
];

const emojiCenters: Record<AreaId, { x: number; y: number }> = {
  braco_esq: { x: 46, y: 150 },
  braco_dir: { x: 174, y: 150 },
  abdomen: { x: 110, y: 130 },
  quadril_esq: { x: 82, y: 198 },
  quadril_dir: { x: 138, y: 198 },
  coxa_esq: { x: 82, y: 267 },
  coxa_dir: { x: 138, y: 267 },
  panturrilha_esq: { x: 80, y: 354 },
  panturrilha_dir: { x: 140, y: 354 },
};

const BASE_FILL = "rgba(237,242,247,0.08)";
const STROKE = "rgba(237,242,247,0.3)";

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

  const getAreaFill = (area: AreaId): string => {
    const marks = markedAreas.filter((m) => m.area === area);
    if (marks.length === 0) return BASE_FILL;
    const lastMark = marks[marks.length - 1];
    return tools.find((t) => t.type === lastMark.type)?.color || BASE_FILL;
  };

  const getAreaEmojis = (area: AreaId): string => {
    const marks = markedAreas.filter((m) => m.area === area);
    return marks.map((m) => tools.find((t) => t.type === m.type)?.emoji || "").join("");
  };

  const hasMarks = markedAreas.length > 0;

  const handleSave = () => {
    onComplete({
      markedAreas,
      notes,
      createdAt: new Date().toISOString(),
    });
  };

  // --- Notes screen ---
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
                  maxLength={200}
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

  // --- SVG map screen ---
  const areaPath = (area: AreaId, d: string) => (
    <path
      key={area}
      d={d}
      fill={getAreaFill(area)}
      stroke={STROKE}
      strokeWidth="1"
      onClick={() => toggleArea(area)}
      className="cursor-pointer transition-all duration-200"
    />
  );

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
        Ontem você mapeou onde. Hoje vamos entender <em>como</em>.
      </motion.h2>

      <p className="text-foreground/60 text-center mb-4 max-w-sm text-sm" style={{ fontWeight: 300 }}>
        Escolha a ferramenta e toque nas áreas do corpo.
      </p>

      {/* Tool selector */}
      <div className="flex gap-2 mb-6 flex-wrap justify-center">
        {tools.map((t) => (
          <motion.button
            key={t.type}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentTool(t.type)}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-all border ${
              currentTool === t.type
                ? "border-secondary bg-secondary/15 text-secondary"
                : "border-white/10 bg-white/[0.06] text-foreground/70"
            }`}
          >
            {t.emoji} {t.label}
          </motion.button>
        ))}
      </div>

      {/* SVG silhouette */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative w-[200px] max-w-full"
        style={{ height: "380px" }}
      >
        <svg viewBox="0 0 220 440" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Decorative (non-interactive) */}
          <ellipse cx="110" cy="38" rx="20" ry="25" fill="rgba(237,242,247,0.12)" stroke={STROKE} strokeWidth="1.2" />
          <rect x="102" y="58" width="16" height="18" rx="4" fill="rgba(237,242,247,0.12)" stroke={STROKE} strokeWidth="1.2" />
          <ellipse cx="40" cy="225" rx="8" ry="10" fill="rgba(237,242,247,0.12)" stroke={STROKE} strokeWidth="1" />
          <ellipse cx="180" cy="225" rx="8" ry="10" fill="rgba(237,242,247,0.12)" stroke={STROKE} strokeWidth="1" />
          <path d="M68 390 Q66 400 64 406 Q62 412 66 414 L90 414 Q94 412 94 406 Q94 400 92 390 Z" fill="rgba(237,242,247,0.12)" stroke={STROKE} strokeWidth="1" />
          <path d="M128 390 Q126 400 126 406 Q126 412 130 414 L154 414 Q158 412 156 406 Q156 400 152 390 Z" fill="rgba(237,242,247,0.12)" stroke={STROKE} strokeWidth="1" />

          {/* Interactive areas */}
          {areaPath("braco_esq", "M68 78 Q56 84 48 100 Q42 116 38 140 Q34 165 34 190 Q33 205 36 215 L52 215 Q54 205 54 190 Q54 165 58 140 Q62 116 66 100 Q70 90 78 82 Z")}
          {areaPath("braco_dir", "M152 78 Q164 84 172 100 Q178 116 182 140 Q186 165 186 190 Q187 205 184 215 L168 215 Q166 205 166 190 Q166 165 162 140 Q158 116 154 100 Q150 90 142 82 Z")}
          {areaPath("abdomen", "M78 76 Q90 74 110 74 Q130 74 142 76 Q150 80 154 90 Q158 100 158 110 Q156 130 152 145 Q148 158 142 170 Q136 178 130 180 L90 180 Q84 178 78 170 Q72 158 68 145 Q64 130 62 110 Q62 100 66 90 Q70 80 78 76 Z")}
          {areaPath("quadril_esq", "M90 180 Q84 182 78 186 Q70 192 66 200 Q62 208 60 216 L104 216 L104 200 Q102 192 98 186 Q96 182 90 180 Z")}
          {areaPath("quadril_dir", "M130 180 Q136 182 142 186 Q150 192 154 200 Q158 208 160 216 L116 216 L116 200 Q118 192 122 186 Q124 182 130 180 Z")}
          {areaPath("coxa_esq", "M60 216 L104 216 L100 310 Q98 316 94 318 L70 318 Q66 316 64 310 Z")}
          {areaPath("coxa_dir", "M116 216 L160 216 L156 310 Q154 316 150 318 L126 318 Q122 316 120 310 Z")}
          {areaPath("panturrilha_esq", "M70 318 L94 318 Q96 340 96 355 Q96 370 94 380 Q92 388 90 390 L70 390 Q68 388 66 380 Q64 370 64 355 Q64 340 66 318 Z")}
          {areaPath("panturrilha_dir", "M126 318 L150 318 Q152 340 156 355 Q156 370 154 380 Q152 388 150 390 L130 390 Q128 388 126 380 Q124 370 124 355 Q124 340 126 318 Z")}

          {/* Emoji overlays */}
          {(Object.keys(emojiCenters) as AreaId[]).map((area) => {
            const emojis = getAreaEmojis(area);
            if (!emojis) return null;
            const { x, y } = emojiCenters[area];
            return (
              <text
                key={`emoji-${area}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12"
                className="pointer-events-none select-none"
              >
                {emojis}
              </text>
            );
          })}
        </svg>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 mb-2 flex-wrap justify-center">
        {tools.map((t) => (
          <span key={t.type} className="flex items-center gap-1.5 text-xs text-foreground/70">
            <span className="text-sm">{t.emoji}</span> {t.label}
          </span>
        ))}
      </div>

      <p className="text-foreground/40 text-xs text-center mb-6 italic">
        {hasMarks
          ? `${markedAreas.length} marcação(ões) feita(s)`
          : "Toque nas áreas onde sente desconforto"}
      </p>

      <button
        onClick={() => (hasMarks ? setShowNotes(true) : undefined)}
        disabled={!hasMarks}
        className={`w-full max-w-xs py-4 rounded-3xl font-medium text-sm transition-all ${
          hasMarks
            ? "gradient-primary text-foreground"
            : "bg-white/10 text-foreground/30 cursor-not-allowed"
        }`}
      >
        {hasMarks ? "Adicionar Notas →" : "Marque pelo menos 1 área"}
      </button>
    </div>
  );
};

export default Day2InflammationMap;
