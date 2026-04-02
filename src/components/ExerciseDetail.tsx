import { useState } from "react";
import { ArrowLeft, Clock, Dumbbell, CheckCircle2, AlertTriangle, Shuffle, MapPin, Play, ChevronLeft, ChevronRight } from "lucide-react";
import type { Exercise } from "@/data/exercises";

interface ExerciseDetailProps {
  exercise: Exercise;
  onBack: () => void;
  onMarkDone?: () => void;
}

const ExerciseDetail = ({ exercise, onBack, onMarkDone }: ExerciseDetailProps) => {
  const videoUrl = (exercise as any).video_url;
  const imageUrls: string[] = (exercise as any).image_urls || [];
  const benefitsText = exercise.benefits || (exercise as any).clinical_benefit;
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-background px-6 pt-10 pb-8 rounded-b-3xl">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={22} strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Dumbbell size={20} strokeWidth={1.5} className="text-secondary" />
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {exercise.category}
          </span>
        </div>
        <h1 className="text-xl font-light text-foreground">{exercise.title}</h1>
        <div className="flex items-center gap-4 mt-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
            <Clock size={14} strokeWidth={1.5} /> {exercise.duration}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {exercise.frequency}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
            {exercise.level}
          </span>
        </div>
      </div>

      <main className="px-6 py-6 space-y-6">
        {/* Video embed */}
        {videoUrl && (
          <section className="rounded-2xl overflow-hidden border border-border">
            {videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") ? (
              <iframe
                src={videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                className="w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={exercise.title}
              />
            ) : (
              <video
                src={videoUrl}
                controls
                className="w-full aspect-video"
                preload="metadata"
              />
            )}
          </section>
        )}

        {/* Image sequence gallery */}
        {imageUrls.length > 0 && (
          <section className="rounded-2xl overflow-hidden border border-border relative">
            <img
              src={imageUrls[currentImage]}
              alt={`Passo ${currentImage + 1}`}
              className="w-full aspect-[4/3] object-cover"
            />
            {/* Navigation */}
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((p) => (p > 0 ? p - 1 : imageUrls.length - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-foreground"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrentImage((p) => (p < imageUrls.length - 1 ? p + 1 : 0))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-foreground"
                >
                  <ChevronRight size={18} />
                </button>
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {imageUrls.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentImage ? "bg-secondary" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded-full">
                  {currentImage + 1}/{imageUrls.length}
                </div>
              </>
            )}
          </section>
        )}

        <section>
          <h2 className="text-base font-medium text-foreground mb-2">Sobre</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>
        </section>

        {exercise.startPosition && (
          <section className="levvia-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={18} strokeWidth={1.5} className="text-secondary" />
              <h2 className="text-sm font-medium text-foreground">Posição Inicial</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{exercise.startPosition}</p>
          </section>
        )}

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">Passo a Passo</h2>
          <div className="space-y-3">
            {exercise.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 levvia-card p-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">{i + 1}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {benefitsText && (
          <section className="levvia-card p-4 border-success/20">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={18} strokeWidth={1.5} className="text-success" />
              <h2 className="text-sm font-medium text-foreground">Por que Funciona (para Lipedema)</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{benefitsText}</p>
          </section>
        )}

        {exercise.safety && (
          <section className="levvia-card p-4 border-accent/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={18} strokeWidth={1.5} className="text-accent" />
              <h2 className="text-sm font-medium text-foreground">Contraindicações e Segurança</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{exercise.safety}</p>
          </section>
        )}

        {exercise.variations && exercise.variations.length > 0 && (
          <section className="levvia-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shuffle size={18} strokeWidth={1.5} className="text-muted-foreground" />
              <h2 className="text-sm font-medium text-foreground">Variações</h2>
            </div>
            <ul className="space-y-1.5">
              {exercise.variations.map((v, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-secondary mt-1.5" />
                  {v}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      {onMarkDone && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t border-border">
          <button
            onClick={onMarkDone}
            className="w-full py-3.5 rounded-3xl bg-primary text-primary-foreground font-medium text-sm"
          >
            ✅ Marcar como Feito
          </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseDetail;
