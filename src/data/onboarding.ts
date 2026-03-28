export interface OnboardingQuestion {
  id: number;
  type: "welcome" | "disclaimer" | "name" | "single" | "multi" | "result" | "info" | "info_list" | "number" | "body_metrics" | "pantry" | "install_pwa" | "heat_map";
  title: string;
  subtitle?: string;
  options?: string[];
  icon: string;
  /** For "number" type: input config */
  numberConfig?: { min?: number; max?: number; unit?: string; placeholder?: string };
  /** For "info_list" type: items to display */
  items?: string[];
}

export const onboardingSteps: OnboardingQuestion[] = [
  {
    id: 0,
    type: "welcome",
    title: "Bem-vinda ao Levvia",
    subtitle: "Seu caminho para a leveza. Vamos conhecer você melhor para personalizar sua experiência.",
    icon: "heart",
  },
  // Step 2 — Heat Map (visual body map)
  {
    id: 9,
    type: "heat_map",
    title: "Onde está o seu fogo interno?",
    subtitle: "Toque nas áreas do corpo onde você sente desconforto, dor ou inchaço.",
    icon: "body",
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
  // ── Anamnese: dados pessoais ──
  {
    id: 3,
    type: "number",
    title: "Qual a sua idade?",
    subtitle: "Precisamos saber para adaptar as recomendações ao seu perfil.",
    icon: "calendar",
    numberConfig: { min: 18, max: 120, unit: "anos", placeholder: "Ex: 35" },
  },
  {
    id: 4,
    type: "single",
    title: "Qual o seu sexo?",
    subtitle: "Esta informação nos ajuda a personalizar melhor o seu plano.",
    options: ["Feminino", "Masculino", "Prefiro não informar"],
    icon: "user",
  },
  {
    id: 5,
    type: "body_metrics",
    title: "Peso e Altura",
    subtitle: "Esses dados nos ajudam a entender melhor o seu corpo. Pode ser aproximado.",
    icon: "ruler",
  },
  // Step 8 — PWA (moved after body metrics)
  {
    id: 99,
    type: "install_pwa",
    title: "Instale o Levvia",
    subtitle: "Para a melhor experiência, adicione à sua tela inicial.",
    icon: "smartphone",
  },
  {
    id: 6,
    type: "single",
    title: "Qual o seu nível de atividade física atual?",
    subtitle: "Seja honesta — vamos adaptar tudo ao seu ritmo real.",
    options: [
      "Sedentária (pouco ou nenhum exercício)",
      "Leve (caminhadas leves, 1-2x por semana)",
      "Moderada (exercícios regulares, 3-4x por semana)",
      "Ativa (exercícios intensos, 5+ vezes por semana)",
    ],
    icon: "activity",
  },
  {
    id: 7,
    type: "multi",
    title: "Condições de Saúde",
    subtitle: "Você possui alguma dessas condições? Selecione todas que se aplicam. É opcional.",
    options: [
      "Lipedema diagnosticado",
      "Linfedema",
      "SOP (Síndrome do Ovário Policístico)",
      "Doença de Hashimoto",
      "Insuficiência venosa crônica",
      "Problemas circulatórios",
      "Artrite ou artrose",
      "Fibromialgia",
      "Diabetes",
      "Hipertensão",
      "Hipotireoidismo",
    ],
    icon: "stethoscope",
  },
  // ── Avaliação de dor (8-10) ──
  {
    id: 8,
    type: "single",
    title: "Como você descreveria seu nível de dor no dia a dia?",
    subtitle: "Onde está seu fogo interno? Seja honesta — não existe resposta errada.",
    options: ["Sem dor", "Dor leve", "Dor moderada", "Dor intensa", "Dor muito intensa"],
    icon: "thermometer",
  },
  // id 9 (areas afetadas) removed — replaced by heat_map step above
  {
    id: 10,
    type: "result",
    title: "Seu Fogo Interno",
    subtitle: "",
    icon: "flame",
  },
  // ── Alimentação (11-15) ──
  {
    id: 11,
    type: "info_list",
    title: "Seus Inimigos Inflamatórios",
    subtitle: "Estes alimentos tendem a intensificar a inflamação no lipedema. Ao longo da sua jornada, vamos te ajudar a reduzi-los gentilmente, sem proibições.",
    icon: "flame",
    items: [
      "Açúcar refinado e ultraprocessados",
      "Excesso de sal e embutidos",
      "Álcool",
      "Óleos vegetais refinados (soja, canola)",
      "Farinhas brancas em excesso",
    ],
  },
  {
    id: 12,
    type: "info_list",
    title: "Seus Aliados Anti-inflamatórios",
    subtitle: "Estes são seus aliados mais poderosos. Tente incluí-los na sua rotina — cada pequena escolha conta.",
    icon: "leaf",
    items: [
      "Cúrcuma com pimenta-do-reino",
      "Gengibre fresco",
      "Frutas vermelhas (mirtilo, framboesa, morango)",
      "Peixes ricos em ômega-3 (sardinha, salmão)",
      "Azeite de oliva extravirgem",
      "Chás funcionais (hibisco, cavalinha, dente-de-leão)",
    ],
  },
  {
    id: 13,
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
      "Alergia a Soja",
      "Alergia a Oleaginosas",
    ],
    icon: "shield",
  },
  {
    id: 14,
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
  // ── Despensa (novo passo 15) ──
  {
    id: 15,
    type: "pantry",
    title: "O que você costuma ter em casa?",
    subtitle: "Vamos sugerir receitas com ingredientes que você já tem.",
    icon: "shopping-bag",
  },
  // ── Objetivos (movido para 16) ──
  {
    id: 16,
    type: "multi",
    title: "Seu Objetivo em 14 Dias",
    subtitle: "Escolha até 3 objetivos para as próximas duas semanas.",
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
  // ── Análise Completa (movido para 17) ──
  {
    id: 17,
    type: "info",
    title: "Análise Completa! ✨",
    subtitle: "Reunimos todas as suas informações. Vamos ver seu mapeamento de bem-estar personalizado e descobrir como o Levvia pode te ajudar!",
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

// ─── Pantry ingredients by category ───

export interface PantryCategory {
  emoji: string;
  label: string;
  items: string[];
}

export const pantryCategories: PantryCategory[] = [
  {
    emoji: "🥚",
    label: "Proteínas",
    items: ["Ovos", "Frango", "Queijo branco", "Atum em lata", "Sardinha", "Queijo cottage"],
  },
  {
    emoji: "🌾",
    label: "Carboidratos",
    items: ["Aveia", "Tapioca", "Batata-doce", "Quinoa", "Arroz integral", "Feijão preto", "Feijão carioca", "Grão-de-bico", "Batata inglesa", "Macarrão integral", "Pão integral"],
  },
  {
    emoji: "🥑",
    label: "Gorduras boas",
    items: ["Abacate", "Azeite de oliva", "Castanhas", "Pasta de amendoim natural", "Coco ralado", "Linhaça", "Chia"],
  },
  {
    emoji: "🥬",
    label: "Vegetais",
    items: ["Tomate", "Alface", "Pepino", "Cenoura", "Abóbora", "Espinafre", "Brócolis", "Cebola", "Cebola roxa", "Couve", "Couve-flor", "Pimentão", "Rúcula", "Berinjela", "Abobrinha"],
  },
  {
    emoji: "🍋",
    label: "Frutas",
    items: ["Banana", "Maçã", "Limão", "Abacaxi", "Mamão", "Laranja", "Morango"],
  },
  {
    emoji: "🧂",
    label: "Especiarias",
    items: ["Cúrcuma", "Gengibre fresco", "Alho", "Pimenta-do-reino", "Canela", "Cominho", "Orégano", "Manjericão"],
  },
  {
    emoji: "🥛",
    label: "Laticínios/Probióticos",
    items: ["Iogurte natural", "Kefir", "Leite vegetal (amêndoa, coco, aveia)", "Iogurte vegetal", "Requeijão"],
  },
];

const animalProteins = ["Ovos", "Frango", "Queijo branco", "Atum em lata", "Sardinha", "Queijo cottage"];
const meatFish = ["Frango", "Atum em lata", "Sardinha"];
const dairyItems = ["Queijo branco", "Iogurte natural", "Kefir", "Queijo cottage", "Requeijão"];
const dairySubstitutes = ["Iogurte vegetal", "Leite vegetal (amêndoa, coco, aveia)"];
const glutenItems = ["Aveia"]; // regular oats may contain gluten

export function getFilteredPantryCategories(restrictions: string[]): PantryCategory[] {
  const isVegan = restrictions.includes("Vegano");
  const isVegetarian = restrictions.includes("Vegetariano");
  const noLactose = restrictions.includes("Sem Lactose");
  const noGluten = restrictions.includes("Sem Glúten");

  return pantryCategories.map((cat) => {
    let items = [...cat.items];

    if (isVegan) {
      items = items.filter((i) => !animalProteins.includes(i) && !dairyItems.includes(i));
    } else if (isVegetarian) {
      items = items.filter((i) => !meatFish.includes(i));
    }

    if (noLactose) {
      items = items.filter((i) => !dairyItems.includes(i));
      // Ensure substitutes are present
      for (const sub of dairySubstitutes) {
        if (!items.includes(sub)) items.push(sub);
      }
    }

    if (noGluten) {
      items = items.filter((i) => !glutenItems.includes(i));
    }

    return { ...cat, items };
  }).filter((cat) => cat.items.length > 0);
}
