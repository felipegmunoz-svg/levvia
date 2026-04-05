import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft, ChevronDown, ChevronRight, Clock, Timer } from "lucide-react";

interface ExerciseSequenceItem {
  exercise_id: string;
  duration: string;
}

export default function SOSProtocol() {
  const { situation } = useParams();
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const { data: protocol } = useQuery({
    queryKey: ["sos-protocol", situation],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sos_protocols")
        .select("*")
        .eq("situation", situation!)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!situation,
  });

  const exerciseSequence = (protocol?.exercise_sequence || []) as unknown as ExerciseSequenceItem[];
  const exerciseIds = exerciseSequence.map((item) => item.exercise_id);

  const { data: exercises } = useQuery({
    queryKey: ["sos-exercises", exerciseIds],
    queryFn: async () => {
      if (exerciseIds.length === 0) return [];
      const { data, error } = await supabase
        .from("exercises")
        .select("id, title, description, steps, duration, category, level")
        .in("id", exerciseIds);
      if (error) throw error;
      return data;
    },
    enabled: exerciseIds.length > 0,
  });

  const exerciseMap = exercises?.reduce((acc, ex) => {
    acc[ex.id] = ex;
    return acc;
  }, {} as Record<string, (typeof exercises)[number]>) || {};

  return (
    <div className="theme-light levvia-page min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-levvia-bg/95 backdrop-blur-sm border-b border-levvia-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg hover:bg-levvia-primary/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-levvia-fg" />
          </button>
          <span className="text-sm font-heading font-semibold text-levvia-fg">Protocolo SOS</span>
        </div>
      </div>

      <main className="px-4 py-4 max-w-lg mx-auto">
        {protocol && (
          <>
            {/* Protocol header */}
            <div className="levvia-card !bg-sos/5 !border-sos/20 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{protocol.icon}</span>
                <div>
                  <h1 className="text-xl font-heading font-bold text-levvia-fg">{protocol.title}</h1>
                  <div className="flex items-center gap-3 mt-1 text-sm text-levvia-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {protocol.total_time_minutes} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer className="w-4 h-4" />
                      {exerciseSequence.length} exercícios
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-levvia-fg/70 leading-relaxed font-body">
                {protocol.description}
              </p>
            </div>

            {/* Exercise sequence */}
            <div className="space-y-2">
              {exerciseSequence.map((item, index) => {
                const exercise = exerciseMap[item.exercise_id];
                const isExpanded = expandedIndex === index;

                return (
                  <div key={index} className="levvia-card !p-0 overflow-hidden">
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className="w-full flex items-center gap-3 p-4 text-left min-h-[56px]"
                    >
                      <span className="w-7 h-7 rounded-full bg-levvia-primary/10 text-levvia-primary text-sm font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-levvia-fg text-sm truncate">
                          {exercise?.title || "Carregando..."}
                        </p>
                        <p className="text-xs text-levvia-muted">{item.duration}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-levvia-muted shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-levvia-muted shrink-0" />
                      )}
                    </button>

                    {isExpanded && exercise && (
                      <div className="border-t border-levvia-border p-4 animate-fade-in">
                        {exercise.description && (
                          <p className="text-sm text-levvia-fg/80 mb-3 font-body leading-relaxed">
                            {exercise.description}
                          </p>
                        )}
                        {exercise.steps && Array.isArray(exercise.steps) && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-levvia-muted uppercase tracking-wide">Passos</p>
                            {(exercise.steps as string[]).map((step, i) => (
                              <div key={i} className="flex gap-2 text-sm text-levvia-fg/80 font-body">
                                <span className="text-levvia-primary font-bold shrink-0">{i + 1}.</span>
                                <span>{typeof step === "string" ? step : JSON.stringify(step)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
