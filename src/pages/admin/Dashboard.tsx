import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Users, Dumbbell, UtensilsCrossed, Heart } from "lucide-react";

interface Stats {
  clients: number;
  exercises: number;
  recipes: number;
  habits: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({ clients: 0, exercises: 0, recipes: 0, habits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [clients, exercises, recipes, habits] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("exercises").select("id", { count: "exact", head: true }),
        supabase.from("recipes").select("id", { count: "exact", head: true }),
        supabase.from("habits").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        clients: clients.count ?? 0,
        exercises: exercises.count ?? 0,
        recipes: recipes.count ?? 0,
        habits: habits.count ?? 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Clientes", value: stats.clients, icon: Users, color: "text-secondary" },
    { label: "Exercícios", value: stats.exercises, icon: Dumbbell, color: "text-secondary" },
    { label: "Receitas", value: stats.recipes, icon: UtensilsCrossed, color: "text-accent" },
    { label: "Hábitos", value: stats.habits, icon: Heart, color: "text-destructive" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-light text-foreground mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <card.icon size={24} strokeWidth={1.5} className={card.color} />
            </div>
            <p className="text-3xl font-light text-foreground">
              {loading ? "—" : card.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
