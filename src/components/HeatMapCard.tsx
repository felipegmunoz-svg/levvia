import { useState } from "react";
import { Flame, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/lib/profileEngine";

const bodyAreas = [
  { id: "Coxas", label: "Coxas", top: "55%", left: "35%" },
  { id: "Coxas", label: "Coxas", top: "55%", left: "65%" },
  { id: "Quadris", label: "Quadris", top: "45%", left: "50%" },
  { id: "Panturrilhas", label: "Panturrilhas", top: "72%", left: "38%" },
  { id: "Panturrilhas", label: "Panturrilhas", top: "72%", left: "62%" },
  { id: "Braços", label: "Braços", top: "32%", left: "22%" },
  { id: "Braços", label: "Braços", top: "32%", left: "78%" },
  { id: "Tornozelos", label: "Tornozelos", top: "85%", left: "40%" },
  { id: "Tornozelos", label: "Tornozelos", top: "85%", left: "60%" },
  { id: "Joelhos", label: "Joelhos", top: "62%", left: "40%" },
  { id: "Joelhos", label: "Joelhos", top: "62%", left: "60%" },
];

const painLevelToColor: Record<string, string> = {
  "Sem dor": "bg-success/40",
  "Dor leve": "bg-accent/50",
  "Dor moderada": "bg-accent/80",
  "Dor intensa": "bg-destructive/70",
  "Dor muito intensa": "bg-destructive",
};

const painLevelToProfileName: Record<string, string> = {
  "Sem dor": "Brisa Suave",
  "Dor leve": "Chama Branda",
  "Dor moderada": "Fogo Crescente",
  "Dor intensa": "Fogo Ardente",
  "Dor muito intensa": "Vulcão Interior",
};

interface HeatMapCardProps {
  profile: UserProfile;
}

const HeatMapCard = ({ profile }: HeatMapCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const profileName = painLevelToProfileName[profile.painLevel] || "Fogo Interno";
  const dotColor = painLevelToColor[profile.painLevel] || "bg-accent/50";

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="glass-card p-3 flex-1 text-left transition-all hover:border-secondary/30 active:scale-[0.98]"
      >
        {/* Mini body silhouette */}
        <div className="relative w-full h-20 mb-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-8 h-16">
              {/* Simple body outline */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-white/20" />
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-6 rounded-sm border border-white/20" />
              <div className="absolute top-9 left-0 w-1.5 h-5 rounded-sm border border-white/20" />
              <div className="absolute top-9 right-0 w-1.5 h-5 rounded-sm border border-white/20" />
              {/* Affected area dots */}
              {profile.affectedAreas.map((area, i) => {
                const positions = bodyAreas.filter((b) => b.id === area);
                return positions.map((pos, j) => (
                  <div
                    key={`${area}-${i}-${j}`}
                    className={`absolute w-2 h-2 rounded-full ${dotColor} animate-pulse`}
                    style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -50%)" }}
                  />
                ));
              })}
            </div>
          </div>
        </div>
        <p className="text-xs font-medium text-foreground leading-tight">Seu Fogo Interno</p>
        <p className="text-[10px] text-secondary mt-0.5">{profileName}</p>
      </button>

      {/* Full modal */}
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
              className="glass-card p-6 max-w-sm w-full relative"
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
                <p className="text-xs text-muted-foreground mt-2">Nível de dor: {profile.painLevel}</p>
              </div>

              {/* Full body map */}
              <div className="relative w-full h-48 mb-4 mx-auto max-w-[200px]">
                {/* Body outline */}
                <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-white/20" />
                <div className="absolute top-[24%] left-1/2 -translate-x-1/2 w-12 h-16 rounded-lg border border-white/20" />
                <div className="absolute top-[24%] left-[15%] w-3 h-14 rounded-lg border border-white/20" />
                <div className="absolute top-[24%] right-[15%] w-3 h-14 rounded-lg border border-white/20" />
                <div className="absolute top-[60%] left-[32%] w-4 h-14 rounded-lg border border-white/20" />
                <div className="absolute top-[60%] right-[32%] w-4 h-14 rounded-lg border border-white/20" />

                {/* Heat dots on affected areas */}
                {bodyAreas.map((area, i) => {
                  const isAffected = profile.affectedAreas.includes(area.id);
                  if (!isAffected) return null;
                  return (
                    <div
                      key={i}
                      className={`absolute w-4 h-4 rounded-full ${dotColor} animate-pulse`}
                      style={{ top: area.top, left: area.left, transform: "translate(-50%, -50%)" }}
                      title={area.label}
                    />
                  );
                })}
              </div>

              {/* Affected areas list */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-foreground">Áreas afetadas:</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.affectedAreas.length > 0 ? (
                    profile.affectedAreas.map((area) => (
                      <span
                        key={area}
                        className="px-2 py-0.5 text-[10px] rounded-full bg-destructive/20 text-destructive"
                      >
                        {area}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Nenhuma área registrada</span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeatMapCard;
