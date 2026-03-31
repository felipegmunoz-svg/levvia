import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Activity, BookOpen, type LucideIcon } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useChallengeData } from "@/hooks/useChallengeData";
import logoIcon from "@/assets/logo_livvia_azul_icone.png";

const History = () => {
  const navigate = useNavigate();
  const { currentDay, challengeProgress, allExercises, filteredRecipes, allHabits } = useChallengeData();

  // Count unlocked items based on completed days
  const unlockedCounts = useMemo(() => {
    let recipes = 0;
    let exercises = 0;
    let knowledge = 0;

    for (let day = 1; day <= currentDay; day++) {
      const dayProgress = challengeProgress[day] || {};
      const hasAnyProgress = Object.values(dayProgress).some(Boolean);
      if (hasAnyProgress || day <= currentDay) {
        // Count 2 exercises per day, 5 meals per day as approximation
        exercises += 2;
        recipes += 5;
        knowledge += 1;
      }
    }

    return {
      recipes: Math.min(recipes, filteredRecipes.length),
      exercises: Math.min(exercises, allExercises.length),
      knowledge: Math.min(knowledge, currentDay),
    };
  }, [currentDay, challengeProgress, allExercises, filteredRecipes]);

  const cards: { Icon: LucideIcon; title: string; subtitle: string; path: string }[] = [
    {
      Icon: Leaf,
      title: "Receitas",
      subtitle: `${unlockedCounts.recipes} receitas desbloqueadas`,
      path: "/history/recipes",
    },
    {
      Icon: Activity,
      title: "Exercícios",
      subtitle: `${unlockedCounts.exercises} práticas desbloqueadas`,
      path: "/history/exercises",
    },
    {
      Icon: BookOpen,
      title: "Conhecimento",
      subtitle: `${unlockedCounts.knowledge} pílulas desbloqueadas`,
      path: "/history/knowledge",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="gradient-page px-6 pt-10 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-1">
          <img src={logoIcon} alt="Levvia" className="w-8 h-auto" />
          <p className="text-muted-foreground text-sm font-medium">Seu histórico</p>
        </div>
        <h1 className="text-2xl font-light text-foreground mt-1">Histórico</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Tudo que você desbloqueou na sua jornada
        </p>
      </header>

      <main className="px-5 mt-6 space-y-4">
        {cards.map((card, i) => (
          <motion.button
            key={card.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(card.path)}
            className="glass-card p-5 w-full text-left flex items-center gap-4 transition-all hover:border-secondary/30 active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <card.Icon size={18} className="text-secondary" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-medium text-foreground">{card.title}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{card.subtitle}</p>
            </div>
            <div className="text-muted-foreground">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </motion.button>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default History;
