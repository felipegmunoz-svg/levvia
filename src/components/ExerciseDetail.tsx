import { ArrowLeft, Clock, Dumbbell, CheckCircle2, AlertTriangle, Shuffle } from "lucide-react";
import type { Exercise } from "@/data/exercises";

interface ExerciseDetailProps {
  exercise: Exercise;
  onBack: () => void;
}

const ExerciseDetail = ({ exercise, onBack }: ExerciseDetailProps) => {
  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="gradient-primary px-6 pt-10 pb-8 rounded-b-3xl">
        <button
          onClick={onBack}
          className="text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-4"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Dumbbell size={20} className="text-primary-foreground" />
          </div>
          <span className="text-xs font-bold text-primary-foreground/80 bg-primary-foreground/10 px-3 py-1 rounded-full">
            {exercise.category}
          </span>
        </div>
        <h1 className="text-xl font-extrabold text-primary-foreground">{exercise.title}</h1>
        <div className="flex items-center gap-4 mt-3">
          <span className="flex items-center gap-1 text-xs text-primary-foreground/80 font-semibold">
            <Clock size={14} /> {exercise.duration}
          </span>
          <span className="text-xs text-primary-foreground/80 font-semibold">
            {exercise.frequency}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary-foreground/20 text-primary-foreground font-bold">
            {exercise.level}
          </span>
        </div>
      </div>

      <main className="px-6 py-6 space-y-6">
        <section>
          <h2 className="text-base font-bold text-foreground mb-2">Sobre</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-3">Passo a Passo</h2>
          <div className="space-y-3">
            {exercise.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 bg-card p-3 rounded-xl shadow-card">
                <div className="flex-shrink-0 w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">{i + 1}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary-light rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={18} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">Por que funciona</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{exercise.benefits}</p>
        </section>

        {exercise.safety && (
          <section className="bg-accent/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={18} className="text-accent-foreground" />
              <h2 className="text-sm font-bold text-foreground">Contraindicações e Segurança</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{exercise.safety}</p>
          </section>
        )}

        {exercise.variations && exercise.variations.length > 0 && (
          <section className="bg-secondary rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shuffle size={18} className="text-secondary-foreground" />
              <h2 className="text-sm font-bold text-foreground">Variações</h2>
            </div>
            <ul className="space-y-1.5">
              {exercise.variations.map((v, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  {v}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

export default ExerciseDetail;
