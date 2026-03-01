export interface OnboardingQuestion {
  id: number;
  type: "welcome" | "single" | "multi" | "info";
  title: string;
  subtitle?: string;
  options?: string[];
  icon: string;
}

export const onboardingSteps: OnboardingQuestion[] = [
  {
    id: 0,
    type: "welcome",
    title: "Bem-vinda ao LipeVida",
    subtitle: "Seu espaço de cuidado e bem-estar. Vamos conhecer você melhor para personalizar sua experiência.",
    icon: "heart",
  },
  {
    id: 1,
    type: "single",
    title: "Qual sua faixa etária?",
    subtitle: "Isso nos ajuda a adaptar os exercícios para você.",
    options: ["20-30 anos", "31-40 anos", "41-50 anos", "51-60 anos", "60+ anos"],
    icon: "calendar",
  },
  {
    id: 2,
    type: "single",
    title: "Há quanto tempo você foi diagnosticada com lipedema?",
    options: ["Menos de 1 ano", "1-3 anos", "3-5 anos", "Mais de 5 anos", "Ainda não tenho diagnóstico"],
    icon: "stethoscope",
  },
  {
    id: 3,
    type: "single",
    title: "Como você descreveria seu nível de dor no dia a dia?",
    subtitle: "Seja honesta — não existe resposta errada.",
    options: ["Sem dor", "Dor leve", "Dor moderada", "Dor intensa", "Dor muito intensa"],
    icon: "thermometer",
  },
  {
    id: 4,
    type: "multi",
    title: "Quais áreas do corpo são mais afetadas?",
    subtitle: "Selecione todas que se aplicam.",
    options: ["Coxas", "Quadris", "Panturrilhas", "Braços", "Tornozelos", "Joelhos"],
    icon: "body",
  },
  {
    id: 5,
    type: "single",
    title: "Qual seu nível de atividade física atual?",
    options: ["Sedentária", "Atividade leve (caminhadas)", "Atividade moderada", "Atividade regular"],
    icon: "activity",
  },
  {
    id: 6,
    type: "multi",
    title: "O que você gostaria de alcançar com o app?",
    subtitle: "Selecione seus principais objetivos.",
    options: ["Reduzir a dor", "Melhorar a mobilidade", "Controlar o inchaço", "Alimentação saudável", "Apoio emocional", "Rotina de exercícios"],
    icon: "target",
  },
  {
    id: 7,
    type: "single",
    title: "Quando você prefere fazer seus exercícios?",
    options: ["Manhã", "Tarde", "Noite", "Varia conforme o dia"],
    icon: "clock",
  },
  {
    id: 8,
    type: "single",
    title: "Você tem alguma restrição alimentar?",
    options: ["Nenhuma", "Vegetariana/Vegana", "Sem glúten", "Sem lactose", "Outras"],
    icon: "utensils",
  },
  {
    id: 9,
    type: "info",
    title: "Tudo pronto! 🎉",
    subtitle: "Preparamos um plano personalizado para você. Lembre-se: cada pequeno passo conta. Vamos juntas nessa jornada!",
    icon: "sparkles",
  },
];
