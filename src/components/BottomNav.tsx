import { useLocation, useNavigate } from "react-router-dom";
import { Home, Dumbbell, GraduationCap, User } from "lucide-react";
import { useTrialStatus } from "@/hooks/useTrialStatus";

const tabs = [
  { path: "/today", label: "Hoje", icon: Home },
  { path: "/practices", label: "Práticas", icon: Dumbbell },
  { path: "/learn", label: "Aprender", icon: GraduationCap },
  { path: "/profile", label: "Perfil", icon: User },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[rgba(13,31,54,0.95)] backdrop-blur-[20px] border-t border-white/[0.08]">
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
                  ? "text-secondary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={1.5}
                className={isActive ? "text-secondary" : ""}
              />
              <span className={`text-xs ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-secondary mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
