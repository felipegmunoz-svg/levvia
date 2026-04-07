export type TouchpointSlot = "morning" | "lunch" | "afternoon" | "night";

export interface NightTechnique {
  type: string;
  name: string;
  description: string;
  details?: string;
  duration?: string;
  steps?: string[];
  benefits?: string[];
  zones?: string[];
  previousDayKey?: string;
}

export function getTouchpointConfig(day: number) {
  return touchpointConfig[day] ?? null;
}

export const touchpointConfig: { [key: number]: any } = {
  1: {
    title: "Consciência Corporal",
    affirmation: "Eu escolho ouvir o meu corpo com amor e paciência hoje.",
    hydrationTarget: 2600,
    touchpoints: [
      {
        id: "morning_exercise_1",
        time: "08:00",
        type: "exercise",
        name: "Respiração Diafragmática Básica",
        duration: "2-3 min",
        description: "Ative sua bomba linfática e prepare seu shot anti-inflamatório base.",
        details:
          "Deite-se de costas, coloque uma mão no peito e outra no abdômen. Inspire profundamente pelo nariz, sentindo o abdômen expandir. Expire lentamente pela boca, contraindo o abdômen. Repita por 2-3 minutos. Isso ajuda a estimular o sistema linfático e a reduzir o estresse.",
      },
      {
        id: "morning_recipe_1",
        time: "08:30",
        type: "recipe",
        name: "Shot de Pepino e Hortelã",
        description:
          "A hidratação é essencial para o sistema linfático. O pepino fornece fisetina e a hortelã contém mentol com propriedades anti-inflamatórias.",
        ingredients: [
          "1/2 pepino",
          "5 folhas de hortelã fresca",
          "100ml de água filtrada",
          "Suco de 1/2 limão (opcional)",
        ],
        preparation:
          "Bata todos os ingredientes no liquidificador e coe se preferir. Beba imediatamente. Ideal para começar o dia com desintoxicação e frescor.",
      },
      {
        id: "lunch_recipe_1",
        time: "12:00",
        type: "recipe",
        name: "Wrap de Couve com Lentilha",
        description: "Nutrição consciente: Bowl de coco ou Crepioca? Escolha seu fluxo.",
        ingredients: [
          "2 folhas grandes de couve",
          "1/2 xícara de lentilha cozida",
          "1/4 xícara de cenoura ralada",
          "1/4 xícara de pepino picado",
          "Molho de tahine e limão a gosto",
        ],
        preparation:
          "Cozinhe as lentilhas. Misture com cenoura, pepino e molho. Recheie as folhas de couve e enrole como um wrap. Uma refeição leve, rica em fibras e nutrientes anti-inflamatórios.",
      },
      {
        id: "afternoon_exercise_1",
        time: "15:00",
        type: "exercise",
        name: "Bombeamento de Tornozelo",
        duration: "5 min",
        description: "Momento crítico do inchaço: micro-movimento e hidratação estratégica.",
        details:
          "Sentada ou deitada, movimente os pés para cima e para baixo, como se estivesse bombeando. Faça 20 repetições. Em seguida, faça círculos com os tornozelos em ambas as direções. Repita por 5 minutos. Ajuda a ativar a circulação e reduzir o inchaço nas pernas.",
      },
      {
        id: "night_heatmap_1",
        time: "21:00",
        type: "heatmap",
        name: "Mapa do Fogo Interno",
        description: "Restauração profunda: mapeie seu fogo interno e limpe o sistema.",
        details:
          "Reflita sobre as áreas do seu corpo onde você sentiu mais dor, inchaço ou desconforto hoje. Marque-as no mapa de calor para acompanhar sua evolução. Isso ajuda a criar consciência corporal e a identificar padrões.",
      },
    ],
    completionMessage:
      "Parabéns por completar o Dia 1! Você deu o primeiro passo crucial para entender e aliviar o lipedema. Sinta-se orgulhosa da sua jornada de autoconhecimento e cuidado. Amanhã, continuaremos a construir sua base de bem-estar. Descanse bem!",
    previewText:
      "No Dia 2, você vai aprender a ativar ainda mais a sua circulação com exercícios específicos e descobrir receitas que nutrem seu corpo de dentro para fora.",
  },
  2: {
    title: "Ativação e Nutrição",
    affirmation: "Eu nutro meu corpo com escolhas que me trazem leveza e vitalidade.",
    hydrationTarget: 2700,
    touchpoints: [
      {
        id: "morning_exercise_2",
        time: "08:00",
        type: "exercise",
        name: "Caminhada Leve e Alongamento",
        duration: "15 min",
        description: "Comece o dia ativando a circulação e preparando o corpo para a leveza.",
        details:
          "Faça uma caminhada leve de 10 minutos, seguida de 5 minutos de alongamentos suaves para as pernas e panturrilhas. Concentre-se em movimentos fluidos que não causem dor. Isso melhora o fluxo linfático e a flexibilidade.",
      },
      {
        id: "morning_recipe_2",
        time: "08:45",
        type: "recipe",
        name: "Smoothie Verde Detox",
        description: "Um shot de nutrientes para desinflamar e energizar o corpo.",
        ingredients: ["1 folha de couve", "1/2 maçã verde", "1/4 pepino", "Gengibre a gosto", "200ml de água de coco"],
        preparation:
          "Bata todos os ingredientes no liquidificador até obter uma mistura homogênea. Beba imediatamente. Rico em antioxidantes e fibras, este smoothie apoia a desintoxicação e a redução do inchaço.",
      },
      {
        id: "lunch_recipe_2",
        time: "12:30",
        type: "recipe",
        name: "Salada de Quinoa com Vegetais Assados",
        description: "Uma refeição completa e anti-inflamatória para o seu almoço.",
        ingredients: [
          "1 xícara de quinoa cozida",
          "1/2 abobrinha em cubos",
          "1/2 berinjela em cubos",
          "1/4 pimentão vermelho em tiras",
          "Azeite de oliva, sal e pimenta a gosto",
        ],
        preparation:
          "Asse os vegetais com azeite, sal e pimenta até ficarem macios. Misture com a quinoa cozida. Sirva morno ou frio. Esta salada é uma excelente fonte de proteína vegetal e vegetais ricos em fitoquímicos anti-inflamatórios.",
      },
      {
        id: "afternoon_exercise_2",
        time: "15:30",
        type: "exercise",
        name: "Elevação de Panturrilhas",
        duration: "3 min",
        description: "Ative a bomba muscular das panturrilhas para auxiliar o retorno venoso e linfático.",
        details:
          "Em pé, com os pés paralelos, eleve os calcanhares do chão, contraindo as panturrilhas. Mantenha por um segundo e retorne lentamente. Faça 3 séries de 15 repetições. Este exercício é simples, mas poderoso para impulsionar a circulação nas pernas.",
      },
      {
        id: "night_reflection_2",
        time: "21:00",
        type: "journal",
        name: "Diário de Leveza",
        description: "Reflita sobre as sensações do seu corpo e as escolhas que fez hoje.",
        details:
          "Escreva sobre como você se sentiu hoje. Houve momentos de mais leveza? Quais foram os desafios? O que você aprendeu sobre seu corpo e suas necessidades? Registrar suas percepções ajuda a criar um mapa pessoal de bem-estar.",
      },
    ],
    completionMessage:
      "Dia 2 concluído! Você está construindo hábitos poderosos que transformam seu corpo e sua mente. Cada escolha consciente é um passo em direção à leveza e ao alívio. Continue firme, sua jornada está apenas começando!",
    previewText:
      "No Dia 3, vamos focar em técnicas de drenagem linfática manual simples que você pode fazer em casa e explorar alimentos que potencializam a desinflamação.",
  },
  3: {
    title: "Drenagem e Desinflamação",
    affirmation: "Eu sou capaz de ativar a cura do meu corpo com minhas próprias mãos.",
    hydrationTarget: 2800,
    touchpoints: [
      {
        id: "morning_exercise_3",
        time: "08:00",
        type: "exercise",
        name: "Drenagem Linfática Manual (Pernas)",
        duration: "10 min",
        description: "Comece o dia com uma técnica suave para reduzir o inchaço nas pernas.",
        details:
          "Deitada, com as pernas elevadas, faça movimentos suaves e rítmicos com as mãos, do tornozelo em direção à virilha. Use uma pressão leve, como se estivesse acariciando a pele. Repita 10-15 vezes em cada perna. Isso estimula o fluxo linfático e alivia a sensação de peso.",
      },
      {
        id: "morning_recipe_3",
        time: "08:45",
        type: "recipe",
        name: "Chá de Gengibre e Limão",
        description: "Um chá poderoso para iniciar o processo de desinflamação interna.",
        ingredients: [
          "1 pedaço de gengibre fresco (2cm)",
          "Suco de 1/2 limão",
          "200ml de água quente",
          "Mel a gosto (opcional)",
        ],
        preparation:
          "Fatie o gengibre e adicione à água quente. Deixe em infusão por 5 minutos. Adicione o suco de limão e mel se desejar. O gengibre é um potente anti-inflamatório natural, e o limão auxilia na desintoxicação.",
      },
      {
        id: "lunch_recipe_3",
        time: "12:30",
        type: "recipe",
        name: "Sopa Creme de Abóbora com Cúrcuma",
        description: "Uma refeição quente e reconfortante, rica em nutrientes anti-inflamatórios.",
        ingredients: [
          "2 xícaras de abóbora em cubos",
          "1/2 cebola picada",
          "1 dente de alho picado",
          "1 colher de chá de cúrcuma",
          "500ml de caldo de legumes caseiro",
          "Leite de coco a gosto (opcional)",
        ],
        preparation:
          "Refogue a cebola e o alho. Adicione a abóbora e a cúrcuma. Cubra com caldo de legumes e cozinhe até a abóbora ficar macia. Bata no liquidificador até obter um creme. Adicione leite de coco para cremosidade. A cúrcuma é um dos mais poderosos anti-inflamatórios naturais.",
      },
      {
        id: "afternoon_exercise_3",
        time: "15:30",
        type: "exercise",
        name: "Alongamento de Cadeia Posterior",
        duration: "5 min",
        description: "Alivie a tensão e melhore a flexibilidade, essencial para o conforto das pernas.",
        details:
          "Sentada no chão com as pernas esticadas, tente tocar os pés com as mãos, mantendo as costas retas. Sinta o alongamento na parte de trás das pernas. Mantenha por 30 segundos e repita 3 vezes. A flexibilidade ajuda a reduzir a pressão sobre o sistema linfático.",
      },
      {
        id: "night_heatmap_3",
        time: "21:00",
        type: "heatmap",
        name: "Mapa do Fogo Interno",
        description: "Observe como as técnicas de drenagem impactaram seu corpo hoje.",
        details:
          "Marque no mapa de calor as áreas onde você sentiu alívio ou onde o inchaço diminuiu após as técnicas de drenagem. Isso reforça a eficácia das suas ações e te motiva a continuar.",
      },
    ],
    completionMessage:
      "Dia 3 concluído! Você está ativamente desinflamando seu corpo e aprendendo a se cuidar. Cada toque e cada escolha alimentar são atos de amor próprio que trazem leveza e bem-estar. Siga em frente com essa força!",
    previewText:
      "No Dia 4, vamos mergulhar em exercícios de baixo impacto que fortalecem sem sobrecarregar, e descobrir o poder dos temperos anti-inflamatórios nas suas refeições.",
  },
  4: {
    title: "Movimento Consciente e Temperos Poderosos",
    affirmation: "Eu me movo com gentileza e fortaleço meu corpo a cada passo.",
    hydrationTarget: 2900,
    touchpoints: [
      {
        id: "morning_exercise_4",
        time: "08:00",
        type: "exercise",
        name: "Exercícios de Fortalecimento de Core (Leve)",
        duration: "10 min",
        description: "Fortaleça o centro do seu corpo para dar suporte às pernas e melhorar a postura.",
        details:
          "Deitada de costas, joelhos flexionados, contraia o abdômen e eleve levemente o quadril. Mantenha por 5 segundos e retorne. Faça 3 séries de 10 repetições. Um core forte é fundamental para a estabilidade e para reduzir a carga sobre as pernas.",
      },
      {
        id: "morning_recipe_4",
        time: "08:45",
        type: "recipe",
        name: "Omelete com Espinafre e Cúrcuma",
        description: "Um café da manhã nutritivo e rico em proteínas e anti-inflamatórios.",
        ingredients: [
          "2 ovos",
          "1/2 xícara de espinafre picado",
          "1 pitada de cúrcuma",
          "Sal e pimenta a gosto",
          "Azeite de oliva para untar",
        ],
        preparation:
          "Bata os ovos com sal, pimenta e cúrcuma. Refogue o espinafre no azeite. Adicione os ovos batidos e cozinhe até firmar. Dobre ao meio e sirva. Uma refeição completa que combate a inflamação e fornece energia duradoura.",
      },
      {
        id: "lunch_recipe_4",
        time: "12:30",
        type: "recipe",
        name: "Frango Grelhado com Salada Colorida e Molho de Ervas",
        description: "Uma refeição leve e saborosa, com foco em proteínas e vegetais frescos.",
        ingredients: [
          "1 filé de frango grelhado",
          "Mix de folhas verdes (alface, rúcula)",
          "Tomate cereja, pepino e cenoura ralada",
          "Molho: azeite, limão, manjericão e orégano frescos",
        ],
        preparation:
          "Grelhe o frango. Monte a salada com os vegetais frescos. Prepare o molho misturando os ingredientes. Sirva o frango com a salada e o molho. Uma opção rica em proteínas magras e vegetais que promovem a desinflamação.",
      },
      {
        id: "afternoon_exercise_4",
        time: "15:30",
        type: "exercise",
        name: "Alongamento de Quadril e Virilha",
        duration: "5 min",
        description: "Alivie a tensão em áreas que impactam diretamente o fluxo linfático nas pernas.",
        details:
          "Sentada no chão com as pernas esticadas, tente tocar os pés com as mãos, mantendo as costas retas. Sinta o alongamento na virilha. Mantenha por 30 segundos e repita 3 vezes. Aumentar a flexibilidade nessas regiões é vital para a circulação.",
      },
      {
        id: "night_reflection_4",
        time: "21:00",
        type: "journal",
        name: "Diário de Gratidão",
        description: "Reflita sobre as pequenas vitórias e momentos de bem-estar do seu dia.",
        details:
          "Escreva 3 coisas pelas quais você é grata hoje. Pode ser um momento de leveza, uma refeição saborosa ou um exercício que te trouxe conforto. A gratidão fortalece a mente e o corpo, promovendo um ciclo positivo de cura.",
      },
    ],
    completionMessage:
      "Dia 4 concluído! Você está construindo uma base sólida de movimento e nutrição consciente. Cada escolha é um investimento na sua saúde e bem-estar. Sinta a força que vem de dentro e prepare-se para mais descobertas!",
    previewText:
      "No Dia 5, vamos explorar técnicas de respiração para alívio da dor e receitas com superalimentos que potencializam a sua energia e desinflamação.",
  },
  5: {
    title: "Respiração para Alívio e Superalimentos",
    affirmation: "Eu respiro a leveza e absorvo a energia que meu corpo precisa.",
    hydrationTarget: 3000,
    touchpoints: [
      {
        id: "morning_exercise_5",
        time: "08:00",
        type: "exercise",
        name: "Respiração 4-7-8",
        duration: "5 min",
        description: "Uma técnica poderosa para acalmar o sistema nervoso e aliviar a dor.",
        details:
          "Sente-se confortavelmente. Inspire pelo nariz contando até 4. Segure a respiração contando até 7. Expire completamente pela boca contando até 8. Repita 4 vezes. Esta técnica de respiração ajuda a reduzir o estresse e a percepção da dor, promovendo relaxamento profundo.",
      },
      {
        id: "morning_recipe_5",
        time: "08:45",
        type: "recipe",
        name: "Mingau de Aveia com Chia e Frutas Vermelhas",
        description: "Um café da manhã rico em fibras e antioxidantes para começar o dia com energia.",
        ingredients: [
          "1/2 xícara de aveia em flocos",
          "1 colher de sopa de chia",
          "1 xícara de leite vegetal",
          "Frutas vermelhas a gosto",
          "Mel ou adoçante natural (opcional)",
        ],
        preparation:
          "Misture a aveia, chia e leite vegetal. Leve ao fogo baixo, mexendo até engrossar. Sirva com frutas vermelhas. A aveia e a chia são ricas em fibras, que auxiliam na saúde intestinal e na redução da inflamação. Frutas vermelhas são potentes antioxidantes.",
      },
      {
        id: "lunch_recipe_5",
        time: "12:30",
        type: "recipe",
        name: "Bowl de Salmão com Batata Doce e Brócolis",
        description: "Uma refeição completa com ômega-3, essencial para combater a inflamação.",
        ingredients: [
          "1 filé de salmão assado ou grelhado",
          "1/2 batata doce cozida ou assada",
          "1 xícara de brócolis cozido no vapor",
          "Azeite de oliva, limão e ervas finas a gosto",
        ],
        preparation:
          "Prepare o salmão, batata doce e brócolis. Monte o bowl e tempere com azeite, limão e ervas. O salmão é uma excelente fonte de ômega-3, um ácido graxo essencial com fortes propriedades anti-inflamatórias, fundamental para quem tem lipedema.",
      },
      {
        id: "afternoon_exercise_5",
        time: "15:30",
        type: "exercise",
        name: "Alongamento de Parede (Panturrilhas)",
        duration: "3 min",
        description: "Alivie a tensão nas panturrilhas e melhore a circulação com um alongamento simples.",
        details:
          "Fique de frente para uma parede, apoie as mãos na altura dos ombros. Leve uma perna para trás, mantendo o calcanhar no chão e a perna esticada. Incline o corpo para frente até sentir o alongamento na panturrilha. Mantenha por 30 segundos e troque de perna. Repita 2 vezes. Essencial para a flexibilidade e o fluxo linfático.",
      },
      {
        id: "night_heatmap_5",
        time: "21:00",
        type: "heatmap",
        name: "Mapa do Fogo Interno",
        description: "Observe como a respiração e os superalimentos impactaram seu bem-estar hoje.",
        details:
          "Marque no mapa de calor as áreas onde você sentiu mais alívio ou onde a dor diminuiu após as práticas de hoje. Acompanhar essas mudanças visivelmente reforça o poder das suas escolhas.",
      },
    ],
    completionMessage:
      "Dia 5 concluído! Você está dominando técnicas de alívio e nutrindo seu corpo com o que há de melhor. Sinta a energia e a leveza que essas escolhas trazem. Você está no caminho certo para uma vida com mais conforto e bem-estar!",
    previewText:
      "No Dia 6, vamos focar em exercícios aquáticos (simulados) para um alívio sem impacto e receitas com especiarias que aquecem e desinflamam.",
  },
  6: {
    title: "Alívio Aquático e Especiarias",
    affirmation: "Eu encontro leveza e força em cada movimento, dentro e fora da água.",
    hydrationTarget: 3100,
    touchpoints: [
      {
        id: "morning_exercise_6",
        time: "08:00",
        type: "exercise",
        name: "Simulação de Caminhada na Água",
        duration: "15 min",
        description: "Experimente o alívio do movimento sem impacto, ideal para as pernas com lipedema.",
        details:
          "Em um local seguro, simule movimentos de caminhada como se estivesse na água, elevando os joelhos e movimentando os braços. Concentre-se na resistência imaginária da água. Faça por 15 minutos. Este exercício alivia a pressão nas articulações e estimula a circulação de forma suave.",
      },
      {
        id: "morning_recipe_6",
        time: "08:45",
        type: "recipe",
        name: "Golden Milk (Leite Dourado)",
        description: "Uma bebida quente e reconfortante, rica em cúrcuma para desinflamar.",
        ingredients: [
          "1 xícara de leite vegetal",
          "1 colher de chá de cúrcuma em pó",
          "1/2 colher de chá de gengibre em pó",
          "1 pitada de pimenta-do-reino",
          "Mel ou adoçante natural a gosto",
        ],
        preparation:
          "Aqueça o leite vegetal com a cúrcuma, gengibre e pimenta-do-reino. Mexa bem até aquecer. Adicione mel se desejar. A pimenta-do-reino potencializa a absorção da cúrcuma, tornando esta bebida um poderoso elixir anti-inflamatório.",
      },
      {
        id: "lunch_recipe_6",
        time: "12:30",
        type: "recipe",
        name: "Curry de Grão-de-Bico com Vegetais",
        description: "Uma explosão de sabores e nutrientes anti-inflamatórios para o seu almoço.",
        ingredients: [
          "1 xícara de grão-de-bico cozido",
          "1/2 cebola picada",
          "1/2 pimentão em cubos",
          "1 xícara de leite de coco",
          "1 colher de sopa de pasta de curry",
          "Vegetais variados (brócolis, cenoura)",
        ],
        preparation:
          "Refogue a cebola e o pimentão. Adicione a pasta de curry e o grão-de-bico. Incorpore o leite de coco e os vegetais. Cozinhe até os vegetais ficarem macios. Sirva com arroz integral. O curry é rico em especiarias que combatem a inflamação e aquecem o corpo.",
      },
      {
        id: "afternoon_exercise_6",
        time: "15:30",
        type: "exercise",
        name: "Alongamento de Isquiotibiais com Faixa",
        duration: "5 min",
        description: "Melhore a flexibilidade da parte posterior da coxa, aliviando a pressão nas pernas.",
        details:
          "Deitada de costas, com uma faixa ou toalha em um dos pés, eleve a perna esticada em direção ao teto, puxando a faixa suavemente. Mantenha por 30 segundos e troque de perna. Repita 2 vezes. Este alongamento é excelente para a saúde das pernas e para o fluxo linfático.",
      },
      {
        id: "night_reflection_6",
        time: "21:00",
        type: "journal",
        name: "Diário de Sensações",
        description: "Registre como seu corpo reagiu aos movimentos e sabores de hoje.",
        details:
          "Escreva sobre as sensações que você teve durante os exercícios e após as refeições. Houve alguma diferença no inchaço ou na dor? Quais sabores te trouxeram mais conforto? Conectar-se com essas sensações ajuda a entender melhor seu corpo.",
      },
    ],
    completionMessage:
      "Dia 6 concluído! Você está explorando novas formas de movimento e sabores que curam. Sinta a leveza que vem de dentro e a força que você está construindo. Sua jornada de transformação é inspiradora!",
    previewText:
      "No Dia 7, vamos celebrar a primeira semana com um balanço do seu progresso, exercícios de fortalecimento suave e receitas que nutrem a alma e o corpo.",
  },
  7: {
    title: "Celebrando a Primeira Semana",
    affirmation: "Eu celebro cada passo da minha jornada e honro a força do meu corpo.",
    hydrationTarget: 3200,
    touchpoints: [
      {
        id: "morning_exercise_7",
        time: "08:00",
        type: "exercise",
        name: "Revisão de Exercícios da Semana",
        duration: "15 min",
        description: "Revise seus exercícios favoritos da semana para consolidar o aprendizado e o movimento.",
        details:
          "Escolha 2-3 exercícios que você mais gostou ou que te trouxeram mais alívio nesta primeira semana. Repita cada um por 5 minutos. Esta revisão ajuda a reforçar os hábitos e a manter o corpo ativo de forma prazerosa.",
      },
      {
        id: "morning_recipe_7",
        time: "08:45",
        type: "recipe",
        name: "Ovos Mexidos com Abacate e Tomate",
        description: "Um café da manhã nutritivo e delicioso para celebrar a primeira semana.",
        ingredients: [
          "2 ovos mexidos",
          "1/2 abacate fatiado",
          "Tomate cereja a gosto",
          "Sal, pimenta e azeite de oliva",
        ],
        preparation:
          "Prepare os ovos mexidos. Sirva com fatias de abacate e tomate cereja. Tempere com sal, pimenta e um fio de azeite. Uma refeição rica em proteínas, gorduras saudáveis e antioxidantes, perfeita para nutrir seu corpo.",
      },
      {
        id: "lunch_recipe_7",
        time: "12:30",
        type: "recipe",
        name: "Salada de Grão-de-Bico com Vegetais Frescos e Molho de Iogurte",
        description: "Uma salada refrescante e cheia de sabor para o seu almoço de celebração.",
        ingredients: [
          "1 xícara de grão-de-bico cozido",
          "Pepino, tomate, cebola roxa picados",
          "Folhas de hortelã fresca",
          "Molho: iogurte natural, limão, azeite, sal e pimenta",
        ],
        preparation:
          "Misture o grão-de-bico com os vegetais e a hortelã. Prepare o molho e tempere a salada. Sirva gelada. Uma opção leve, rica em fibras e probióticos (do iogurte), que apoia a saúde intestinal e a desinflamação.",
      },
      {
        id: "afternoon_reflection_7",
        time: "15:30",
        type: "journal",
        name: "Balanço da Semana",
        duration: "10 min",
        description: "Reflita sobre seu progresso, desafios e aprendizados da primeira semana.",
        details:
          "Escreva sobre o que você conquistou nesta semana. Quais foram os maiores desafios? O que você aprendeu sobre seu corpo e suas necessidades? Quais hábitos você quer levar para a próxima semana? Celebrar o progresso é fundamental para manter a motivação.",
      },
      {
        id: "night_heatmap_7",
        time: "21:00",
        type: "heatmap",
        name: "Mapa do Fogo Interno",
        description: "Observe a evolução do seu mapa de calor após uma semana de cuidados.",
        details:
          "Marque no mapa de calor as áreas onde você sentiu mais alívio ou onde o inchaço diminuiu ao longo da semana. Compare com o Dia 1. Essa visualização do progresso é um poderoso motivador para continuar sua jornada.",
      },
    ],
    completionMessage:
      "Parabéns! Você completou a primeira semana da sua jornada Levvia! Sinta a leveza e a força que você conquistou. Cada dia foi um passo de amor próprio e cuidado. Continue firme, a transformação está acontecendo!",
    previewText:
      "Na segunda semana, vamos aprofundar nas técnicas de automassagem, explorar alimentos fermentados e fortalecer ainda mais seu corpo e mente.",
  },
  8: {
    title: "Aprofundando o Cuidado",
    affirmation: "Eu me permito receber e dar o cuidado que meu corpo merece.",
    hydrationTarget: 3300,
    touchpoints: [
      {
        id: "morning_exercise_8",
        time: "08:00",
        type: "exercise",
        name: "Automassagem com Óleo Essencial (Pernas)",
        duration: "10 min",
        description: "Uma técnica relaxante para estimular a circulação e aliviar a tensão nas pernas.",
        details:
          "Use um óleo vegetal (como amêndoas) com algumas gotas de óleo essencial de lavanda ou cipreste. Massageie suavemente as pernas, do tornozelo em direção à virilha, com movimentos ascendentes. Faça por 10 minutos. A automassagem ajuda a reduzir o inchaço e a promover o relaxamento.",
      },
      {
        id: "morning_recipe_8",
        time: "08:45",
        type: "recipe",
        name: "Iogurte Natural com Frutas e Granola Caseira",
        description: "Um café da manhã probiótico para fortalecer a saúde intestinal e a imunidade.",
        ingredients: [
          "1 pote de iogurte natural integral",
          "1/2 xícara de frutas picadas (banana, morango)",
          "2 colheres de sopa de granola caseira (sem açúcar)",
        ],
        preparation:
          "Misture o iogurte com as frutas e a granola. Sirva imediatamente. O iogurte natural é rico em probióticos, que são essenciais para a saúde intestinal e para combater a inflamação. A granola caseira oferece fibras e energia.",
      },
      {
        id: "lunch_recipe_8",
        time: "12:30",
        type: "recipe",
        name: "Salada de Atum com Grãos e Vegetais",
        description: "Uma refeição nutritiva e anti-inflamatória, rica em ômega-3.",
        ingredients: [
          "1 lata de atum em água (escorrido)",
          "1/2 xícara de milho cozido",
          "1/2 xícara de ervilha cozida",
          "Mix de folhas verdes",
          "Azeite de oliva, limão, sal e pimenta",
        ],
        preparation:
          "Misture o atum com o milho, ervilha e folhas verdes. Tempere com azeite, limão, sal e pimenta. O atum é uma boa fonte de ômega-3, que auxilia na redução da inflamação. Uma opção prática e saudável para o almoço.",
      },
      {
        id: "afternoon_exercise_8",
        time: "15:30",
        type: "exercise",
        name: "Alongamento de Pescoço e Ombros",
        duration: "5 min",
        description: "Alivie a tensão na parte superior do corpo, que pode impactar a circulação geral.",
        details:
          "Sentada, incline a cabeça para um lado, levando a orelha em direção ao ombro. Use a mão para aplicar uma leve pressão. Mantenha por 30 segundos e troque de lado. Faça também rotações suaves dos ombros. Aliviar a tensão nessas áreas contribui para o bem-estar geral e a circulação.",
      },
      {
        id: "night_reflection_8",
        time: "21:00",
        type: "journal",
        name: "Diário de Autocuidado",
        description: "Reflita sobre os atos de autocuidado que você praticou hoje.",
        details:
          "Escreva sobre como você se cuidou hoje. Foi a automassagem? A escolha de uma refeição nutritiva? Ou um momento de descanso? Reconhecer e valorizar esses momentos fortalece sua relação com seu corpo e sua jornada de cura.",
      },
    ],
    completionMessage:
      "Dia 8 concluído! Você está aprofundando seu autocuidado e nutrindo seu corpo de formas incríveis. Cada escolha é um passo em direção à leveza e ao bem-estar duradouro. Continue essa linda jornada!",
    previewText:
      "No Dia 9, vamos focar em exercícios de fortalecimento com o peso do corpo e explorar o poder dos alimentos fermentados para a saúde intestinal.",
  },
  9: {
    title: "Fortalecimento e Fermentados",
    affirmation: "Eu fortaleço meu corpo com sabedoria e nutro minha saúde intestinal.",
    hydrationTarget: 3400,
    touchpoints: [
      {
        id: "morning_exercise_9",
        time: "08:00",
        type: "exercise",
        name: "Agachamento Livre (Leve)",
        duration: "10 min",
        description: "Fortaleça as pernas e glúteos com um exercício funcional e de baixo impacto.",
        details:
          "Em pé, com os pés na largura dos ombros, agache como se fosse sentar em uma cadeira, mantendo as costas retas. Não precisa descer muito. Faça 3 séries de 10-12 repetições. O agachamento fortalece os músculos das pernas, auxiliando na circulação e na estabilidade.",
      },
      {
        id: "morning_recipe_9",
        time: "08:45",
        type: "recipe",
        name: "Kefir com Frutas e Sementes",
        description: "Um café da manhã probiótico para a saúde intestinal e imunidade.",
        ingredients: [
          "1 xícara de kefir de leite ou água",
          "1/2 xícara de frutas picadas",
          "1 colher de sopa de sementes (chia, linhaça)",
        ],
        preparation:
          "Misture o kefir com as frutas e sementes. Sirva imediatamente. O kefir é um alimento fermentado rico em probióticos, que são cruciais para equilibrar a flora intestinal e reduzir a inflamação sistêmica.",
      },
      {
        id: "lunch_recipe_9",
        time: "12:30",
        type: "recipe",
        name: "Salada de Frango Desfiado com Chucrute",
        description: "Uma refeição rica em proteínas e probióticos para o seu almoço.",
        ingredients: [
          "1 xícara de frango desfiado",
          "Mix de folhas verdes",
          "1/4 xícara de chucrute (fermentado)",
          "Azeite de oliva, limão, sal e pimenta",
        ],
        preparation:
          "Misture o frango desfiado com as folhas verdes e o chucrute. Tempere com azeite, limão, sal e pimenta. O chucrute é um repolho fermentado, excelente fonte de probióticos que apoiam a saúde digestiva e a desinflamação.",
      },
      {
        id: "afternoon_exercise_9",
        time: "15:30",
        type: "exercise",
        name: "Elevação Lateral de Pernas (Deitada)",
        duration: "5 min",
        description: "Fortaleça os músculos laterais das pernas, importantes para a estabilidade e o fluxo linfático.",
        details:
          "Deitada de lado, com as pernas esticadas, eleve a perna de cima em direção ao teto, mantendo o abdômen contraído. Faça 3 séries de 12-15 repetições em cada perna. Este exercício fortalece os abdutores, que são importantes para a saúde das pernas e a circulação.",
      },
      {
        id: "night_heatmap_9",
        time: "21:00",
        type: "heatmap",
        name: "Mapa do Fogo Interno",
        description: "Observe como o fortalecimento e os fermentados impactaram seu corpo hoje.",
        details:
          "Marque no mapa de calor as áreas onde você sentiu mais força, menos dor ou inchaço. Acompanhar essas mudanças visivelmente reforça o poder das suas escolhas e te motiva a continuar sua jornada.",
      },
    ],
    completionMessage:
      "Dia 9 concluído! Você está fortalecendo seu corpo de dentro para fora, com movimento e nutrição inteligente. Sinta a vitalidade que você está construindo e prepare-se para os últimos dias de transformação!",
    previewText:
      "No Dia 10, vamos focar em exercícios de equilíbrio e coordenação, e explorar receitas com gorduras saudáveis que nutrem o cérebro e combatem a inflamação.",
  },
  10: {
    title: "Equilíbrio e Gorduras Saudáveis",
    affirmation: "Eu encontro equilíbrio em meu corpo e nutro minha mente com clareza.",
    hydrationTarget: 3500,
    touchpoints: [
      {
        id: "morning_exercise_10",
        time: "08:00",
        type: "exercise",
        name: "Exercícios de Equilíbrio (Unipodal)",
        duration: "10 min",
        description: "Melhore seu equilíbrio e estabilidade, essencial para a segurança e o bem-estar geral.",
        details:
          "Em pé, apoie-se em uma perna só, mantendo a outra levemente flexionada. Mantenha o equilíbrio por 30 segundos e troque de perna. Repita 3 vezes. Se precisar, apoie-se em uma parede. O equilíbrio é fundamental para a prevenção de quedas e para a consciência corporal.",
      },
      {
        id: "morning_recipe_10",
        time: "08:45",
        type: "recipe",
        name: "Pudim de Chia com Leite de Coco e Manga",
        description: "Um café da manhã delicioso e rico em gorduras saudáveis e fibras.",
        ingredients: [
          "3 colheres de sopa de chia",
          "1 xícara de leite de coco",
          "1/2 manga picada",
          "Mel ou adoçante natural (opcional)",
        ],
        preparation:
          "Misture a chia com o leite de coco e mel. Leve à geladeira por pelo menos 2 horas (ou durante a noite). Sirva com a manga picada. A chia é rica em ômega-3 e fibras, que promovem a saciedade e a saúde intestinal. O leite de coco oferece gorduras saudáveis.",
      },
      {
        id: "lunch_recipe_10",
        time: "12:30",
        type: "recipe",
        name: "Salada de Grão-de-Bico com Abacate e Molho de Tahine",
        description: "Uma refeição completa, rica em proteínas vegetais e gorduras saudáveis.",
        ingredients: [
          "1 xícara de grão-de-bico cozido",
          "1/2 abacate em cubos",
          "Tomate cereja, pepino e cebola roxa picados",
          "Molho: tahine, limão, azeite, sal e pimenta",
        ],
        preparation:
          "Misture o grão-de-bico com os vegetais e o abacate. Prepare o molho e tempere a salada. Sirva. O abacate é uma excelente fonte de gorduras monoinsaturadas, que são anti-inflamatórias e benéficas para a saúde cardiovascular.",
      },
      {
        id: "afternoon_exercise_10",
        time: "15:30",
        type: "exercise",
        name: "Alongamento de Gêmeos na Escada",
        duration: "3 min",
        description: "Alivie a tensão nas panturrilhas e melhore a flexibilidade com este alongamento eficaz.",
        details:
          "Apoie a ponta dos pés em um degrau de escada, deixando os calcanhares suspensos. Deixe o peso do corpo alongar as panturrilhas. Mantenha por 30 segundos e repita 3 vezes. Este alongamento é ótimo para quem sente as panturrilhas pesadas e ajuda na circulação.",
      },
      {
        id: "night_reflection_10",
        time: "21:00",
        type: "journal",
        name: "Diário de Conquistas",
        description: "Reflita sobre as conquistas que você alcançou nesta jornada de bem-estar.",
        details:
          "Escreva sobre as maiores conquistas que você teve até agora na sua jornada Levvia. Pode ser um dia sem dor, uma nova receita que você amou, ou a sensação de mais leveza. Celebrar suas conquistas te impulsiona para frente.",
      },
    ],
    completionMessage:
      "Dia 10 concluído! Você está cultivando equilíbrio e nutrindo seu corpo com inteligência. Sinta a clareza mental e a leveza física que essas escolhas trazem. A reta final está chegando, e você está mais forte do que nunca!",
    previewText:
      "No Dia 11, vamos focar em exercícios de mobilidade articular e explorar receitas com vegetais crucíferos, poderosos aliados na desintoxicação.",
  },
  11: {
    title: "Mobilidade e Desintoxicação",
    affirmation: "Eu libero a tensão e permito que meu corpo se mova com liberdade.",
    hydrationTarget: 3600,
    touchpoints: [
      {
        id: "morning_exercise_11",
        time: "08:00",
        type: "exercise",
        name: "Rotação de Tronco (Sentada)",
        duration: "5 min",
        description: "Melhore a mobilidade da coluna e alivie a tensão nas costas, impactando a circulação geral.",
        details:
          "Sentada em uma cadeira, com os pés no chão, gire o tronco para um lado, usando as mãos para se apoiar no encosto. Mantenha por 30 segundos e troque de lado. Repita 2 vezes. Este exercício melhora a flexibilidade da coluna e ajuda a liberar a tensão que pode afetar o fluxo linfático.",
      },
      {
        id: "morning_recipe_11",
        time: "08:45",
        type: "recipe",
        name: "Suco Verde com Couve e Maçã",
        description: "Um suco detox poderoso para auxiliar na desintoxicação e na redução do inchaço.",
        ingredients: ["2 folhas de couve", "1 maçã verde", "1/2 pepino", "Gengibre a gosto", "200ml de água filtrada"],
        preparation:
          "Bata todos os ingredientes no liquidificador e coe se preferir. Beba imediatamente. A couve é rica em clorofila e antioxidantes, que apoiam a desintoxicação do fígado e a eliminação de toxinas, essenciais para o lipedema.",
      },
      {
        id: "lunch_recipe_11",
        time: "12:30",
        type: "recipe",
        name: "Salada de Brócolis com Frango e Molho de Mostarda",
        description: "Uma refeição rica em proteínas e vegetais crucíferos, poderosos desintoxicantes.",
        ingredients: [
          "1 xícara de brócolis cozido no vapor",
          "1 filé de frango desfiado",
          "Tomate cereja, cebola roxa picados",
          "Molho: mostarda dijon, azeite, limão, sal e pimenta",
        ],
        preparation:
          "Misture o brócolis, frango, tomate e cebola. Prepare o molho e tempere a salada. Sirva. O brócolis é um vegetal crucífero que contém compostos que auxiliam na desintoxicação do corpo, fundamental para quem busca aliviar o lipedema.",
      },
      {
        id: "afternoon_exercise_11",
        time: "15:30",
        type: "exercise",
        name: "Alongamento de Peito e Ombros",
        duration: "3 min",
        description: "Abra o peito e alivie a tensão nos ombros, melhorando a postura e a respiração.",
        details:
          "Em pé ou sentada, entrelace os dedos atrás das costas e estique os braços, elevando-os suavemente. Sinta o alongamento no peito e nos ombros. Mantenha por 30 segundos e repita 2 vezes. Uma boa postura e respiração profunda são importantes para o fluxo linfático.",
      },
      {
        id: "night_heatmap_11",
        time: "21:00",
        type: "heatmap",
        name: "Mapa do Fogo Interno",
        description: "Observe como a mobilidade e a desintoxicação impactaram seu corpo hoje.",
        details:
          "Marque no mapa de calor as áreas onde você sentiu mais leveza, menos rigidez ou inchaço. Acompanhar essas mudanças visivelmente reforça o poder das suas escolhas e te motiva a continuar sua jornada.",
      },
    ],
    completionMessage:
      "Dia 11 concluído! Você está liberando tensões e desintoxicando seu corpo de forma profunda. Sinta a liberdade de movimento e a clareza que essas escolhas trazem. A reta final está se aproximando, e você está brilhando!",
    previewText:
      "No Dia 12, vamos focar em exercícios de relaxamento e meditação, e explorar receitas com ervas adaptógenas que ajudam a gerenciar o estresse e a inflamação.",
  },
  12: {
    title: "Relaxamento e Adaptógenos",
    affirmation: "Eu me permito relaxar e encontrar a paz em meu corpo e mente.",
    hydrationTarget: 3700,
    touchpoints: [
      {
        id: "morning_exercise_12",
        time: "08:00",
        type: "exercise",
        name: "Meditação Guiada (5 min)",
        duration: "5 min",
        description: "Comece o dia com calma, reduzindo o estresse e promovendo o bem-estar mental.",
        details:
          "Sente-se confortavelmente, feche os olhos e siga uma meditação guiada de 5 minutos. Concentre-se na sua respiração e nas sensações do seu corpo. A meditação ajuda a reduzir o estresse, que é um fator que pode agravar o lipedema, e promove um estado de calma.",
      },
      {
        id: "morning_recipe_12",
        time: "08:45",
        type: "recipe",
        name: "Chá de Camomila com Ashwagandha",
        description: "Um chá relaxante com ervas adaptógenas para gerenciar o estresse e a inflamação.",
        ingredients: [
          "1 sachê de chá de camomila",
          "1/2 colher de chá de ashwagandha em pó",
          "200ml de água quente",
          "Mel a gosto (opcional)",
        ],
        preparation:
          "Prepare o chá de camomila. Adicione a ashwagandha em pó e mexa bem. Adicione mel se desejar. A ashwagandha é uma erva adaptógena que ajuda o corpo a lidar com o estresse, que pode impactar a inflamação e o lipedema.",
      },
      {
        id: "lunch_recipe_12",
        time: "12:30",
        type: "recipe",
        name: "Salada de Lentilha com Vegetais e Molho de Gergelim",
        description: "Uma refeição nutritiva e anti-inflamatória, com foco em proteínas vegetais.",
        ingredients: [
          "1 xícara de lentilha cozida",
          "Mix de folhas verdes",
          "Cenoura ralada, pepino picado",
          "Molho: azeite, vinagre de arroz, gergelim torrado, shoyu light",
        ],
        preparation:
          "Misture a lentilha com os vegetais. Prepare o molho e tempere a salada. Sirva. A lentilha é uma excelente fonte de proteína vegetal e fibras, que auxiliam na saciedade e na saúde intestinal. O gergelim oferece gorduras saudáveis.",
      },
      {
        id: "afternoon_exercise_12",
        time: "15:30",
        type: "exercise",
        name: "Alongamento de Coluna (Gato-Camelo)",
        duration: "5 min",
        description: "Alivie a tensão na coluna e melhore a flexibilidade, promovendo relaxamento.",
        details:
          "Na posição de quatro apoios, inspire e arqueie a coluna para cima (como um gato), olhando para o umbigo. Expire e curve a coluna para baixo (como um camelo), olhando para frente. Repita 10 vezes. Este exercício suave melhora a mobilidade da coluna e alivia o estresse.",
      },
      {
        id: "night_reflection_12",
        time: "21:00",
        type: "journal",
        name: "Diário de Relaxamento",
        description: "Reflita sobre os momentos de relaxamento e paz que você encontrou hoje.",
        details:
          "Escreva sobre como você se sentiu após a meditação ou os exercícios de relaxamento. Quais foram os momentos de maior calma? O que você pode fazer para incorporar mais relaxamento na sua rotina? O descanso é tão importante quanto o movimento na jornada de cura.",
      },
    ],
    completionMessage:
      "Dia 12 concluído! Você está cultivando a paz interior e nutrindo seu corpo com sabedoria. Sinta a serenidade e a leveza que essas escolhas trazem. A jornada está quase no fim, e você está mais forte e consciente do que nunca!",
    previewText:
      "No Dia 13, vamos focar em exercícios de força funcional e explorar receitas com alimentos ricos em magnésio, um mineral essencial para o relaxamento muscular e a redução da dor.",
  },
  13: {
    title: "Força Funcional e Magnésio",
    affirmation: "Eu sou forte, capaz e meu corpo responde ao meu cuidado.",
    hydrationTarget: 3800,
    touchpoints: [
      {
        id: "morning_exercise_13",
        time: "08:00",
        type: "exercise",
        name: "Prancha (Modificada)",
        duration: "5 min",
        description: "Fortaleça o core e o corpo todo com um exercício funcional e eficaz.",
        details:
          "Apoie-se nos antebraços e joelhos (versão modificada) ou nos antebraços e ponta dos pés (versão completa), mantendo o corpo reto como uma tábua. Contraia o abdômen. Mantenha por 30 segundos e descanse. Repita 3 vezes. A prancha fortalece o core, melhora a postura e dá suporte ao corpo.",
      },
      {
        id: "morning_recipe_13",
        time: "08:45",
        type: "recipe",
        name: "Smoothie de Banana, Cacau e Leite Vegetal",
        description: "Um smoothie delicioso e rico em magnésio para começar o dia com energia e relaxamento muscular.",
        ingredients: [
          "1 banana congelada",
          "1 colher de sopa de cacau em pó 100%",
          "1 xícara de leite vegetal",
          "1 colher de sopa de pasta de amendoim natural",
        ],
        preparation:
          "Bata todos os ingredientes no liquidificador até obter uma mistura cremosa. Beba imediatamente. O cacau e a banana são ricos em magnésio, um mineral essencial para o relaxamento muscular, redução de cãibras e alívio da dor, muito importante para quem tem lipedema.",
      },
      {
        id: "lunch_recipe_13",
        time: "12:30",
        type: "recipe",
        name: "Salada de Espinafre com Nozes e Queijo de Cabra",
        description: "Uma salada sofisticada e rica em magnésio e gorduras saudáveis.",
        ingredients: [
          "2 xícaras de espinafre fresco",
          "1/4 xícara de nozes picadas",
          "50g de queijo de cabra esfarelado",
          "Tomate cereja, pepino",
          "Molho: azeite, vinagre balsâmico, mel, sal e pimenta",
        ],
        preparation:
          "Misture o espinafre com as nozes, queijo de cabra e vegetais. Prepare o molho e tempere a salada. Sirva. O espinafre e as nozes são excelentes fontes de magnésio, que auxilia no relaxamento muscular e na redução da inflamação. O queijo de cabra adiciona sabor e proteína.",
      },
      {
        id: "afternoon_exercise_13",
        time: "15:30",
        type: "exercise",
        name: "Alongamento de Quadríceps (Em Pé)",
        duration: "3 min",
        description: "Alivie a tensão na parte frontal das coxas, melhorando a flexibilidade e o conforto.",
        details:
          "Em pé, segure um dos pés com a mão, puxando o calcanhar em direção ao glúteo. Mantenha os joelhos juntos e as costas retas. Sinta o alongamento na parte frontal da coxa. Mantenha por 30 segundos e troque de perna. Repita 2 vezes. Este alongamento é importante para a mobilidade e para aliviar a pressão nas pernas.",
      },
      {
        id: "night_heatmap_13",
        time: "21:00",
        type: "heatmap",
        name: "Mapa do Fogo Interno",
        description: "Observe como a força funcional e o magnésio impactaram seu corpo hoje.",
        details:
          "Marque no mapa de calor as áreas onde você sentiu mais força, menos dor ou inchaço. Acompanhar essas mudanças visivelmente reforça o poder das suas escolhas e te motiva a continuar sua jornada.",
      },
    ],
    completionMessage:
      "Dia 13 concluído! Você está fortalecendo seu corpo e nutrindo-o com o que ele precisa para a leveza. Sinta a força e a vitalidade que você construiu. A jornada está quase no fim, e você está pronta para celebrar sua transformação!",
    previewText:
      "No Dia 14, vamos celebrar sua jornada, consolidar seus aprendizados e gerar seu Relatório Médico personalizado, um marco na sua jornada de bem-estar.",
  },
  14: {
    title: "Celebração e Relatório Final",
    affirmation: "Eu celebro minha jornada, honro meu corpo e abraço minha nova leveza.",
    hydrationTarget: 3900,
    touchpoints: [
      {
        id: "morning_reflection_14",
        time: "08:00",
        type: "journal",
        name: "Diário da Transformação",
        duration: "15 min",
        description:
          "Reflita sobre toda a sua jornada de 14 dias: o que mudou, o que você aprendeu e o que você leva consigo.",
        details:
          "Escreva sobre sua experiência completa. Como você se sentia no Dia 1 e como se sente agora? Quais foram os maiores aprendizados? Quais hábitos você vai manter? Esta reflexão é um poderoso registro da sua transformação.",
      },
      {
        id: "morning_exercise_14",
        time: "08:45",
        type: "exercise",
        name: "Fluxo de Movimento Livre",
        duration: "15 min",
        description: "Movimente seu corpo de forma intuitiva, celebrando a liberdade e a leveza que você conquistou.",
        details:
          "Coloque uma música suave e movimente seu corpo da forma que sentir mais prazer. Dance, alongue, caminhe. Não há regras, apenas a celebração do seu corpo em movimento. Este é um momento de gratidão pela sua jornada e pela sua nova leveza.",
      },
      {
        id: "lunch_recipe_14",
        time: "12:30",
        type: "recipe",
        name: "Refeição da Celebração (Sua Escolha Saudável)",
        description: "Prepare sua receita anti-inflamatória favorita da jornada para celebrar sua vitória.",
        ingredients: ["Sua receita favorita da jornada Levvia"],
        preparation:
          "Escolha uma das receitas que você mais gostou e que te trouxe mais bem-estar. Prepare-a com carinho e celebre cada ingrediente que nutriu seu corpo. Este é o seu momento de desfrutar e honrar suas escolhas saudáveis.",
      },
      {
        id: "afternoon_report_14",
        time: "15:30",
        type: "report",
        name: "Gerar Relatório Médico",
        description: "Consolide seu progresso em um relatório detalhado para compartilhar com seu médico.",
        details:
          "Este relatório incluirá seu mapa de calor inicial e final, seu progresso de hidratação, os exercícios e receitas que você realizou, e suas reflexões diárias. É uma ferramenta poderosa para você e seu médico acompanharem sua evolução e ajustarem seu plano de tratamento.",
      },
      {
        id: "night_celebration_14",
        time: "21:00",
        type: "journal",
        name: "Celebração Final",
        description: "Um momento de gratidão e projeção para o futuro, abraçando sua nova leveza.",
        details:
          "Escreva uma carta para si mesma, descrevendo a pessoa que você se tornou após esta jornada. Quais são seus próximos passos? Como você vai manter essa leveza e bem-estar? Celebre cada vitória e olhe para o futuro com confiança e amor próprio.",
      },
    ],
    completionMessage:
      "Parabéns! Você completou a jornada Levvia de 14 dias! Sua transformação é inspiradora. Você honrou seu corpo, nutriu sua alma e conquistou uma nova leveza. Este é apenas o começo de uma vida com mais bem-estar e autoconfiança. Celebre cada vitória e continue brilhando!",
    previewText:
      "Sua jornada de 14 dias foi concluída! Agora é hora de celebrar suas conquistas e continuar aplicando tudo o que você aprendeu para manter sua leveza e bem-estar.",
  },
};
