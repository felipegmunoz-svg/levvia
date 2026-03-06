export interface ChallengeActivity {
  id: string;
  type: "exercise" | "recipe" | "habit";
  label: string;
  exerciseId?: number;
  recipeId?: number;
  modalContent?: string;
}

export interface ChallengeDay {
  day: number;
  title: string;
  objective: string;
  phrase: string;
  // Alternate phrases for high-pain users (gentler tone)
  phraseHighPain?: string;
  exercises: ChallengeActivity[];
  recipes: ChallengeActivity[];
  habits: ChallengeActivity[];
}

export const challengeDays: ChallengeDay[] = [
  {
    day: 1,
    title: "Foco na Conexão e Despertar",
    objective: "Iniciar a jornada com consciência e gentileza.",
    phrase: "Cada pequeno passo é uma vitória. Comece hoje, com carinho por você.",
    phraseHighPain: "Seu corpo merece gentileza. Comece devagar, com amor por você.",
    exercises: [
      { id: "day1-ex1", type: "exercise", label: "Respiração Diafragmática Básica", exerciseId: 1 },
      { id: "day1-ex2", type: "exercise", label: "Rotação de Tornozelos", exerciseId: 12 },
    ],
    recipes: [
      { id: "day1-rec1", type: "recipe", label: "Suco Verde Anti-inflamatório", recipeId: 1 },
    ],
    habits: [
      { id: "day1-hab1", type: "habit", label: "Beber 2 litros de água", modalContent: "A hidratação adequada é fundamental para o sistema linfático. Tente distribuir ao longo do dia: um copo ao acordar, um a cada 2 horas." },
      { id: "day1-hab2", type: "habit", label: "Elevar as pernas por 15 minutos antes de dormir", modalContent: "A elevação das pernas usa a gravidade para drenar o excesso de líquido. Apoie as pernas na parede ou em almofadas." },
    ],
  },
  {
    day: 2,
    title: "Foco na Drenagem e Leveza",
    objective: "Estimular a drenagem e sentir mais leveza.",
    phrase: "A leveza começa de dentro. Sinta seu corpo agradecer a cada movimento.",
    phraseHighPain: "Escute seu corpo com carinho. Cada toque suave é um passo para a leveza.",
    exercises: [
      { id: "day2-ex1", type: "exercise", label: "Automassagem das Pernas (Drenagem Ascendente)", exerciseId: 6 },
      { id: "day2-ex2", type: "exercise", label: "Flexão e Extensão dos Pés", exerciseId: 13 },
    ],
    recipes: [
      { id: "day2-rec1", type: "recipe", label: "Bowl de Açaí com Sementes", recipeId: 2 },
    ],
    habits: [
      { id: "day2-hab1", type: "habit", label: "Caminhada Consciente por 10 minutos", modalContent: "Caminhe em ritmo confortável, prestando atenção na respiração e no contato dos pés com o chão." },
      { id: "day2-hab2", type: "habit", label: "Fazer um chá de gengibre", modalContent: "O gengibre é um potente anti-inflamatório natural. Ferva rodelas de gengibre fresco em água por 5-7 minutos." },
    ],
  },
  {
    day: 3,
    title: "Foco na Mobilidade e Alívio",
    objective: "Melhorar a mobilidade e aliviar tensões.",
    phrase: "Movimento é vida. Cada alongamento é um abraço para suas articulações.",
    phraseHighPain: "Mova-se no seu ritmo. Cada gesto suave é um ato de cuidado.",
    exercises: [
      { id: "day3-ex1", type: "exercise", label: "Círculos com os Joelhos (Deitado)", exerciseId: 14 },
      { id: "day3-ex2", type: "exercise", label: "Alongamento Suave da Coluna (Gato-Vaca Deitado)", exerciseId: 5 },
    ],
    recipes: [
      { id: "day3-rec1", type: "recipe", label: "Sopa de Abóbora com Gengibre", recipeId: 7 },
    ],
    habits: [
      { id: "day3-hab1", type: "habit", label: "Alongamento de panturrilhas na parede", modalContent: "Fique de frente para uma parede, dê um passo atrás com uma perna e mantenha o calcanhar no chão. Segure por 20-30 segundos." },
      { id: "day3-hab2", type: "habit", label: "Registrar no Diário como se sente", modalContent: "Reserve 5 minutos para anotar como seu corpo está se sentindo hoje. Observe dores, inchaço e seu estado emocional." },
    ],
  },
  {
    day: 4,
    title: "Foco na Força Suave e Estabilidade",
    objective: "Fortalecer o corpo de forma gentil.",
    phrase: "Sua força reside na sua gentileza. Construa-a com cada repetição.",
    exercises: [
      { id: "day4-ex1", type: "exercise", label: "Elevação de Calcanhares (Panturrilha)", exerciseId: 18 },
      { id: "day4-ex2", type: "exercise", label: "Ponte de Glúteos (Deitado)", exerciseId: 19 },
    ],
    recipes: [
      { id: "day4-rec1", type: "recipe", label: "Wrap de Frango com Abacate", recipeId: 5 },
    ],
    habits: [
      { id: "day4-hab1", type: "habit", label: "Beber 2 litros de água", modalContent: "A hidratação adequada é fundamental para o sistema linfático. Distribua ao longo do dia." },
      { id: "day4-hab2", type: "habit", label: "Meditação Guiada de Visualização por 5 minutos", modalContent: "Feche os olhos, respire profundamente e visualize uma luz curativa descendo pelo seu corpo, aliviando cada área de tensão." },
    ],
  },
  {
    day: 5,
    title: "Foco na Circulação e Bem-Estar",
    objective: "Ativar a circulação e promover o bem-estar geral.",
    phrase: "Cuide do seu corpo, ele é seu templo. Cada escolha importa.",
    exercises: [
      { id: "day5-ex1", type: "exercise", label: "Massagem nos Pés (Reflexologia Simples)", exerciseId: 9 },
      { id: "day5-ex2", type: "exercise", label: "Rotação de Quadril (Deitado)", exerciseId: 15 },
    ],
    recipes: [
      { id: "day5-rec1", type: "recipe", label: "Smoothie de Frutas Vermelhas", recipeId: 6 },
    ],
    habits: [
      { id: "day5-hab1", type: "habit", label: "Elevar as pernas por 15 minutos", modalContent: "Deite-se e apoie as pernas na parede ou em almofadas. Use a gravidade a seu favor para reduzir o inchaço." },
      { id: "day5-hab2", type: "habit", label: "Evitar alimentos processados", modalContent: "Alimentos ultraprocessados aumentam a inflamação. Prefira comida fresca e natural ao longo do dia." },
    ],
  },
  {
    day: 6,
    title: "Foco na Consciência Corporal e Relaxamento",
    objective: "Aprofundar a conexão com o corpo e relaxar.",
    phrase: "Ouça seu corpo, ele tem muito a te dizer. Respeite seus limites.",
    exercises: [
      { id: "day6-ex1", type: "exercise", label: "Relaxamento Progressivo (Scan Corporal)", exerciseId: 3 },
      { id: "day6-ex2", type: "exercise", label: "Alongamento de Coxas (Quadríceps)", exerciseId: 17 },
    ],
    recipes: [
      { id: "day6-rec1", type: "recipe", label: "Salada de Quinoa com Legumes", recipeId: 3 },
    ],
    habits: [
      { id: "day6-hab1", type: "habit", label: "Caminhada Consciente por 15 minutos", modalContent: "Caminhe prestando atenção na respiração, no movimento das pernas e nos sons ao redor." },
      { id: "day6-hab2", type: "habit", label: "Fazer um chá de camomila antes de dormir", modalContent: "A camomila tem propriedades calmantes que ajudam a relaxar e melhorar a qualidade do sono." },
    ],
  },
  {
    day: 7,
    title: "Foco na Drenagem e Alívio Abdominal",
    objective: "Reduzir o inchaço abdominal e nas pernas.",
    phrase: "A cada dia, mais leveza. Sinta a transformação acontecer.",
    exercises: [
      { id: "day7-ex1", type: "exercise", label: "Drenagem Linfática do Abdômen", exerciseId: 10 },
      { id: "day7-ex2", type: "exercise", label: "Pernas para Cima na Parede (Viparita Karani)", exerciseId: 24 },
    ],
    recipes: [
      { id: "day7-rec1", type: "recipe", label: "Overnight Oats com Nozes", recipeId: 8 },
    ],
    habits: [
      { id: "day7-hab1", type: "habit", label: "Beber 2 litros de água", modalContent: "Continue priorizando a hidratação. Sua meta: 2 litros distribuídos ao longo do dia." },
      { id: "day7-hab2", type: "habit", label: "Evitar bebidas açucaradas", modalContent: "Bebidas açucaradas aumentam a inflamação e a retenção de líquidos. Prefira água, chás e sucos naturais." },
    ],
  },
  {
    day: 8,
    title: "Foco na Força Funcional e Equilíbrio",
    objective: "Melhorar a força para as atividades diárias.",
    phrase: "Pequenas forças constroem grandes mudanças. Você é capaz.",
    exercises: [
      { id: "day8-ex1", type: "exercise", label: "Cadeira Imaginária (Sentado)", exerciseId: 22 },
      { id: "day8-ex2", type: "exercise", label: "Elevação de Joelhos (Sentado)", exerciseId: 21 },
    ],
    recipes: [
      { id: "day8-rec1", type: "recipe", label: "Chá de Gengibre com Cúrcuma", recipeId: 4 },
    ],
    habits: [
      { id: "day8-hab1", type: "habit", label: "Alongamento de Isquiotibiais com faixa/toalha", modalContent: "Deite-se, coloque uma toalha na sola do pé e puxe suavemente a perna esticada em direção ao corpo. Mantenha 20-30 segundos." },
      { id: "day8-hab2", type: "habit", label: "Registrar no Diário como se sente", modalContent: "Anote como seu corpo está respondendo ao desafio. Compare com o primeiro dia." },
    ],
  },
  {
    day: 9,
    title: "Foco na Drenagem dos Braços e Relaxamento",
    objective: "Reduzir o inchaço nos braços e relaxar.",
    phrase: "Respire fundo, relaxe os ombros. A calma traz a cura.",
    exercises: [
      { id: "day9-ex1", type: "exercise", label: "Drenagem Linfática dos Braços", exerciseId: 11 },
      { id: "day9-ex2", type: "exercise", label: "Respiração 4-7-8 para Acalmar", exerciseId: 2 },
    ],
    recipes: [
      { id: "day9-rec1", type: "recipe", label: "Bowl de Açaí com Sementes", recipeId: 2 },
    ],
    habits: [
      { id: "day9-hab1", type: "habit", label: "Elevar as pernas por 15 minutos", modalContent: "A elevação ajuda na drenagem. Aproveite para fazer respirações profundas." },
      { id: "day9-hab2", type: "habit", label: "Evitar alimentos inflamatórios", modalContent: "Evite frituras, açúcar refinado, carnes processadas e alimentos com muitos conservantes." },
    ],
  },
  {
    day: 10,
    title: "Foco na Postura e Alívio da Coluna",
    objective: "Melhorar a postura e aliviar dores nas costas.",
    phrase: "Sua postura reflete sua força interior. Erga-se com confiança.",
    exercises: [
      { id: "day10-ex1", type: "exercise", label: "Alongamento de Parede para o Corpo Todo", exerciseId: 30 },
      { id: "day10-ex2", type: "exercise", label: "Rotação de Quadril (Deitado)", exerciseId: 15 },
    ],
    recipes: [
      { id: "day10-rec1", type: "recipe", label: "Sopa de Abóbora com Gengibre", recipeId: 7 },
    ],
    habits: [
      { id: "day10-hab1", type: "habit", label: "Caminhada Consciente por 20 minutos", modalContent: "Aumente o tempo de caminhada. Mantenha um ritmo confortável e foque na respiração." },
      { id: "day10-hab2", type: "habit", label: "Fazer um chá de hortelã", modalContent: "O chá de hortelã ajuda na digestão e tem efeito refrescante e calmante." },
    ],
  },
  {
    day: 11,
    title: "Foco na Consciência Alimentar e Hidratação",
    objective: "Reforçar hábitos alimentares e de hidratação.",
    phrase: "Nutrir seu corpo é nutrir sua alma. Faça escolhas que te elevam.",
    exercises: [
      { id: "day11-ex1", type: "exercise", label: "Automassagem com Movimentos Circulares", exerciseId: 7 },
      { id: "day11-ex2", type: "exercise", label: "Flexão de Braços na Parede", exerciseId: 23 },
    ],
    recipes: [
      { id: "day11-rec1", type: "recipe", label: "Tigela de Grãos com Vegetais Assados", recipeId: 9 },
    ],
    habits: [
      { id: "day11-hab1", type: "habit", label: "Beber 2.5 litros de água", modalContent: "Aumente levemente a hidratação. Distribua ao longo do dia e adicione rodelas de limão ou hortelã para variar." },
      { id: "day11-hab2", type: "habit", label: "Planejar as refeições do dia seguinte", modalContent: "Dedique 10 minutos para planejar o que vai comer amanhã. Isso ajuda a manter escolhas saudáveis." },
    ],
  },
  {
    day: 12,
    title: "Foco na Resistência e Funcionalidade",
    objective: "Aumentar a resistência e a funcionalidade no dia a dia.",
    phrase: "Cada desafio superado te torna mais forte. Acredite no seu potencial.",
    exercises: [
      { id: "day12-ex1", type: "exercise", label: "Subida e Descida de Degraus (Adaptado)", exerciseId: 29 },
      { id: "day12-ex2", type: "exercise", label: "Abertura de Pernas (Deitado de Lado)", exerciseId: 20 },
    ],
    recipes: [
      { id: "day12-rec1", type: "recipe", label: "Wrap de Frango com Abacate e Rúcula", recipeId: 10 },
    ],
    habits: [
      { id: "day12-hab1", type: "habit", label: "Elevar as pernas por 20 minutos", modalContent: "Aumente o tempo de elevação. Aproveite para relaxar e fazer exercícios de respiração." },
      { id: "day12-hab2", type: "habit", label: "Revisar a lista de Aliados Anti-inflamatórios", modalContent: "Relembre os alimentos que combatem a inflamação: peixes ricos em ômega-3, cúrcuma, gengibre, frutas vermelhas, folhas verdes." },
    ],
  },
  {
    day: 13,
    title: "Foco na Integração e Bem-Estar Mental",
    objective: "Integrar os novos hábitos e cuidar da mente.",
    phrase: "Sua jornada é única. Celebre cada passo, cada aprendizado.",
    exercises: [
      { id: "day13-ex1", type: "exercise", label: "Meditação Guiada de Visualização", exerciseId: 4 },
      { id: "day13-ex2", type: "exercise", label: "Elevação de Pernas com Drenagem", exerciseId: 8 },
    ],
    recipes: [
      { id: "day13-rec1", type: "recipe", label: "Salada de Quinoa com Grão de Bico e Ervas", recipeId: 11 },
    ],
    habits: [
      { id: "day13-hab1", type: "habit", label: "Registrar no Diário as conquistas da semana", modalContent: "Olhe para trás e anote tudo que conquistou. Cada hábito novo, cada exercício feito, cada escolha saudável conta." },
      { id: "day13-hab2", type: "habit", label: "Praticar a gratidão por 5 minutos", modalContent: "Pense em 3 coisas pelas quais você é grata hoje. Pode ser algo simples como um momento de paz ou uma refeição gostosa." },
    ],
  },
  {
    day: 14,
    title: "Foco na Celebração e Continuidade",
    objective: "Celebrar as conquistas e planejar a continuidade.",
    phrase: "Você transformou sua jornada. O Levvia é seu aliado para uma vida plena.",
    exercises: [
      { id: "day14-ex1", type: "exercise", label: "Caminhada Consciente", exerciseId: 28 },
      { id: "day14-ex2", type: "exercise", label: "Relaxamento Progressivo (Scan Corporal)", exerciseId: 3 },
    ],
    recipes: [
      { id: "day14-rec1", type: "recipe", label: "Bowl de Frutas com Iogurte Natural e Sementes", recipeId: 12 },
    ],
    habits: [
      { id: "day14-hab1", type: "habit", label: "Revisar o progresso dos 14 dias", modalContent: "Parabéns por chegar até aqui! Revise seu progresso, celebre suas conquistas e pense no que mais gostou de fazer." },
      { id: "day14-hab2", type: "habit", label: "Definir novas metas para as próximas semanas", modalContent: "O desafio de 14 dias terminou, mas sua jornada continua! Defina 2-3 metas para as próximas semanas." },
    ],
  },
];

// Incentive messages based on progress percentage
export function getIncentiveMessage(progress: number): string {
  if (progress === 0) return "Lembre-se: o Levvia não faz milagres, mas seu esforço transforma!";
  if (progress < 30) return "Você já começou, isso é o mais importante! Continue!";
  if (progress < 60) return "Bom progresso! Cada atividade concluída faz diferença.";
  if (progress < 100) return "Quase lá! Falta pouco para completar o dia!";
  return "🎉 Incrível! Você completou todas as atividades de hoje!";
}
