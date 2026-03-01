export interface Recipe {
  id: number;
  title: string;
  category: string;
  time: string;
  servings: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  icon: string;
  tags: string[];
}

export const recipeCategories = [
  "Anti-inflamatório",
  "Café da Manhã",
  "Almoço/Jantar",
  "Lanches",
  "Bebidas",
];

export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Suco Verde Anti-inflamatório",
    category: "Bebidas",
    time: "5 min",
    servings: "1 porção",
    description: "Rico em antioxidantes, ajuda a reduzir a inflamação sistêmica associada ao lipedema.",
    ingredients: ["1 folha de couve", "1/2 pepino", "1 maçã verde", "Suco de 1 limão", "200ml de água de coco"],
    instructions: [
      "Lave bem todos os ingredientes",
      "Corte a couve, o pepino e a maçã em pedaços menores",
      "Coloque todos os ingredientes no liquidificador",
      "Bata por 1-2 minutos até ficar homogêneo",
      "Coe se preferir e sirva imediatamente",
    ],
    icon: "glass-water",
    tags: ["Anti-inflamatório", "Rápido"],
  },
  {
    id: 2,
    title: "Bowl de Açaí com Sementes",
    category: "Café da Manhã",
    time: "10 min",
    servings: "1 porção",
    description: "Repleto de antioxidantes e gorduras boas, ideal para começar o dia com energia.",
    ingredients: ["100g de polpa de açaí", "1 banana", "1 colher de granola sem açúcar", "Sementes de chia", "Frutas vermelhas"],
    instructions: [
      "Bata a polpa de açaí com meia banana no liquidificador até obter uma consistência cremosa",
      "Transfira para uma tigela",
      "Fatie a outra metade da banana por cima",
      "Adicione a granola, sementes de chia e frutas vermelhas",
      "Sirva imediatamente para manter a textura",
    ],
    icon: "cherry",
    tags: ["Antioxidante", "Energia"],
  },
  {
    id: 3,
    title: "Salada de Quinoa com Legumes",
    category: "Almoço/Jantar",
    time: "25 min",
    servings: "2 porções",
    description: "Prato completo e leve, rico em proteínas vegetais e fibras.",
    ingredients: ["1 xícara de quinoa", "1 pepino picado", "Tomates cereja", "Folhas de hortelã", "Azeite extra virgem", "Suco de limão"],
    instructions: [
      "Cozinhe a quinoa conforme instruções da embalagem e deixe esfriar",
      "Pique o pepino em cubinhos e corte os tomates cereja ao meio",
      "Pique as folhas de hortelã finamente",
      "Misture tudo em uma tigela grande",
      "Tempere com azeite extra virgem, suco de limão, sal e pimenta a gosto",
      "Sirva fria ou em temperatura ambiente",
    ],
    icon: "salad",
    tags: ["Proteína", "Fibras"],
  },
  {
    id: 4,
    title: "Chá de Gengibre com Cúrcuma",
    category: "Bebidas",
    time: "10 min",
    servings: "1 xícara",
    description: "Potente anti-inflamatório natural. O gengibre e a cúrcuma são aliados no combate ao inchaço.",
    ingredients: ["1 pedaço de gengibre fresco", "1/2 colher de cúrcuma", "Mel a gosto", "Suco de limão", "300ml de água quente"],
    instructions: [
      "Ferva a água em uma panela pequena",
      "Descasque e fatie o gengibre fresco em rodelas finas",
      "Adicione o gengibre e a cúrcuma na água fervente",
      "Deixe em infusão por 5-7 minutos em fogo baixo",
      "Coe e adicione o mel e o suco de limão",
      "Sirva quente",
    ],
    icon: "coffee",
    tags: ["Anti-inflamatório", "Quente"],
  },
  {
    id: 5,
    title: "Wrap de Frango com Abacate",
    category: "Almoço/Jantar",
    time: "15 min",
    servings: "1 porção",
    description: "Leve e nutritivo, com gorduras boas do abacate e proteína magra.",
    ingredients: ["1 tortilla integral", "100g de frango desfiado", "1/2 abacate", "Folhas verdes", "Tomate", "Temperos a gosto"],
    instructions: [
      "Aqueça a tortilla integral em uma frigideira seca por 30 segundos de cada lado",
      "Amasse o abacate com um garfo e tempere com sal e limão",
      "Espalhe o abacate amassado sobre a tortilla",
      "Distribua o frango desfiado, folhas verdes e tomate fatiado",
      "Enrole firmemente e corte ao meio",
      "Sirva imediatamente",
    ],
    icon: "sandwich",
    tags: ["Proteína", "Gorduras boas"],
  },
  {
    id: 6,
    title: "Smoothie de Frutas Vermelhas",
    category: "Lanches",
    time: "5 min",
    servings: "1 porção",
    description: "As frutas vermelhas são ricas em antocianinas, poderosos antioxidantes.",
    ingredients: ["1 xícara de frutas vermelhas", "1 banana", "200ml de leite vegetal", "1 colher de semente de linhaça"],
    instructions: [
      "Coloque as frutas vermelhas e a banana no liquidificador",
      "Adicione o leite vegetal",
      "Acrescente a semente de linhaça",
      "Bata até obter uma consistência homogênea e cremosa",
      "Sirva gelado",
    ],
    icon: "grape",
    tags: ["Antioxidante", "Rápido"],
  },
  {
    id: 7,
    title: "Sopa de Abóbora com Gengibre",
    category: "Almoço/Jantar",
    time: "30 min",
    servings: "4 porções",
    description: "Sopa cremosa e anti-inflamatória, perfeita para os dias mais frios.",
    ingredients: ["500g de abóbora", "1 cebola", "2 dentes de alho", "Gengibre fresco", "Caldo de legumes", "Azeite"],
    instructions: [
      "Descasque e corte a abóbora em cubos",
      "Refogue a cebola e o alho picados no azeite",
      "Adicione a abóbora e o gengibre ralado",
      "Cubra com o caldo de legumes e cozinhe por 20 minutos até a abóbora ficar macia",
      "Bata tudo no liquidificador até ficar cremoso",
      "Tempere com sal e pimenta a gosto e sirva quente",
    ],
    icon: "soup",
    tags: ["Anti-inflamatório", "Reconfortante"],
  },
  {
    id: 8,
    title: "Overnight Oats com Nozes",
    category: "Café da Manhã",
    time: "5 min + geladeira",
    servings: "1 porção",
    description: "Preparado na noite anterior, rico em fibras e ômega 3.",
    ingredients: ["1/2 xícara de aveia", "150ml de leite vegetal", "1 colher de mel", "Nozes picadas", "Canela"],
    instructions: [
      "Em um pote com tampa, misture a aveia com o leite vegetal",
      "Adicione o mel e a canela e misture bem",
      "Tampe e leve à geladeira por pelo menos 6 horas (ou durante a noite)",
      "Na manhã seguinte, adicione as nozes picadas por cima",
      "Pode adicionar frutas frescas a gosto",
    ],
    icon: "wheat",
    tags: ["Fibras", "Prático"],
  },
];
