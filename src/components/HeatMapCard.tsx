import { useState } from "react";
import { Flame, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/lib/profileEngine";

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

const intensityColors: Record<number, string> = {
  0: "rgba(140,160,180,0.15)",
  1: "rgba(244,165,53,0.4)",
  2: "rgba(244,165,53,0.75)",
  3: "rgba(198,40,40,0.85)",
};

const intensityLabelColors: Record<number, string> = {
  1: "bg-[rgba(244,165,53,0.4)]",
  2: "bg-[rgba(244,165,53,0.75)]",
  3: "bg-[rgba(198,40,40,0.85)]",
};

function getFireProfile(heatMap: Record<string, number>): string {
  const sum = Object.values(heatMap).reduce((a, b) => a + b, 0);
  if (sum <= 4) return "Brisa Leve";
  if (sum <= 9) return "Chamas Moderadas";
  if (sum <= 14) return "Incêndio Crescente";
  return "Fogo Ardente";
}

function getAffectedAreas(heatMap: Record<string, number>): { id: AreaId; label: string; intensity: number }[] {
  return Object.entries(heatMap)
    .filter(([key, val]) => val > 0 && key in areaLabels)
    .map(([key, val]) => ({
      id: key as AreaId,
      label: areaLabels[key as AreaId],
      intensity: val,
    }));
}

interface BodySilhouetteSvgProps {
  heatMap: Record<string, number>;
  className?: string;
}

const BodySilhouetteSvg = ({ heatMap, className }: BodySilhouetteSvgProps) => {
  const fill = (id: AreaId) => intensityColors[heatMap[id] || 0];
  const stroke = "rgba(140,160,180,0.4)";

  return (
    <svg viewBox="0 0 220 440" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Decorative (non-clickable) */}
      <ellipse cx="110" cy="38" rx="20" ry="25" fill="rgba(140,160,180,0.15)" stroke={stroke} strokeWidth="1.2" />
      <rect x="102" y="58" width="16" height="18" rx="4" fill="rgba(140,160,180,0.15)" stroke={stroke} strokeWidth="1.2" />
      <ellipse cx="40" cy="225" rx="8" ry="10" fill="rgba(140,160,180,0.15)" stroke={stroke} strokeWidth="1" />
      <ellipse cx="180" cy="225" rx="8" ry="10" fill="rgba(140,160,180,0.15)" stroke={stroke} strokeWidth="1" />
      <path d="M68 390 Q66 400 64 406 Q62 412 66 414 L90 414 Q94 412 94 406 Q94 400 92 390 Z" fill="rgba(140,160,180,0.15)" stroke={stroke} strokeWidth="1" />
      <path d="M128 390 Q126 400 126 406 Q126 412 130 414 L154 414 Q158 412 156 406 Q156 400 152 390 Z" fill="rgba(140,160,180,0.15)" stroke={stroke} strokeWidth="1" />

      {/* Left Arm */}
      <path d="M68 78 Q56 84 48 100 Q42 116 38 140 Q34 165 34 190 Q33 205 36 215 L52 215 Q54 205 54 190 Q54 165 58 140 Q62 116 66 100 Q70 90 78 82 Z" fill={fill("braco_esq")} stroke={stroke} strokeWidth="1" />
      {/* Right Arm */}
      <path d="M152 78 Q164 84 172 100 Q178 116 182 140 Q186 165 186 190 Q187 205 184 215 L168 215 Q166 205 166 190 Q166 165 162 140 Q158 116 154 100 Q150 90 142 82 Z" fill={fill("braco_dir")} stroke={stroke} strokeWidth="1" />
      {/* Abdomen */}
      <path d="M78 76 Q90 74 110 74 Q130 74 142 76 Q150 80 154 90 Q158 100 158 110 Q156 130 152 145 Q148 158 142 170 Q136 178 130 180 L90 180 Q84 178 78 170 Q72 158 68 145 Q64 130 62 110 Q62 100 66 90 Q70 80 78 76 Z" fill={fill("abdomen")} stroke={stroke} strokeWidth="1" />
      {/* Left Hip */}
      <path d="M90 180 Q84 182 78 186 Q70 192 66 200 Q62 208 60 216 L104 216 L104 200 Q102 192 98 186 Q96 182 90 180 Z" fill={fill("quadril_esq")} stroke={stroke} strokeWidth="1" />
      {/* Right Hip */}
      <path d="M130 180 Q136 182 142 186 Q150 192 154 200 Q158 208 160 216 L116 216 L116 200 Q118 192 122 186 Q124 182 130 180 Z" fill={fill("quadril_dir")} stroke={stroke} strokeWidth="1" />
      {/* Left Thigh */}
      <path d="M60 216 L104 216 L100 310 Q98 316 94 318 L70 318 Q66 316 64 310 Z" fill={fill("coxa_esq")} stroke={stroke} strokeWidth="1" />
      {/* Right Thigh */}
      <path d="M116 216 L160 216 L156 310 Q154 316 150 318 L126 318 Q122 316 120 310 Z" fill={fill("coxa_dir")} stroke={stroke} strokeWidth="1" />
      {/* Left Calf */}
      <path d="M70 318 L94 318 Q96 340 96 355 Q96 370 94 380 Q92 388 90 390 L70 390 Q68 388 66 380 Q64 370 64 355 Q64 340 66 318 Z" fill={fill("panturrilha_esq")} stroke={stroke} strokeWidth="1" />
      {/* Right Calf */}
      <path d="M126 318 L150 318 Q152 340 156 355 Q156 370 154 380 Q152 388 150 390 L130 390 Q128 388 126 380 Q124 370 124 355 Q124 340 126 318 Z" fill={fill("panturrilha_dir")} stroke={stroke} strokeWidth="1" />
    </svg>
  );
};

