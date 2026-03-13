import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import InstallPWAPrompt from "@/components/InstallPWAPrompt";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [showInstall, setShowInstall] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;
    const dismissed = localStorage.getItem("levvia_install_dismissed") === "true";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile && !isStandalone && !dismissed) {
      setShowInstall(true);
    }
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!checked || showInstall || authLoading) return;
    const onboarded = localStorage.getItem("levvia_onboarded") === "true";

    if (!onboarded) {
      navigate("/onboarding", { replace: true });
    } else if (user) {
      navigate("/today", { replace: true });
    } else {
      navigate("/plans", { replace: true });
    }
  }, [checked, showInstall, authLoading, user, navigate]);

  if (!checked || authLoading) return null;

  if (showInstall) {
    return (
      <InstallPWAPrompt
        onDismiss={() => {
          localStorage.setItem("levvia_install_dismissed", "true");
          setShowInstall(false);
        }}
      />
    );
  }

  return null;
};

export default Index;
