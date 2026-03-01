export interface Exercise {
  id: number;
  title: string;
  category: string;
  level: string;
  duration: string;
  frequency: string;
  description: string;
  steps: string[];
  benefits: string;
  icon: string;
}

export const exerciseCategories = [
  "Respiração e Relaxamento",
  "Mobilidade Sentada",
  "Drenagem Linfática",
  "Fortalecimento Suave",
  "Alongamento",
  "Movimento Funcional",
];

export const exercises: Exercise[] = [
  {
    id: 1,
    title: "Respiração Diafragmática Básica",
    category: "Respiração e Relaxamento",
    level: "Muito Fácil",
    duration: "3-5 min",
    frequency: "2-3x ao dia",
    description: "Ativa o sistema parassimpático, reduzindo o cortisol e a inflamação. Melhora a circulação linfática.",
    steps: [
      "Inspire pelo nariz contando até 4, deixando a barriga inchar",
      "Segure o ar por 2 segundos",
      "Expire pela boca contando até 4",
      "Pausa de 2 segundos. Repita 10-15 vezes",
    ],
    benefits: "Reduz estresse e inflamação, melhora circulação linfática",
    icon: "wind",
  },
  {
    id: 2,
    title: "Respiração 4-7-8 para Acalmar",
    category: "Respiração e Relaxamento",
    level: "Muito Fácil",
    duration: "2-3 min",
    frequency: "1-2x ao dia",
    description: "Técnica poderosa para acalmar o sistema nervoso e preparar para o sono.",
    steps: [
      "Inspire pelo nariz contando até 4",
      "Segure a respiração contando até 7",
      "Expire pela boca contando até 8",
      "Repita 4-8 vezes",
    ],
    benefits: "Acalma o sistema nervoso, melhora o sono",
    icon: "moon",
  },
  {
    id: 3,
    title: "Relaxamento Progressivo dos Pés",
    category: "Respiração e Relaxamento",
    level: "Fácil",
    duration: "5-7 min",
    frequency: "1x ao dia",
    description: "Técnica de contração e relaxamento muscular que reduz a tensão acumulada.",
    steps: [
      "Deite-se confortavelmente",
      "Contraia os dedos dos pés por 5 segundos",
      "Relaxe completamente por 10 segundos",
      "Repita subindo pelos tornozelos, panturrilhas e coxas",
    ],
    benefits: "Reduz tensão muscular e melhora a consciência corporal",
    icon: "footprints",
  },
  {
    id: 4,
    title: "Rotação de Tornozelos",
    category: "Mobilidade Sentada",
    level: "Muito Fácil",
    duration: "3 min",
    frequency: "3-4x ao dia",
    description: "Melhora a circulação nos pés e tornozelos, reduzindo o inchaço.",
    steps: [
      "Sentada, levante um pé do chão",
      "Gire o tornozelo lentamente no sentido horário 10 vezes",
      "Repita no sentido anti-horário",
      "Troque de pé",
    ],
    benefits: "Melhora circulação, reduz inchaço nos tornozelos",
    icon: "rotate-cw",
  },
  {
    id: 5,
    title: "Bombeamento de Panturrilha Sentada",
    category: "Mobilidade Sentada",
    level: "Fácil",
    duration: "3-5 min",
    frequency: "Várias vezes ao dia",
    description: "Ativa a bomba muscular da panturrilha para melhorar o retorno venoso.",
    steps: [
      "Sentada com os pés apoiados no chão",
      "Levante os calcanhares mantendo a ponta dos pés no chão",
      "Segure por 3 segundos",
      "Baixe lentamente. Repita 15-20 vezes",
    ],
    benefits: "Ativa retorno venoso e reduz acúmulo de líquido",
    icon: "arrow-up",
  },
  {
    id: 6,
    title: "Automassagem de Drenagem nas Pernas",
    category: "Drenagem Linfática",
    level: "Fácil",
    duration: "5-10 min",
    frequency: "1-2x ao dia",
    description: "Movimentos suaves que estimulam a drenagem linfática nas pernas.",
    steps: [
      "Aplique hidratante ou óleo nas pernas",
      "Com pressão leve, deslize as mãos do tornozelo em direção ao joelho",
      "Repita 10 vezes em cada perna",
      "Finalize com movimentos circulares atrás do joelho",
    ],
    benefits: "Estimula drenagem linfática, reduz inchaço",
    icon: "hand",
  },
  {
    id: 7,
    title: "Elevação de Pernas na Parede",
    category: "Drenagem Linfática",
    level: "Fácil",
    duration: "5-10 min",
    frequency: "1-2x ao dia",
    description: "Usa a gravidade para auxiliar o retorno venoso e linfático.",
    steps: [
      "Deite-se perto de uma parede",
      "Apoie as pernas na parede em ângulo de 90°",
      "Relaxe completamente",
      "Permaneça por 5-10 minutos",
    ],
    benefits: "Reduz inchaço e dor nas pernas pela ação da gravidade",
    icon: "arrow-up-from-line",
  },
  {
    id: 8,
    title: "Agachamento Apoiado na Cadeira",
    category: "Fortalecimento Suave",
    level: "Moderado",
    duration: "5 min",
    frequency: "1x ao dia",
    description: "Fortalece quadríceps e glúteos com segurança.",
    steps: [
      "Fique de pé na frente da cadeira, pés na largura dos ombros",
      "Desça lentamente como se fosse sentar",
      "Toque levemente na cadeira e levante",
      "Repita 8-12 vezes",
    ],
    benefits: "Fortalece pernas com baixo impacto",
    icon: "armchair",
  },
  {
    id: 9,
    title: "Alongamento de Panturrilha",
    category: "Alongamento",
    level: "Fácil",
    duration: "3-5 min",
    frequency: "2x ao dia",
    description: "Alivia a tensão nas panturrilhas e melhora a flexibilidade.",
    steps: [
      "Apoie as mãos na parede",
      "Coloque um pé atrás, mantendo o calcanhar no chão",
      "Incline-se para frente até sentir o alongamento",
      "Mantenha 20-30 segundos. Troque de lado",
    ],
    benefits: "Alivia tensão e melhora flexibilidade",
    icon: "stretch-horizontal",
  },
  {
    id: 10,
    title: "Caminhada Leve em Casa",
    category: "Movimento Funcional",
    level: "Fácil",
    duration: "5-15 min",
    frequency: "1-2x ao dia",
    description: "Movimento funcional básico que ativa todo o sistema circulatório.",
    steps: [
      "Caminhe lentamente pelo espaço da casa",
      "Mantenha uma postura ereta",
      "Respire naturalmente",
      "Aumente o tempo gradualmente conforme conforto",
    ],
    benefits: "Ativa circulação geral e melhora o humor",
    icon: "footprints",
  },
];
