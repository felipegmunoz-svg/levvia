import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const onboarded = localStorage.getItem("levvia_onboarded");
    if (onboarded === "true") {
      navigate("/today", { replace: true });
    } else {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate]);

  return null;
};

export default Index;
