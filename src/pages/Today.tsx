import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets, HeartPulse, Sparkles, Apple, X, ExternalLink } from "lucide-react";
import ChecklistItemCard from "@/components/ChecklistItemCard";
import { dailyChecklist } from "@/data/checklist";
import { getDailyPhrase } from "@/data/motivational";
import BottomNav from "@/components/BottomNav";

const categoryIcons: Record<string, React.ReactNode> = {
  hidratacao: <Droplets size={18} className="text-primary" />,
  movimento: <HeartPulse size={18} className="text-primary" />,
  cuidado: <Sparkles size={18} className="text-primary" />,
  nutricao: <Apple size={18} className="text-primary" />,
};

const Today = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("lipevida_checklist");
    return saved ? JSON.parse(saved) : {};
  });
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);

  useEffect(() => {
    localStorage.setItem("lipevida_checklist", JSON.stringify(checked));
  }, [checked]);

  const handleToggle = (id: string) => {
    // Find the item to check for actions
    for (const category of dailyChecklist) {
      const item = category.items.find((i) => i.id === id);
      if (item) {
        if (!checked[id]) {
          // Only trigger action when checking (not unchecking)
          if (item.actionType === "modal" && item.actionContent) {
            setModalContent({ title: item.label, text: item.actionContent });
          } else if (item.actionType === "exercise" && item.actionTargetId) {
            setChecked((prev) => ({ ...prev, [id]: true }));
            navigate(`/practices?tab=exercises&highlight=${item.actionTargetId}`);
            return;
          } else if (item.actionType === "recipe" && item.actionTargetId) {
            setChecked((prev) => ({ ...prev, [id]: true }));
            navigate(`/practices?tab=recipes&highlight=${item.actionTargetId}`);
            return;
          }
        }
        break;
      }
    }
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalItems = dailyChecklist.reduce((sum, cat) => sum + cat.items.length, 0);
  const completedItems = Object.values(checked).filter(Boolean).length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia! ☀️";
    if (hour < 18) return "Boa tarde! 🌤️";
    return "Boa noite! 🌙";
  };

  const { userName, userObjective, painAnswer } = (() => {
    const saved = localStorage.getItem("lipevida_onboarding");
    if (saved) {
      const data = JSON.parse(saved);
      return { userName: data[2] || "", userObjective: data[8] || "", painAnswer: data[3] || "" };
    }
    return { userName: "", userObjective: "", painAnswer: "" };
  })();

  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem("lipevida_welcome_dismissed") && !!userName;
  });

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem("lipevida_welcome_dismissed", "true");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-primary px-6 pt-10 pb-8 rounded-b-3xl">
        <p className="text-primary-foreground/80 text-sm font-semibold">{getGreeting()}</p>
        <h1 className="text-2xl font-extrabold text-primary-foreground mt-1">
          {userName ? `${userName}, seu dia de cuidado` : "Seu dia de cuidado"}
        </h1>

        {/* Motivational phrase */}
        <p className="text-xs text-primary-foreground/70 mt-2 italic leading-relaxed">
          {getDailyPhrase(painAnswer)}
        </p>

        {/* Progress card */}
        <div className="mt-5 bg-card/15 backdrop-blur-sm rounded-2xl p-4">
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

      {/* Welcome card */}
      {showWelcome && userObjective && (
        <div className="mx-5 mt-4 bg-primary-light rounded-2xl p-4 relative">
          <button onClick={dismissWelcome} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
          <p className="text-sm font-bold text-foreground">Olá, {userName}! 👋</p>
          <p className="text-xs text-muted-foreground mt-1">Seu objetivo principal: <span className="font-semibold text-foreground">{userObjective}</span></p>
        </div>
      )}

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
                  hasAction={item.actionType !== "none" && !!item.actionType}
                  actionType={item.actionType}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-6">
          <div className="bg-card rounded-2xl shadow-soft p-6 max-w-sm w-full relative">
            <button
              onClick={() => setModalContent(null)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
            <h3 className="text-base font-bold text-foreground mb-3">{modalContent.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{modalContent.text}</p>
            <button
              onClick={() => setModalContent(null)}
              className="mt-5 w-full py-3 rounded-xl gradient-primary text-primary-foreground font-bold text-sm"
            >
              Entendi!
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Today;
