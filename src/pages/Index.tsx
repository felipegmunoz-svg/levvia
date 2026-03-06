import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InstallPWAPrompt from "@/components/InstallPWAPrompt";

const Index = () => {
  const navigate = useNavigate();
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
    if (!checked || showInstall) return;
    const onboarded = localStorage.getItem("levvia_onboarded");
    navigate(onboarded === "true" ? "/today" : "/onboarding", { replace: true });
  }, [checked, showInstall, navigate]);

  if (!checked) return null;

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
