export type TouchpointSlot = 'morning' | 'lunch' | 'afternoon' | 'night';

export interface NightTechnique {
  type: 'heatmap' | 'breathing' | 'food-traffic-light' | 'text-guide' | 'legs-elevation' | 'meditation' | 'heatmap-comparative';
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
  affirmationRescue?: string;
  schedule: { slot: TouchpointSlot; time: string; label: string }[];
  morningExerciseLabel: string;
  morningExerciseLabelRescue?: string;
  morningShotLabel: string;
  lunchTip: string;
  lunchTipRescue?: string;
  afternoonHydrationText: string;
  afternoonMicroMovementLabel: string;
  afternoonMicroMovementLabelRescue?: string;
  afternoonSnackLabel: string;
  nightTechnique: NightTechnique;
  nightTechniqueRescue?: NightTechnique;
  closingMessage: string;
  closingMessageRescue?: string;
  hydrationTexts: { morning: string; lunch: string; afternoon: string; night: string };
  afternoonKnowledgePill: string;
  isCheckpointDay?: boolean;
}

const TOUCHPOINT_CONFIGS: DayTouchpointConfig[] = [
  // ── Day 1 ──
  {
    dayNumber: 1,
    theme: 'Consciência Corporal',
    purpose: 'Mapear o Fogo',
    affirmation: 'Eu escolho ouvir o meu corpo com amor e paciência hoje.',
    affirmationRescue: 'Hoje é sobre começar, não sobre ser perfeita. Cada passo que eu der é exatamente o suficiente.',
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
    closingMessage: 'Você deu o primeiro passo para a sua leveza. Sua linfa agradece o cuidado de hoje. Descanse, amanhã o fluxo continua.',
    hydrationTexts: {
      morning: 'Sua meta de ativação: {meta}ml até o almoço. Vamos juntas!',
      lunch: 'Você está no caminho certo! Mais {meta}ml até o lanche da tarde para manter o fluxo.',
      afternoon: 'Momento crítico do inchaço! Mantenha o fluxo: faltam {meta}ml para sua meta da tarde.',
      night: 'Finalizando o dia: {meta}ml para limpar o sistema antes de dormir. Você conseguiu!',
    },
    afternoonKnowledgePill: 'A linfa não tem bomba própria — ela depende do seu movimento e da sua hidratação para fluir.',
  },
  // ── Day 2 ──
  {
    dayNumber: 2,
    theme: 'O Rio Interno',
    purpose: 'Drenagem',
    affirmation: 'Minha linfa flui livremente, trazendo leveza para minhas pernas.',
    affirmationRescue: 'Minha linfa flui no ritmo que posso oferecer. Gentileza comigo é o meu maior remédio.',
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
    closingMessage: 'O movimento começou. Sinta a circulação melhorando sutilmente. Você está ensinando seu corpo a fluir novamente.',
    hydrationTexts: {
      morning: 'O rio interno precisa de água para fluir. Sua meta matinal: {meta}ml.',
      lunch: 'Alimentos ricos em água + hidratação = drenagem natural. Meta: {meta}ml agora.',
      afternoon: 'A linfa desacelera à tarde. Reative com {meta}ml de água ou chá.',
      night: 'Última meta do dia: {meta}ml. Seu corpo vai drenar enquanto você dorme.',
    },
    afternoonKnowledgePill: 'O sistema linfático transporta 3 litros de fluido por dia — sem água suficiente, ele estagna.',
  },
  // ── Day 3 ──
  {
    dayNumber: 3,
    theme: 'Alimento que Cura',
    purpose: 'Anti-inflamação',
    affirmation: 'Eu nutro meu corpo com o que há de melhor na natureza.',
    affirmationRescue: 'Cada alimento que eu escolho é um gesto de amor pelo meu corpo. Um passo de cada vez.',
    isCheckpointDay: true,
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
    closingMessage: 'Nutrir-se é um ato de amor. Hoje você combateu a inflamação de dentro para fora. Sinta-se mais leve ao deitar.',
    hydrationTexts: {
      morning: 'Antioxidantes precisam de água para agir. Comece com {meta}ml.',
      lunch: 'Cada cor no prato é um escudo — potencialize com {meta}ml de água.',
      afternoon: 'Chá de gengibre conta! Meta da tarde: {meta}ml para acelerar o metabolismo.',
      night: 'Fechando o ciclo anti-inflamatório: {meta}ml antes de descansar.',
    },
    afternoonKnowledgePill: 'A cúrcuma precisa de pimenta preta e gordura para ser absorvida — biodisponibilidade importa!',
  },
  // ── Day 4 ──
  {
    dayNumber: 4,
    theme: 'O Sono Restaurador',
    purpose: 'Repouso',
    affirmation: 'Eu respeito o ritmo do meu corpo e o tempo de descanso.',
    affirmationRescue: 'Meu descanso é sagrado. Eu dou permissão ao meu corpo para se restaurar no seu próprio tempo.',
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
    closingMessage: 'O descanso é onde a mágica acontece. Suas pernas trabalharam muito hoje; agora, deixe o sistema linfático se regenerar.',
    hydrationTexts: {
      morning: 'Bom dia! Hidrate o corpo que descansou: {meta}ml para começar.',
      lunch: 'Proteínas leves + água = digestão sem peso. Meta: {meta}ml.',
      afternoon: 'Prepare o corpo para o descanso: {meta}ml de hidratação agora.',
      night: 'Último gole consciente: {meta}ml. Seu corpo vai se reparar à noite.',
    },
    afternoonKnowledgePill: 'Durante o sono profundo, o sistema glinfático do cérebro faz uma "lavagem" — mas precisa de hidratação adequada.',
  },
  // ── Day 5 ──
  {
    dayNumber: 5,
    theme: 'Movimento Sem Dor',
    purpose: 'Bomba Linfática',
    affirmation: 'Cada movimento que eu faço libera o fluxo da minha vida.',
    affirmationRescue: 'Cada pequeno movimento é uma vitória. Eu honro o que o meu corpo consegue fazer hoje.',
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
    closingMessage: 'Movimento é vida, não punição. Você provou que é possível se exercitar com respeito ao seu limite. Parabéns!',
    hydrationTexts: {
      morning: 'Suas panturrilhas precisam de fluido para bombear. Meta: {meta}ml.',
      lunch: 'Movimento + água = bomba linfática ativa. Mais {meta}ml agora.',
      afternoon: 'Após o movimento, reidrate: {meta}ml com pepino é refrescante e anti-inflamatório.',
      night: 'Meta final: {meta}ml. A gravidade vai ajudar a drenar enquanto suas pernas descansam.',
    },
    afternoonKnowledgePill: 'As panturrilhas são chamadas de "segundo coração" — ao contraí-las, bombeiam sangue e linfa de volta.',
  },
  // ── Day 6 ──
  {
    dayNumber: 6,
    theme: 'O Poder das Especiarias',
    purpose: 'Tempero que Cura',
    affirmation: 'Eu uso a sabedoria da terra para fortalecer minha saúde.',
    affirmationRescue: 'O meu ritmo é perfeito para mim. Cada tempero é um aliado gentil na minha jornada.',
    isCheckpointDay: true,
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
    closingMessage: 'Pequenos detalhes, grandes resultados. O tempero de hoje foi o seu remédio natural. Continue firme no seu propósito.',
    hydrationTexts: {
      morning: 'Especiarias + água = potência máxima. Comece com {meta}ml.',
      lunch: 'A pimenta preta ativa a cúrcuma — e a água leva tudo até as células. Meta: {meta}ml.',
      afternoon: 'Chá de gengibre com limão conta! Meta da tarde: {meta}ml.',
      night: 'Visualize a água limpando seu sistema. Última meta: {meta}ml.',
    },
    afternoonKnowledgePill: 'O gengibre contém gingerol, um composto que reduz inflamação de forma comparável a anti-inflamatórios.',
  },
  // ── Day 7 — O Marco da Leveza ──
  {
    dayNumber: 7,
    theme: 'O Marco da Leveza',
    purpose: 'Celebrar a primeira semana',
    affirmation: 'Eu celebro cada pequena vitória e a leveza que conquistei nesta semana.',
    affirmationRescue: 'Chegar até o Dia 7 já é uma vitória. Eu me honro por estar aqui.',
    isCheckpointDay: true,
    schedule: [
      { slot: 'morning', time: '08:00', label: 'Drenagem Ativa' },
      { slot: 'lunch', time: '12:00', label: 'Refeição Celebrativa' },
      { slot: 'afternoon', time: '15:00', label: 'Hidratação' },
      { slot: 'night', time: '21:00', label: 'Comparativo do Fogo' },
    ],
    morningExerciseLabel: 'Drenagem Linfática Ativa (Bicicleta no Ar) - 5 min',
    morningShotLabel: 'Shot de Limão, Gengibre e Canela',
    lunchTip: 'Olhe para o seu prato e veja o arco-íris de nutrientes que você deu ao seu corpo nos últimos 7 dias.',
    afternoonHydrationText: 'Uma semana de hidratação! Continue com água ou chá gelado para celebrar.',
    afternoonMicroMovementLabel: 'Elevação de Calcanhares (Panturrilha) - 2 min',
    afternoonSnackLabel: 'Smoothie de Frutas Vermelhas',
    nightTechnique: {
      type: 'heatmap-comparative',
      title: 'Comparativo do Fogo',
      description: 'Marque como se sente hoje e compare com o Dia 1.',
      duration: '5 min',
    },
    closingMessage: 'Metade da jornada concluída! Olhe para trás e veja o quanto você já aprendeu sobre o seu corpo. Você é vitoriosa.',
    hydrationTexts: {
      morning: 'Celebre com hidratação! Meta matinal: {meta}ml para manter o fluxo.',
      lunch: 'Uma semana nutrindo seu corpo. Continue: {meta}ml agora.',
      afternoon: 'Você chegou até aqui! Meta da tarde: {meta}ml.',
      night: 'Última meta da semana 1: {meta}ml. Descanse orgulhosa.',
    },
    afternoonKnowledgePill: 'Após 7 dias de hidratação consistente, o sistema linfático já mostra melhora na eficiência de drenagem.',
  },
  // ── Day 8 — Intensificação ──
  {
    dayNumber: 8,
    theme: 'Intensificação',
    purpose: 'Intensificar drenagem',
    affirmation: 'Eu sou a prova viva da minha transformação. Meu corpo é um rio de vida.',
    schedule: [
      { slot: 'morning', time: '08:00', label: 'Agachamento na Parede' },
      { slot: 'lunch', time: '12:00', label: 'Refeição Intensificada' },
      { slot: 'afternoon', time: '15:00', label: 'Caminhada Consciente' },
      { slot: 'night', time: '21:00', label: 'Meditação de Gratidão' },
    ],
    morningExerciseLabel: 'Agachamento na Parede (Isometria) - 3 min',
    morningShotLabel: 'Shot de Gengibre, Limão e Pimenta Caiena',
    lunchTip: 'Seu corpo é seu templo. Continue nutrindo-o com amor e consciência.',
    afternoonHydrationText: 'Intensifique a hidratação: água com gengibre e limão para potência máxima.',
    afternoonMicroMovementLabel: 'Caminhada Consciente - 10 min',
    afternoonSnackLabel: 'Smoothie de Abacaxi com Hortelã',
    nightTechnique: {
      type: 'meditation',
      title: 'Meditação Guiada de Gratidão',
      description: 'Foco em bem-estar e reconhecimento.',
      duration: '5 min',
    },
    closingMessage: 'Subimos um degrau. A persistência é o que transforma o alívio temporário em bem-estar permanente. Vamos juntas!',
    hydrationTexts: {
      morning: 'Dia de intensificação! Meta matinal: {meta}ml.',
      lunch: 'Nutra e hidrate: {meta}ml para potencializar.',
      afternoon: 'Após o movimento, reidrate: {meta}ml.',
      night: 'Meta noturna: {meta}ml. Seu corpo agradece.',
    },
    afternoonKnowledgePill: 'A isometria ativa a bomba muscular sem impacto nas articulações.',
  },
  // ── Day 9 ──
  {
    dayNumber: 9,
    theme: 'Ritmo e Fluxo',
    purpose: 'Manter a constância',
    affirmation: 'Meu corpo responde ao cuidado que eu ofereço. Eu sinto a diferença.',
    schedule: [
      { slot: 'morning', time: '08:00', label: 'Agachamento na Parede' },
      { slot: 'lunch', time: '12:00', label: 'Refeição Intensificada' },
      { slot: 'afternoon', time: '15:00', label: 'Caminhada Consciente' },
      { slot: 'night', time: '21:00', label: 'Meditação de Gratidão' },
    ],
    morningExerciseLabel: 'Agachamento na Parede (Isometria) - 3 min',
    morningShotLabel: 'Shot de Gengibre, Limão e Pimenta Caiena',
    lunchTip: 'Seu corpo é seu templo. Continue nutrindo-o com amor e consciência.',
    afternoonHydrationText: 'Continue hidratando: água com gengibre para manter o ritmo.',
    afternoonMicroMovementLabel: 'Caminhada Consciente - 10 min',
    afternoonSnackLabel: 'Smoothie de Abacaxi com Hortelã',
    nightTechnique: {
      type: 'meditation',
      title: 'Meditação Guiada de Gratidão',
      description: 'Foco em bem-estar e reconhecimento.',
      duration: '5 min',
    },
    closingMessage: 'Seu corpo já entende o novo ritmo. A hidratação e o movimento agora são seus aliados naturais. Sinta a diferença.',
    hydrationTexts: {
      morning: 'Mais um dia de fluxo! Meta matinal: {meta}ml.',
      lunch: 'Continue nutrindo: {meta}ml para manter o ritmo.',
      afternoon: 'A tarde pede hidratação: {meta}ml agora.',
      night: 'Quase lá! Meta noturna: {meta}ml.',
    },
    afternoonKnowledgePill: 'A caminhada consciente ativa a bomba muscular da panturrilha.',
  },
  // ── Day 10 ──
  {
    dayNumber: 10,
    theme: 'Autonomia',
    purpose: 'Escolhas conscientes',
    affirmation: 'Eu construo minha saúde um dia de cada vez. Hoje eu escolho o fluxo.',
    isCheckpointDay: true,
    schedule: [
      { slot: 'morning', time: '08:00', label: 'Agachamento na Parede' },
      { slot: 'lunch', time: '12:00', label: 'Refeição Intensificada' },
      { slot: 'afternoon', time: '15:00', label: 'Caminhada Consciente' },
      { slot: 'night', time: '21:00', label: 'Meditação de Gratidão' },
    ],
    morningExerciseLabel: 'Agachamento na Parede (Isometria) - 3 min',
    morningShotLabel: 'Shot de Gengibre, Limão e Pimenta Caiena',
    lunchTip: 'Seu corpo é seu templo. Continue nutrindo-o com amor e consciência.',
    afternoonHydrationText: 'Checkpoint de hidratação! Reforce com {meta}ml agora.',
    afternoonMicroMovementLabel: 'Caminhada Consciente - 10 min',
    afternoonSnackLabel: 'Smoothie de Abacaxi com Hortelã',
    nightTechnique: {
      type: 'meditation',
      title: 'Meditação Guiada de Gratidão',
      description: 'Foco em bem-estar e reconhecimento.',
      duration: '5 min',
    },
    closingMessage: 'Você está no comando. Cada escolha consciente de hoje reflete na leveza de amanhã. O controle é seu.',
    hydrationTexts: {
      morning: 'Checkpoint! Meta matinal: {meta}ml.',
      lunch: 'Continue forte: {meta}ml para manter a intensificação.',
      afternoon: 'Reta final da tarde: {meta}ml.',
      night: 'Dia 10 concluído! Última meta: {meta}ml.',
    },
    afternoonKnowledgePill: 'Após 10 dias, o corpo começa a criar novos caminhos linfáticos.',
  },
  // ── Day 11 ──
  {
    dayNumber: 11,
    theme: 'Escuta Ativa',
    purpose: 'Ouvir o corpo',
    affirmation: 'Eu sou forte, capaz e faço escolhas que me nutrem.',
    schedule: [
      { slot: 'morning', time: '08:00', label: 'Ponte de Glúteos' },
      { slot: 'lunch', time: '12:00', label: 'Refeição Consciente' },
      { slot: 'afternoon', time: '15:00', label: 'Subida de Degraus' },
      { slot: 'night', time: '21:00', label: 'Visualização do Futuro' },
    ],
    morningExerciseLabel: 'Ponte de Glúteos (Elevação Pélvica) - 5 min',
    morningShotLabel: 'Shot de Maçã, Canela e Pimenta do Reino',
    lunchTip: 'Você se tornou uma expert em nutrir seu corpo. Confie na sua intuição.',
    afternoonHydrationText: 'Autonomia inclui se hidratar por conta própria. Continue!',
    afternoonMicroMovementLabel: 'Subida e Descida de Degraus - 5 min',
    afternoonSnackLabel: 'Chá Gelado de Hibisco com Maçã',
    nightTechnique: {
      type: 'meditation',
      title: 'Meditação Guiada de Visualização',
      description: 'Foco em reforçar a nova identidade.',
      duration: '7 min',
    },
    closingMessage: 'Ouvir o corpo é uma arte. Hoje você foi mestre nisso. O inchaço cede onde o cuidado floresce.',
    hydrationTexts: {
      morning: 'Autonomia começa com autocuidado. Meta: {meta}ml.',
      lunch: 'Escolhas conscientes + água = poder. Meta: {meta}ml.',
      afternoon: 'Você já sabe o caminho. Meta da tarde: {meta}ml.',
      night: 'Noite de fortalecimento. Última meta: {meta}ml.',
    },
    afternoonKnowledgePill: 'A ponte de glúteos melhora a circulação na região das pernas.',
  },
  // ── Day 12 ──
  {
    dayNumber: 12,
    theme: 'Resiliência',
    purpose: 'Persistência',
    affirmation: 'Meu corpo e eu somos um time. Juntos, somos imbatíveis.',
    schedule: [
      { slot: 'morning', time: '08:00', label: 'Ponte de Glúteos' },
      { slot: 'lunch', time: '12:00', label: 'Refeição Consciente' },
      { slot: 'afternoon', time: '15:00', label: 'Subida de Degraus' },
      { slot: 'night', time: '21:00', label: 'Visualização do Futuro' },
    ],
    morningExerciseLabel: 'Ponte de Glúteos (Elevação Pélvica) - 5 min',
    morningShotLabel: 'Shot de Maçã, Canela e Pimenta do Reino',
    lunchTip: 'Você se tornou uma expert em nutrir seu corpo. Confie na sua intuição.',
    afternoonHydrationText: 'Continue se hidratando com autonomia.',
    afternoonMicroMovementLabel: 'Subida e Descida de Degraus - 5 min',
    afternoonSnackLabel: 'Chá Gelado de Hibisco com Maçã',
    nightTechnique: {
      type: 'meditation',
      title: 'Meditação Guiada de Visualização',
      description: 'Foco em reforçar a nova identidade.',
      duration: '7 min',
    },
    closingMessage: 'Reta final! Mesmo nos dias difíceis, você escolheu o autocuidado. Essa é a verdadeira força da mulher Levvia.',
    hydrationTexts: {
      morning: 'Bom dia, guerreira! Meta matinal: {meta}ml.',
      lunch: 'Seu time (corpo + mente) precisa de {meta}ml.',
      afternoon: 'Reta final da tarde: {meta}ml.',
      night: 'Mais um dia vencido. Última meta: {meta}ml.',
    },
    afternoonKnowledgePill: 'Subir degraus ativa a panturrilha intensamente.',
  },
  // ── Day 13 ──
  {
    dayNumber: 13,
    theme: 'Preparação',
    purpose: 'Véspera da vitória',
    affirmation: 'Eu confio no meu corpo e no caminho que construí.',
    schedule: [
      { slot: 'morning', time: '08:00', label: 'Ponte de Glúteos' },
      { slot: 'lunch', time: '12:00', label: 'Refeição Consciente' },
      { slot: 'afternoon', time: '15:00', label: 'Subida de Degraus' },
      { slot: 'night', time: '21:00', label: 'Visualização do Futuro' },
    ],
    morningExerciseLabel: 'Ponte de Glúteos (Elevação Pélvica) - 5 min',
    morningShotLabel: 'Shot de Maçã, Canela e Pimenta do Reino',
    lunchTip: 'Você se tornou uma expert em nutrir seu corpo.',
    afternoonHydrationText: 'Amanhã é o grande dia! Prepare-se hidratando bem hoje.',
    afternoonMicroMovementLabel: 'Subida e Descida de Degraus - 5 min',
    afternoonSnackLabel: 'Chá Gelado de Hibisco com Maçã',
    nightTechnique: {
      type: 'meditation',
      title: 'Meditação Guiada de Visualização',
      description: 'Foco em reforçar a nova identidade.',
      duration: '7 min',
    },
    closingMessage: 'Amanhã celebramos sua transformação. Prepare o coração (e as pernas) para o novo eu que está surgindo.',
    hydrationTexts: {
      morning: 'Penúltimo dia! Meta matinal: {meta}ml.',
      lunch: 'Quase lá! Continue: {meta}ml.',
      afternoon: 'Preparação final: {meta}ml.',
      night: 'Véspera do grande dia. Última meta: {meta}ml.',
    },
    afternoonKnowledgePill: 'A consistência de 13 dias criou um novo hábito.',
  },
  // ── Day 14 — O Novo Eu ──
  {
    dayNumber: 14,
    theme: 'O Novo Eu',
    purpose: 'Celebração Final',
    affirmation: 'Eu não sou mais a mesma do Dia 1. Eu sou leve, forte e fluida.',
    isCheckpointDay: true,
    schedule: [
      { slot: 'morning', time: '08:00', label: 'Alongamento Total' },
      { slot: 'lunch', time: '12:00', label: 'Refeição de Celebração' },
      { slot: 'afternoon', time: '15:00', label: 'Micro-movimento' },
      { slot: 'night', time: '21:00', label: 'Ritual de Passagem' },
    ],
    morningExerciseLabel: 'Alongamento de Parede para o Corpo Todo - 5 min',
    morningShotLabel: 'Shot de Manutenção',
    lunchTip: 'Você se tornou uma alquimista da sua saúde.',
    afternoonHydrationText: 'Último dia de jornada! Celebre cada gole.',
    afternoonMicroMovementLabel: 'Rotação de Quadril - 3 min',
    afternoonSnackLabel: 'Energy Balls de Tâmaras e Coco',
    nightTechnique: {
      type: 'meditation',
      title: 'Meditação Guiada de Visualização',
      description: 'Reforçar a nova identidade.',
      duration: '10 min',
    },
    closingMessage: 'VOCÊ CONSEGUIU! 14 dias de dedicação, alívio e autoconhecimento. Sua jornada de leveza está apenas começando. Confira seu Relatório Médico final!',
    hydrationTexts: {
      morning: 'Último dia! Meta matinal: {meta}ml.',
      lunch: 'Brinde ao seu corpo: {meta}ml.',
      afternoon: 'Quase concluindo: {meta}ml.',
      night: 'Última meta da jornada: {meta}ml. Você conseguiu! 🎉',
    },
    afternoonKnowledgePill: 'Parabéns! 14 dias de cuidado criaram novos padrões neurais.',
  },
];

export { TOUCHPOINT_CONFIGS };

export function getTouchpointConfig(dayNumber: number): DayTouchpointConfig {
  return (
    TOUCHPOINT_CONFIGS.find((d) => d.dayNumber === dayNumber) ??
    TOUCHPOINT_CONFIGS[TOUCHPOINT_CONFIGS.length - 1]
  );
}
