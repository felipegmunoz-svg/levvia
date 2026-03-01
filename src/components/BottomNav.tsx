import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, User } from "lucide-react";

const tabs = [
  { path: "/today", label: "Hoje", icon: Home },
  { path: "/practices", label: "Práticas", icon: BookOpen },
  { path: "/profile", label: "Perfil", icon: User },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-soft">
      <div className="flex items-center justify-around max-w-md mx-auto h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? "text-primary" : ""}
              />
              <span className={`text-xs font-semibold ${isActive ? "text-primary" : ""}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
