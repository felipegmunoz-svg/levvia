export type TouchpointSlot = 'morning' | 'lunch' | 'afternoon' | 'night';

export interface NightTechnique {
  type: 'heatmap' | 'breathing' | 'food-traffic-light' | 'text-guide' | 'legs-elevation' | 'meditation';
  title: string;
  description: string;
  steps?: string[];
  duration?: string;
}

export interface DayTouchpointConfig {
  dayNumber: number;
  theme: string;
  purpose: string;
  affirmation: string;
  schedule: { slot: TouchpointSlot; time: string; label: string }[];
  morningExerciseLabel: string;
  morningShotLabel: string;
  lunchTip: string;
  afternoonHydrationText: string;
  afternoonMicroMovementLabel: string;
  afternoonSnackLabel: string;
  nightTechnique: NightTechnique;
  closingMessage: string;
  hydrationTexts: { morning: string; lunch: string; afternoon: string; night: string };
  afternoonKnowledgePill: string;
}

const TOUCHPOINT_CONFIGS: DayTouchpointConfig[] = [
  {
    dayNumber: 1,
    theme: 'Consciência Corporal',
    purpose: 'Mapear o Fogo',
    affirmation: 'Eu escolho ouvir o meu corpo com amor e paciência hoje.',
    schedule: [
      { slot: 'morning', time: '08:00', label: 'Respiração Diafragmática' },
      { slot: 'lunch', time: '12:00', label: 'Refeição Anti-inflamatória' },
      { slot: 'afternoon', time: '15:00', label: 'Bombeamento de Tornozelo' },
      { slot: 'night', time: '21:00', label: 'Mapa do Fogo Interno' },
    ],
    morningExerciseLabel: 'Respiração Diafragmática (Bomba Linfática Central) - 3 min',
    morningShotLabel: 'Shot de Cúrcuma e Limão',
    lunchTip: 'Coma devagar. A digestão começa na boca e o estresse trava a sua linfa.',
    afternoonHydrationText: 'Beba um copo de água com limão. A hidratação é o combustível da sua linfa.',
    afternoonMicroMovementLabel: 'Bombeamento de Tornozelo na Cama/Cadeira - 2 min',
    afternoonSnackLabel: 'Creme de Abacate com Chia',
    nightTechnique: {
      type: 'heatmap',
      title: 'Mapeamento do Fogo Interno',
      description: 'Toque nas áreas onde você sente mais dor, inchaço ou desconforto.',
      duration: '5 min',
    },
    closingMessage: 'Você deu o primeiro passo. Seu fogo tem nome agora — e você já começou a resfriá-lo.',
    hydrationTexts: {
      morning: 'Sua meta de ativação: {meta}ml até o almoço. Vamos juntas!',
      lunch: 'Você está no caminho certo! Mais {meta}ml até o lanche da tarde para manter o fluxo.',
      afternoon: 'Momento crítico do inchaço! Mantenha o fluxo: faltam {meta}ml para sua meta da tarde.',
      night: 'Finalizando o dia: {meta}ml para limpar o sistema antes de dormir. Você conseguiu!',
    },
    afternoonKnowledgePill: 'A linfa não tem bomba própria — ela depende do seu movimento e da sua hidratação para fluir.',
  },
  {
    dayNumber: 2,
    theme: 'O Rio Interno',
    purpose: 'Drenagem',
    affirmation: 'Minha linfa flui livremente, trazendo leveza para minhas pernas.',
    schedule: [
      { slot: 'morning', time: '08:00', label: 'Deslizamento de Calcanhar' },
      { slot: 'lunch', time: '12:00', label: 'Refeição Hidratante' },
      { slot: 'afternoon', time: '15:00', label: 'Círculos de Tornozelo' },
      { slot: 'night', time: '21:00', label: 'Automassagem Drenante' },
    ],
    morningExerciseLabel: 'Deslizamento de Calcanhar na Cama - 3 min',
    morningShotLabel: 'Suco Verde Detox (Couve, Maçã e Gengibre)',
    lunchTip: 'Alimentos ricos em água ajudam o seu \'rio interno\' a correr melhor.',
    afternoonHydrationText: 'Hidrate-se com água ou chá gelado de erva-doce. Sua linfa agradece.',
    afternoonMicroMovementLabel: 'Círculos de Tornozelo Elevados - 2 min',
    afternoonSnackLabel: 'Chips de Couve Crocante + Chá Gelado de Erva-Doce',
    nightTechnique: {
      type: 'text-guide',
      title: 'Automassagem das Pernas (Drenagem Ascendente)',
      description: 'Massagem suave de baixo para cima, ativando o retorno linfático.',
      duration: '5 min',
      steps: [
        'Sente-se confortavelmente com as pernas estendidas.',
        'Aplique óleo ou creme nas mãos.',
        'Comece pelos tornozelos, deslizando as mãos para cima com pressão suave.',
        'Suba até os joelhos com movimentos lentos e rítmicos.',
        'Continue dos joelhos até as coxas, sempre de baixo para cima.',
        'Repita 5 vezes em cada perna.',
        'Finalize com respirações profundas.',
      ],
    },
    closingMessage: 'Seu rio interno está fluindo. Você ativou canais que estavam adormecidos.',
    hydrationTexts: {
      morning: 'O rio interno precisa de água para fluir. Sua meta matinal: {meta}ml.',
      lunch: 'Alimentos ricos em água + hidratação = drenagem natural. Meta: {meta}ml agora.',
      afternoon: 'A linfa desacelera à tarde. Reative com {meta}ml de água ou chá.',
      night: 'Última meta do dia: {meta}ml. Seu corpo vai drenar enquanto você dorme.',
    },
    afternoonKnowledgePill: 'O sistema linfático transporta 3 litros de fluido por dia — sem água suficiente, ele estagna.',
  },
  {
    dayNumber: 3,
    theme: 'Alimento que Cura',
    purpose: 'Anti-inflamação',
    affirmation: 'Eu nutro meu corpo com o que há de melhor na natureza.',
    schedule: [
      { slot: 'morning', time: '08:00', label: 'Alongamento de Borboleta' },
      { slot: 'lunch', time: '12:00', label: 'Refeição Anti-inflamatória' },
      { slot: 'afternoon', time: '16:00', label: 'Flexão dos Pés' },
      { slot: 'night', time: '21:00', label: 'Semáforo Alimentar' },
    ],
    morningExerciseLabel: 'Alongamento de Borboleta (Sentado) - 3 min',
    morningShotLabel: 'Shot de Gengibre e Própolis',
    lunchTip: 'Cores no prato significam diferentes antioxidantes lutando por você.',
    afternoonHydrationText: 'Um chá de gengibre à tarde acelera o metabolismo e desinfla.',
    afternoonMicroMovementLabel: 'Flexão e Extensão dos Pés - 2 min',
    afternoonSnackLabel: 'Mix de Castanhas e Sementes de Girassol',
    nightTechnique: {
      type: 'food-traffic-light',
      title: 'O Semáforo Alimentar',
      description: 'Revisão interativa: verde (priorizar), amarelo (moderar), vermelho (evitar).',
      duration: '3 min',
    },
    closingMessage: 'Você aprendeu a linguagem do seu corpo através da comida. Cada cor no prato é um escudo.',
    hydrationTexts: {
      morning: 'Antioxidantes precisam de água para agir. Comece com {meta}ml.',
      lunch: 'Cada cor no prato é um escudo — potencialize com {meta}ml de água.',
      afternoon: 'Chá de gengibre conta! Meta da tarde: {meta}ml para acelerar o metabolismo.',
      night: 'Fechando o ciclo anti-inflamatório: {meta}ml antes de descansar.',
    },
    afternoonKnowledgePill: 'A cúrcuma precisa de pimenta preta e gordura para ser absorvida — biodisponibilidade importa!',
  },
  {
    dayNumber: 4,
    theme: 'O Sono Restaurador',
    purpose: 'Repouso',
    affirmation: 'Eu respeito o ritmo do meu corpo e o tempo de descanso.',
    schedule: [
      { slot: 'morning', time: '08:00', label: 'Ponte de Glúteos' },
      { slot: 'lunch', time: '12:00', label: 'Proteína Leve' },
      { slot: 'afternoon', time: '15:00', label: 'Rotação de Tornozelos' },
      { slot: 'night', time: '21:00', label: 'Respiração 4-7-8' },
    ],
    morningExerciseLabel: 'Ponte de Glúteos (Deitado) - 3 min',
    morningShotLabel: 'Suco de Melancia com Hortelã',
    lunchTip: 'Proteínas leves no almoço garantem energia sem pesar no sistema digestivo.',
    afternoonHydrationText: 'Hidrate-se bem à tarde para preparar o corpo para o descanso noturno.',
    afternoonMicroMovementLabel: 'Rotação de Tornozelos - 2 min',
    afternoonSnackLabel: 'Iogurte de Coco com Mirtilos',
    nightTechnique: {
      type: 'breathing',
      title: 'Respiração 4-7-8 + Caldo de Ervilha',
      description: 'Técnica de respiração que acalma o sistema nervoso, preparando para o sono profundo.',
      duration: '5 min',
    },
    closingMessage: 'Seu corpo se repara enquanto você dorme. Hoje você preparou o terreno para a cura noturna.',
    hydrationTexts: {
      morning: 'Bom dia! Hidrate o corpo que descansou: {meta}ml para começar.',
      lunch: 'Proteínas leves + água = digestão sem peso. Meta: {meta}ml.',
      afternoon: 'Prepare o corpo para o descanso: {meta}ml de hidratação agora.',
      night: 'Último gole consciente: {meta}ml. Seu corpo vai se reparar à noite.',
    },
    afternoonKnowledgePill: 'Durante o sono profundo, o sistema glinfático do cérebro faz uma "lavagem" — mas precisa de hidratação adequada.',
  },
  {
    dayNumber: 5,
    theme: 'Movimento Sem Dor',
    purpose: 'Bomba Linfática',
    affirmation: 'Cada movimento que eu faço libera o fluxo da minha vida.',
    schedule: [
      { slot: 'morning', time: '08:00', label: 'Elevação de Calcanhares' },
      { slot: 'lunch', time: '12:00', label: 'Refeição Energética' },
      { slot: 'afternoon', time: '15:00', label: 'Marcha Sentada' },
      { slot: 'night', time: '21:00', label: 'Pernas na Parede' },
    ],
    morningExerciseLabel: 'Elevação de Calcanhares (Panturrilha) - 3 min',
    morningShotLabel: 'Shot de Vinagre de Maçã e Canela',
    lunchTip: 'Sinta o sangue subindo. Suas panturrilhas são o segundo coração do seu corpo.',
    afternoonHydrationText: 'Após o movimento, reidrate. Água com uma fatia de pepino é refrescante e anti-inflamatória.',
    afternoonMicroMovementLabel: 'Marcha Sentada - 2 min',
    afternoonSnackLabel: 'Smoothie Verde de Abacaxi (Bromelina)',
    nightTechnique: {
      type: 'legs-elevation',
      title: 'Pernas para Cima na Parede (Viparita Karani)',
      description: 'Posição restaurativa que usa a gravidade para drenar o acúmulo de líquido nas pernas.',
      duration: '10 min',
      steps: [
        'Sente-se de lado junto a uma parede.',
        'Deite-se e suba as pernas apoiadas na parede.',
        'Ajuste a distância — seus glúteos podem encostar ou ficar a 10cm da parede.',
        'Braços abertos ao lado do corpo, palmas para cima.',
        'Feche os olhos e respire profundamente.',
        'Permaneça por 10 minutos.',
        'Para sair, dobre os joelhos e role para o lado.',
      ],
    },
    closingMessage: 'Suas pernas agradecem. A gravidade trabalhou a seu favor esta noite.',
    hydrationTexts: {
      morning: 'Suas panturrilhas precisam de fluido para bombear. Meta: {meta}ml.',
      lunch: 'Movimento + água = bomba linfática ativa. Mais {meta}ml agora.',
      afternoon: 'Após o movimento, reidrate: {meta}ml com pepino é refrescante e anti-inflamatório.',
      night: 'Meta final: {meta}ml. A gravidade vai ajudar a drenar enquanto suas pernas descansam.',
    },
    afternoonKnowledgePill: 'As panturrilhas são chamadas de "segundo coração" — ao contraí-las, bombeiam sangue e linfa de volta.',
  },
  {
    dayNumber: 6,
    theme: 'O Poder das Especiarias',
    purpose: 'Tempero que Cura',
    affirmation: 'Eu uso a sabedoria da terra para fortalecer minha saúde.',
    schedule: [
      { slot: 'morning', time: '08:00', label: 'Rotação de Ombros' },
      { slot: 'lunch', time: '12:00', label: 'Curry Anti-inflamatório' },
      { slot: 'afternoon', time: '15:00', label: 'Chá de Gengibre' },
      { slot: 'night', time: '21:00', label: 'Meditação de Visualização' },
    ],
    morningExerciseLabel: 'Rotação de Ombros e Pescoço - 3 min',
    morningShotLabel: 'Shot de Cúrcuma, Pimenta Preta e Azeite (Biodisponibilidade)',
    lunchTip: 'A pimenta preta \'acorda\' a cúrcuma. Juntas, elas são um escudo contra a inflamação.',
    afternoonHydrationText: 'Um chá de gengibre com limão à tarde potencializa os efeitos anti-inflamatórios do dia.',
    afternoonMicroMovementLabel: 'Grão-de-Bico Assado com Especiarias — Snack Ativo',
    afternoonSnackLabel: 'Chá de Gengibre com Limão',
    nightTechnique: {
      type: 'meditation',
      title: 'Meditação Guiada de Visualização (Cores do Fluxo)',
      description: 'Visualize cores frias (azul, verde-água) percorrendo seu corpo, resfriando cada área de dor.',
      duration: '5 min',
      steps: [
        'Deite-se confortavelmente e feche os olhos.',
        'Respire fundo 3 vezes — inspire pelo nariz, expire pela boca.',
        'Imagine uma luz azul-esverdeada (cor do Levvia) nascendo no topo da sua cabeça.',
        'Visualize essa luz descendo pelo pescoço, ombros e braços.',
        'Sinta a luz chegando ao abdômen, resfriando qualquer tensão.',
        'Agora a luz percorre seus quadris, coxas e joelhos.',
        'Sinta-a chegando às panturrilhas e tornozelos, dissolvendo peso e inchaço.',
        'Visualize a inflamação sendo levada embora como vapor.',
        'Permaneça nessa sensação de leveza por mais 1 minuto.',
        'Abra os olhos lentamente. Você está mais leve.',
      ],
    },
    closingMessage: 'A natureza tem tudo que você precisa. Hoje você usou seus aliados mais poderosos.',
    hydrationTexts: {
      morning: 'Especiarias + água = potência máxima. Comece com {meta}ml.',
      lunch: 'A pimenta preta ativa a cúrcuma — e a água leva tudo até as células. Meta: {meta}ml.',
      afternoon: 'Chá de gengibre com limão conta! Meta da tarde: {meta}ml.',
      night: 'Visualize a água limpando seu sistema. Última meta: {meta}ml.',
    },
    afternoonKnowledgePill: 'O gengibre contém gingerol, um composto que reduz inflamação de forma comparável a anti-inflamatórios.',
  },
  // Days 7-14: Placeholder
  ...Array.from({ length: 8 }, (_, i) => ({
    dayNumber: 7 + i,
    theme: 'Em Construção',
    purpose: 'Conteúdo em desenvolvimento',
    affirmation: 'Cada dia é uma oportunidade de cuidar de mim.',
    schedule: [
      { slot: 'morning' as TouchpointSlot, time: '08:00', label: 'Em breve' },
      { slot: 'lunch' as TouchpointSlot, time: '12:00', label: 'Em breve' },
      { slot: 'afternoon' as TouchpointSlot, time: '15:00', label: 'Em breve' },
      { slot: 'night' as TouchpointSlot, time: '21:00', label: 'Em breve' },
    ],
    morningExerciseLabel: 'Em breve',
    morningShotLabel: 'Em breve',
    lunchTip: 'Em breve',
    afternoonHydrationText: 'Em breve',
    afternoonMicroMovementLabel: 'Em breve',
    afternoonSnackLabel: 'Em breve',
    nightTechnique: {
      type: 'text-guide' as const,
      title: 'Reflexão do Dia',
      description: 'Momento de pausa e reflexão.',
      steps: [
        'Respire fundo.',
        'Observe como seu corpo se sente.',
        'Agradeça por mais um dia de cuidado.',
      ],
      duration: '3 min',
    },
    closingMessage: 'Mais um dia de cuidado. Você está no caminho certo.',
    hydrationTexts: {
      morning: 'Bom dia! Sua meta matinal: {meta}ml para ativar o fluxo.',
      lunch: 'Continue hidratando: mais {meta}ml para manter o ritmo.',
      afternoon: 'A tarde é o momento crítico. Meta: {meta}ml agora.',
      night: 'Última meta do dia: {meta}ml. Descanse bem hidratada.',
    },
    afternoonKnowledgePill: 'Cada dia de cuidado contínuo fortalece os hábitos que transformam sua saúde.',
  })),
];

export { TOUCHPOINT_CONFIGS };

export function getTouchpointConfig(dayNumber: number): DayTouchpointConfig {
  return (
    TOUCHPOINT_CONFIGS.find((d) => d.dayNumber === dayNumber) ??
    TOUCHPOINT_CONFIGS[TOUCHPOINT_CONFIGS.length - 1]
  );
}