interface HeatMapCardProps {
  profile: UserProfile;
}

const HeatMapCard = ({ profile }: HeatMapCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const heatMap = profile.heatMapDay1 || {};
  const profileName = getFireProfile(heatMap);
  const affected = getAffectedAreas(heatMap);
  const hasData = affected.length > 0;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="glass-card p-3 flex-1 text-left transition-all hover:border-secondary/30 active:scale-[0.98]"
      >
        <div className="relative w-full h-20 mb-2 flex items-center justify-center">
          <BodySilhouetteSvg heatMap={heatMap} className="h-full w-auto" />
        </div>
        <p className="text-xs font-medium text-foreground leading-tight">Seu Fogo Interno</p>
        <p className="text-[10px] text-secondary mt-0.5">{profileName}</p>
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-sm w-full relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Flame size={20} className="text-accent" />
                <h3 className="text-base font-medium text-foreground">Seu Fogo Interno</h3>
              </div>

              <div className="text-center mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                  {profileName}
                </span>
              </div>

              {/* Full body map */}
              <div className="flex justify-center mb-4">
                <BodySilhouetteSvg heatMap={heatMap} className="w-[160px] h-auto" />
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="flex items-center gap-1.5 text-[10px] text-foreground/70">
                  <span className={`w-2.5 h-2.5 rounded-full ${intensityLabelColors[1]}`} />
                  Leve
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-foreground/70">
                  <span className={`w-2.5 h-2.5 rounded-full ${intensityLabelColors[2]}`} />
                  Moderado
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-foreground/70">
                  <span className={`w-2.5 h-2.5 rounded-full ${intensityLabelColors[3]}`} />
                  Intenso
                </span>
              </div>

              {/* Affected areas list */}
              <div className="space-y-1.5 mb-4">
                <p className="text-xs font-medium text-foreground">Áreas afetadas:</p>
                <div className="flex flex-wrap gap-1.5">
                  {hasData ? (
                    affected.map((a) => (
                      <span
                        key={a.id}
                        className="px-2 py-0.5 text-[10px] rounded-full bg-destructive/20 text-destructive"
                      >
                        {a.label}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Nenhuma área registrada</span>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground text-center italic">
                Este é o seu mapa do Dia 1. Você poderá compará-lo com mapas futuros para ver sua evolução.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeatMapCard;
