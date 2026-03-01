export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  actionType?: "modal" | "exercise" | "recipe" | "none";
  actionContent?: string; // modal text or exercise/recipe id
  actionTargetId?: number; // exercise or recipe id for navigation
}

export interface ChecklistCategory {
  id: string;
  title: string;
  icon: string;
  items: ChecklistItem[];
}

export const dailyChecklist: ChecklistCategory[] = [
  {
    id: "hidratacao",
    title: "Hidratação",
    icon: "droplets",
    items: [
      {
        id: "agua-limao",
        label: "Água com Limão ao acordar",
        actionType: "modal",
        actionContent: "Por que? O limão ajuda a alcalinizar o corpo e desperta o sistema digestivo suavemente. Beba um copo de água morna com meio limão espremido em jejum.",
      },
      {
        id: "agua2",
        label: "Beber pelo menos 1,5L de água ao longo do dia",
        actionType: "modal",
        actionContent: "A hidratação adequada é essencial para o sistema linfático funcionar corretamente e ajudar a reduzir o inchaço associado ao lipedema.",
      },
      {
        id: "cha",
        label: "Chá anti-inflamatório (gengibre ou cúrcuma)",
        actionType: "recipe",
        actionTargetId: 4,
      },
    ],
  },
  {
    id: "movimento",
    title: "Movimento",
    icon: "heart-pulse",
    items: [
      {
        id: "respiracao",
        label: "Respiração Matinal (3 min)",
        actionType: "exercise",
        actionTargetId: 1,
      },
      {
        id: "alongamento",
        label: "Alongar pernas e tornozelos",
        actionType: "exercise",
        actionTargetId: 9,
      },
      {
        id: "caminhada",
        label: "Caminhada leve (5-15 min)",
        actionType: "exercise",
        actionTargetId: 10,
      },
    ],
  },
  {
    id: "cuidado",
    title: "Autocuidado",
    icon: "sparkles",
    items: [
      {
        id: "drenagem",
        label: "Automassagem de drenagem",
        actionType: "exercise",
        actionTargetId: 6,
      },
      {
        id: "elevacao",
        label: "Elevar pernas por 10 min",
        actionType: "exercise",
        actionTargetId: 7,
      },
      {
        id: "meias",
        label: "Usar meias de compressão",
        actionType: "modal",
        actionContent: "As meias de compressão auxiliam no retorno venoso e linfático, reduzindo o inchaço e o desconforto ao longo do dia. Consulte seu médico sobre o grau de compressão ideal para você.",
      },
    ],
  },
  {
    id: "nutricao",
    title: "Nutrição",
    icon: "apple",
    items: [
      {
        id: "cafe-anti",
        label: "Café da manhã anti-inflamatório",
        actionType: "recipe",
        actionTargetId: 2,
      },
      {
        id: "anti-inflamatorio",
        label: "Incluir alimento anti-inflamatório no almoço",
        actionType: "modal",
        actionContent: "Inclua pelo menos um alimento anti-inflamatório no seu almoço: cúrcuma, gengibre, azeite extra virgem, vegetais verde-escuros, ou peixes ricos em ômega-3.",
      },
      {
        id: "evitar",
        label: "Evitar alimentos ultraprocessados",
        actionType: "modal",
        actionContent: "Alimentos ultraprocessados aumentam a inflamação no corpo. Tente substituir por opções naturais e integrais. Cada escolha conta!",
      },
    ],
  },
];
