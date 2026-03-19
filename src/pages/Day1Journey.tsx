import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import Day1MealSuggestion from "@/components/journey/Day1MealSuggestion";
import Day1ClosingPublic from "@/components/journey/Day1ClosingPublic";

const Day1Journey = () => {
  const { profile } = useProfile();
  const [step, setStep] = useState<4 | 5>(4);

  if (step === 4) {
    return <Day1MealSuggestion profile={profile} onNext={() => setStep(5)} />;
  }

  return <Day1ClosingPublic />;
};

export default Day1Journey;
