import { useLocation, useNavigate } from "react-router-dom";
import { Home, Book, BookOpen, Dumbbell, User } from "lucide-react";

const tabs = [
  { path: "/today", label: "Hoje", icon: Home },
  { path: "/journey", label: "Jornada", icon: Book },
  { path: "/guia", label: "Guia", icon: BookOpen },
  { path: "/practices", label: "Práticas", icon: Dumbbell },
  { path: "/profile", label: "Perfil", icon: User },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-levvia-surface border-t border-levvia-border" style={{ height: 68 }}>
      <div className="flex items-center justify-around max-w-md mx-auto h-full px-5">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
            || location.pathname.startsWith(tab.path + "/")
            || (tab.path === "/journey" && (location.pathname === "/progress" || location.pathname === "/diary"));
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1.5 px-4 py-2 transition-colors ${
                isActive ? "text-levvia-primary" : "text-levvia-muted"
              }`}
            >
              <Icon size={22} strokeWidth={1.5} />
              <span className={`text-[10px] font-medium font-body ${isActive ? "text-levvia-primary" : "text-levvia-muted"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
