export interface ChecklistCategory {
  id: string;
  title: string;
  icon: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
}

export const dailyChecklist: ChecklistCategory[] = [
  {
    id: "hidratacao",
    title: "Hidratação",
    icon: "droplets",
    items: [
      { id: "agua1", label: "Beber 1º copo de água ao acordar" },
      { id: "agua2", label: "Beber pelo menos 1,5L de água ao longo do dia" },
      { id: "cha", label: "Tomar chá anti-inflamatório" },
    ],
  },
  {
    id: "movimento",
    title: "Movimento",
    icon: "heart-pulse",
    items: [
      { id: "respiracao", label: "Fazer exercício de respiração (3 min)" },
      { id: "alongamento", label: "Alongar pernas e tornozelos" },
      { id: "caminhada", label: "Caminhada leve (5-15 min)" },
    ],
  },
  {
    id: "cuidado",
    title: "Autocuidado",
    icon: "sparkles",
    items: [
      { id: "drenagem", label: "Automassagem de drenagem" },
      { id: "elevacao", label: "Elevar pernas por 10 min" },
      { id: "meias", label: "Usar meias de compressão" },
    ],
  },
  {
    id: "nutricao",
    title: "Nutrição",
    icon: "apple",
    items: [
      { id: "frutas", label: "Comer frutas e vegetais coloridos" },
      { id: "anti-inflamatorio", label: "Incluir alimento anti-inflamatório" },
      { id: "evitar", label: "Evitar alimentos ultraprocessados" },
    ],
  },
];
