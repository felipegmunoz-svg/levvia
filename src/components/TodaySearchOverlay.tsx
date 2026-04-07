import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useChallengeData } from "../hooks/useChallengeData";
import { useTouchpointProgress } from "../hooks/useTouchpointProgress";
import { touchpointConfig } from "../data/touchpointConfig";
import { supabase } from "../lib/supabaseClient";

import Header from "../components/Header";
import Footer from "../components/Footer";
import DayProgress from "../components/DayProgress";
import TouchpointCard from "../components/TouchpointCard";
import HydrationTracker from "../components/HydrationTracker";
import DailyAffirmation from "../components/DailyAffirmation";
import DaySummary from "../components/DaySummary";
import JourneyMap from "../components/JourneyMap";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const Today = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const forcedDay = searchParams.get("day");

  const [currentDay, setCurrentDay] = useState<number>(1);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    challengeData,
    loading: challengeLoading,
    error: challengeError,
    refetchChallengeData,
  } = useChallengeData(user?.id, currentDay);

  const {
    progress,
    loading: progressLoading,
    error: progressError,
    updateProgress,
  } = useTouchpointProgress(user?.id, currentDay);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const initializeDay = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user) {
          let userProfile = localStorage.getItem(`levvia_profile_${user.id}`);
          if (!userProfile) {
            const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

            if (error) throw error;
            userProfile = JSON.stringify(data);
            localStorage.setItem(`levvia_profile_${user.id}`, userProfile);
          }

          const profile = JSON.parse(userProfile);
          let storedCurrentDay = profile.current_day || 1;

          if (forcedDay) {
            storedCurrentDay = parseInt(forcedDay, 10);
            // Optionally, update the backend if a day is forced for testing
            await supabase.from("profiles").update({ current_day: storedCurrentDay }).eq("id", user.id);
            profile.current_day = storedCurrentDay;
            localStorage.setItem(`levvia_profile_${user.id}`, JSON.stringify(profile));
          }

          setCurrentDay(storedCurrentDay);

          // Check if onboarding is complete
          const onboardingComplete = profile.onboarding_complete;
          if (!onboardingComplete) {
            setShowOnboarding(true);
            navigate("/onboarding");
            return;
          }
        }
      } catch (err: any) {
        console.error("Error initializing day:", err.message);
        setError("Erro ao carregar o dia. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      initializeDay();
    }
  }, [user, forcedDay, navigate]);

  useEffect(() => {
    if (challengeError) {
      setError("Erro ao carregar os dados do desafio. Tente novamente.");
    }
    if (progressError) {
      setError("Erro ao carregar o progresso. Tente novamente.");
    }
  }, [challengeError, progressError]);

  const handleCompleteTouchpoint = async (touchpointId: string) => {
    await updateProgress(touchpointId, true);
    refetchChallengeData(); // Refresh data after updating progress
  };

  const handleHydrationUpdate = async (amount: number) => {
    const newHydration = (challengeData?.hydration || 0) + amount;
    await supabase
      .from("challenge_data")
      .update({ hydration: newHydration })
      .eq("user_id", user?.id)
      .eq("day", currentDay);
    refetchChallengeData();
  };

  const handleAdvanceDay = async () => {
    if (user) {
      const nextDay = currentDay + 1;
      await supabase.from("profiles").update({ current_day: nextDay }).eq("id", user.id);

      // Clear current day's challenge data to ensure fresh load for next day
      await supabase.from("challenge_data").delete().eq("user_id", user.id).eq("day", currentDay);

      setCurrentDay(nextDay);
      navigate(`/today?day=${nextDay}`);
    }
  };

  if (authLoading || loading || challengeLoading || progressLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (showOnboarding) {
    return null; // Onboarding component will handle navigation
  }

  const dayConfig = touchpointConfig[currentDay];

  if (!dayConfig) {
    return <ErrorMessage message="Conteúdo para este dia não encontrado." />;
  }

  const isDayComplete = challengeData?.touchpoints.every((tp) => progress[tp.id]);

  return (
    <div className="min-h-screen bg-dark-blue text-white flex flex-col">
      <Header />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-2">Dia {currentDay}</h1>
        <h2 className="text-xl text-mint-green mb-4">{dayConfig.title}</h2>

        <DayProgress currentDay={currentDay} totalDays={14} />

        <div className="space-y-6 mt-6">
          {dayConfig.affirmation && <DailyAffirmation affirmation={dayConfig.affirmation} />}

          {dayConfig.touchpoints.map((touchpoint, index) => (
            <TouchpointCard
              key={touchpoint.id}
              touchpoint={touchpoint}
              isComplete={progress[touchpoint.id] || false}
              onComplete={() => handleCompleteTouchpoint(touchpoint.id)}
              currentDay={currentDay}
            />
          ))}

          <HydrationTracker
            currentHydration={challengeData?.hydration || 0}
            targetHydration={dayConfig.hydrationTarget}
            onUpdate={handleHydrationUpdate}
          />

          {isDayComplete && currentDay < 14 && (
            <button
              onClick={handleAdvanceDay}
              className="w-full bg-mint-green text-dark-blue font-bold py-3 px-4 rounded-lg mt-6 transition-colors hover:bg-opacity-90"
            >
              Concluir Dia {currentDay} e Ir para o Dia {currentDay + 1} →
            </button>
          )}

          {currentDay === 14 && isDayComplete && (
            <DaySummary
              day={currentDay}
              title={dayConfig.title}
              message={dayConfig.completionMessage}
              onGenerateReport={() => alert("Gerar Relatório Médico (em breve)")} // Placeholder
            />
          )}

          {currentDay < 14 && (
            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-mint-green">Prévia do Dia {currentDay + 1}</h3>
              <p className="text-sm text-gray-400">
                {touchpointConfig[currentDay + 1]?.previewText || "Conteúdo em breve..."}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Today;
