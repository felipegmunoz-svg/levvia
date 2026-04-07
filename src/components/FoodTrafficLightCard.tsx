import { useState } from "react";
import { X, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/lib/profileEngine";

interface FoodTrafficLightCardProps {
  profile: UserProfile;
}

const FoodTrafficLightCard = ({ profile }: FoodTrafficLightCardProps) => {
  const [showModal, setShowModal] = useState(false);

  const greenFoods = (Array.isArray(profile.antiInflammatoryAllies) ? profile.antiInflammatoryAllies : []) || [];
  const yellowFoods = (Array.isArray(profile.dietaryPreferences) ? profile.dietaryPreferences : []) || [];
  const redFoods = (Array.isArray(profile.inflammatoryEnemies) ? profile.inflammatoryEnemies : []) || [];

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="glass-card p-3 flex-1 text-left transition-all hover:border-secondary/30 active:scale-[0.98]"
      >
        {/* Traffic light bars preview */}
        <div className="space-y-1.5 mb-2 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <p className="text-[9px] text-muted-foreground truncate">
              {greenFoods.slice(0, 2).join(", ") || "—"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <p className="text-[9px] text-muted-foreground truncate">
              {yellowFoods.slice(0, 2).join(", ") || "—"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
            <p className="text-[9px] text-muted-foreground truncate">
              {redFoods.slice(0, 2).join(", ") || "—"}
            </p>
          </div>
        </div>
        <p className="text-xs font-medium text-foreground leading-tight mt-3">Seu Semáforo</p>
        <p className="text-[10px] text-secondary mt-0.5">Alimentar</p>
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
              className="glass-card p-6 max-w-sm w-full relative max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              <div className="flex items-center gap-2 mb-5">
                <Leaf size={20} className="text-emerald-400" />
                <h3 className="text-base font-medium text-foreground">Seu Semáforo Alimentar</h3>
              </div>

              {/* Green */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">Aliados (consuma à vontade)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {greenFoods.length > 0 ? greenFoods.map((food) => (
                    <span key={food} className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-400/15 text-emerald-300">
                      {food}
                    </span>
                  )) : (
                    <span className="text-xs text-muted-foreground">Complete o onboarding para personalizar</span>
                  )}
                </div>
              </div>

              {/* Yellow */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="text-sm font-medium text-amber-400">Atenção (com moderação)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {yellowFoods.length > 0 ? yellowFoods.map((food) => (
                    <span key={food} className="px-2 py-0.5 text-[10px] rounded-full bg-amber-400/15 text-amber-300">
                      {food}
                    </span>
                  )) : (
                    <span className="text-xs text-muted-foreground">Nenhuma preferência registrada</span>
                  )}
                </div>
              </div>

              {/* Red */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="text-sm font-medium text-red-400">Evitar (inflamatórios)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {redFoods.length > 0 ? redFoods.map((food) => (
                    <span key={food} className="px-2 py-0.5 text-[10px] rounded-full bg-red-400/15 text-red-300">
                      {food}
                    </span>
                  )) : (
                    <span className="text-xs text-muted-foreground">Nenhum inimigo registrado</span>
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

export default FoodTrafficLightCard;
