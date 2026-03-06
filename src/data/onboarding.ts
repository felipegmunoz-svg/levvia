export interface OnboardingQuestion {
  id: number;
  type: "welcome" | "disclaimer" | "name" | "single" | "multi" | "result" | "info";
  title: string;
  subtitle?: string;
  options?: string[];
  icon: string;
}

export const onboardingSteps: OnboardingQuestion[] = [
  {
    id: 0,
    type: "welcome",
    title: "Bem-vinda ao Levvia",
    subtitle: "Seu caminho para a leveza. Vamos conhecer você melhor para personalizar sua experiência.",
    icon: "heart",
  },
  {
    id: 1,
    type: "disclaimer",
    title: "Aviso Importante",
    subtitle: "O Levvia é um aplicativo de apoio ao bem-estar e não substitui tratamento médico. As informações aqui são educativas e complementares ao acompanhamento profissional.",
    icon: "shield",
  },
  {
    id: 2,
    type: "name",
    title: "Como podemos te chamar?",
    subtitle: "Queremos personalizar sua experiência no Levvia.",
    icon: "smile",
  },
  {
    id: 3,
    type: "single",
    title: "Como você descreveria seu nível de dor no dia a dia?",
    subtitle: "Onde está seu fogo interno? Seja honesta — não existe resposta errada.",
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
    type: "result",
    title: "Seu Fogo Interno",
    subtitle: "",
    icon: "flame",
  },
  {
    id: 6,
    type: "multi",
    title: "Seus Inimigos Inflamatórios",
    subtitle: "Quais desses alimentos você consome com frequência? Selecione todos que se aplicam.",
    options: [
      "Açúcar refinado",
      "Alimentos ultraprocessados",
      "Refrigerantes",
      "Frituras",
      "Farinha branca",
      "Embutidos (salsicha, presunto)",
      "Doces e sobremesas industrializadas",
      "Fast food",
    ],
    icon: "flame",
  },
  {
    id: 7,
    type: "multi",
    title: "Seus Aliados Anti-inflamatórios",
    subtitle: "Quais desses alimentos você já inclui na sua rotina? Selecione todos que se aplicam.",
    options: [
      "Cúrcuma / Açafrão",
      "Gengibre",
      "Frutas vermelhas",
      "Peixes ricos em ômega-3",
      "Vegetais verde-escuros",
      "Azeite de oliva extra virgem",
      "Chá verde",
      "Sementes (chia, linhaça)",
    ],
    icon: "leaf",
  },
  {
    id: 8,
    type: "single",
    title: "Seu Objetivo em 14 Dias",
    subtitle: "Escolha o seu principal objetivo para as próximas duas semanas.",
    options: [
      "Reduzir a dor e o desconforto",
      "Melhorar a mobilidade",
      "Controlar o inchaço",
      "Adotar alimentação anti-inflamatória",
      "Criar uma rotina de exercícios",
      "Melhorar o bem-estar emocional",
    ],
    icon: "target",
  },
  {
    id: 9,
    type: "multi",
    title: "Restrições Alimentares",
    subtitle: "Você possui alguma restrição alimentar? Selecione todas que se aplicam.",
    options: [
      "Vegetariano",
      "Vegano",
      "Sem Glúten",
      "Sem Lactose",
      "Alergia a Frutos do Mar",
      "Alergia a Amendoim",
      "Alergia a Oleaginosas",
    ],
    icon: "shield",
  },
  {
    id: 10,
    type: "multi",
    title: "Preferências Alimentares",
    subtitle: "Alguma preferência especial? Esta etapa é opcional — pode pular se quiser.",
    options: [
      "Não gosto de coentro",
      "Não gosto de pimenta",
      "Prefiro refeições rápidas",
      "Prefiro refeições com poucos ingredientes",
    ],
    icon: "heart",
  },
  {
    id: 11,
    type: "info",
    title: "Pronto para Começar? 🎉",
    subtitle: "Preparamos um plano personalizado para você. Lembre-se: cada pequeno passo conta. Vamos juntas nessa jornada!",
    icon: "sparkles",
  },
];

export interface FireResult {
  level: string;
  color: string;
  colorClass: string;
  bgClass: string;
  description: string;
}

export const fireResults: Record<string, FireResult> = {
  "Sem dor": {
    level: "Brisa Leve",
    color: "Verde",
    colorClass: "text-success",
    bgClass: "bg-white/[0.06]",
    description:
      "Seu corpo está em um bom equilíbrio! Você sente pouca ou nenhuma inflamação no momento. Continue cuidando de si — pequenas atitudes diárias mantêm esse equilíbrio e previnem crises futuras.",
  },
  "Dor leve": {
    level: "Chamas Moderadas",
    color: "Amarelo",
    colorClass: "text-accent",
    bgClass: "bg-white/[0.06]",
    description:
      "Há sinais leves de inflamação. Seu corpo está pedindo atenção com pequenos sinais. Com ajustes na alimentação, movimento suave e cuidado diário, você pode manter esse fogo bem controlado.",
  },
  "Dor moderada": {
    level: "Incêndio Crescente",
    color: "Laranja",
    colorClass: "text-orange-400",
    bgClass: "bg-white/[0.06]",
    description:
      "A inflamação está presente e merece atenção. Seu corpo está sinalizando que precisa de mais cuidado. Vamos trabalhar juntas para reduzir esse desconforto com práticas anti-inflamatórias diárias.",
  },
  "Dor intensa": {
    level: "Fogo Ardente",
    color: "Vermelho",
    colorClass: "text-red-400",
    bgClass: "bg-white/[0.06]",
    description:
      "A inflamação está alta e seu corpo precisa de atenção especial. Não se preocupe — cada passo que você der aqui vai ajudar. Vamos focar em alívio, conforto e práticas gentis para o seu corpo.",
  },
  "Dor muito intensa": {
    level: "Fogo Ardente",
    color: "Vermelho",
    colorClass: "text-red-400",
    bgClass: "bg-white/[0.06]",
    description:
      "A inflamação está muito alta e seu corpo precisa de atenção especial. Além do acompanhamento médico, o Levvia vai te apoiar com práticas gentis e diárias para aliviar o desconforto.",
  },
};
