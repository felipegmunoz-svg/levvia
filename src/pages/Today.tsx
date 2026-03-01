import { useState, useEffect } from "react";
import { Droplets, HeartPulse, Sparkles, Apple } from "lucide-react";
import ChecklistItemCard from "@/components/ChecklistItemCard";
import { dailyChecklist } from "@/data/checklist";
import BottomNav from "@/components/BottomNav";

const categoryIcons: Record<string, React.ReactNode> = {
  hidratacao: <Droplets size={18} className="text-primary" />,
  movimento: <HeartPulse size={18} className="text-primary" />,
  cuidado: <Sparkles size={18} className="text-primary" />,
  nutricao: <Apple size={18} className="text-primary" />,
};

const Today = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("lipevida_checklist");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("lipevida_checklist", JSON.stringify(checked));
  }, [checked]);

  const handleToggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalItems = dailyChecklist.reduce((sum, cat) => sum + cat.items.length, 0);
  const completedItems = Object.values(checked).filter(Boolean).length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia! ☀️";
    if (hour < 18) return "Boa tarde! 🌤";
    return "Boa noite! 🌙";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-primary px-6 pt-10 pb-8 rounded-b-3xl">
        <p className="text-primary-foreground/80 text-sm font-semibold">{getGreeting()}</p>
        <h1 className="text-2xl font-extrabold text-primary-foreground mt-1">
          Seu dia de cuidado
        </h1>

        {/* Progress card */}
        <div className="mt-6 bg-card/15 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-primary-foreground">Progresso de hoje</span>
            <span className="text-sm font-extrabold text-primary-foreground">
              {completedItems}/{totalItems}
            </span>
          </div>
          <div className="w-full h-2.5 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-foreground rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <p className="text-xs text-primary-foreground/90 font-semibold mt-2 text-center">
              🎉 Parabéns! Você completou todas as tarefas!
            </p>
          )}
        </div>
      </header>

      {/* Checklists */}
      <main className="px-5 mt-6 space-y-6">
        {dailyChecklist.map((category) => (
          <section key={category.id}>
            <div className="flex items-center gap-2 mb-3">
              {categoryIcons[category.id]}
              <h2 className="text-base font-bold text-foreground">{category.title}</h2>
            </div>
            <div className="space-y-2">
              {category.items.map((item) => (
                <ChecklistItemCard
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  checked={!!checked[item.id]}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Today;
