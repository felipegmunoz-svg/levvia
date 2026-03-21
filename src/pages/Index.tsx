import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!checked || authLoading) return;
    const onboarded = localStorage.getItem("levvia_onboarded") === "true";

    if (!onboarded) {
      navigate("/onboarding", { replace: true });
    } else if (user) {
      navigate("/today", { replace: true });
    } else {
      navigate("/diagnosis", { replace: true });
    }
  }, [checked, authLoading, user, navigate]);

  if (!checked || authLoading) return null;

  return null;
};

export default Index;
