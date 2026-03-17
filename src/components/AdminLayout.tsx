import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  UtensilsCrossed,
  Heart,
  Bell,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import logoIcon from "@/assets/logo_livvia_branco_icone.png";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Clientes", icon: Users, path: "/admin/clients" },
  { label: "Exercícios", icon: Dumbbell, path: "/admin/exercises" },
  { label: "Receitas", icon: UtensilsCrossed, path: "/admin/recipes" },
  { label: "Hábitos", icon: Heart, path: "/admin/habits" },
  { label: "Notificações", icon: Bell, path: "/admin/notifications" },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col bg-muted/30">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="Levvia" className="w-8 h-auto" />
            <div>
              <h2 className="text-sm font-medium text-foreground">Levvia Admin</h2>
              <p className="text-xs text-muted-foreground">Painel de gestão</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-secondary/20 text-secondary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
                }`}
              >
                <item.icon size={18} strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            to="/today"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
            Voltar ao app
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-white/[0.06] transition-colors w-full"
          >
            <LogOut size={18} strokeWidth={1.5} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="w-full p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
