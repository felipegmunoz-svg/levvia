export const motivationalPhrases: string[] = [
  "Cada gota de água é um ato de amor pelo seu corpo. 💧",
  "Você é mais forte do que imagina. Um passo de cada vez. 🌱",
  "Cuidar de si não é egoísmo, é necessidade. 💚",
  "Seu corpo é sua casa — trate-o com carinho. 🏡",
  "Pequenas mudanças geram grandes transformações. ✨",
  "Respire fundo. Você está fazendo o seu melhor. 🌿",
  "A jornada de mil passos começa com o primeiro. 👣",
  "Hoje é um novo dia para se cuidar. ☀️",
  "Você merece se sentir bem no seu próprio corpo. 💗",
  "Gentileza consigo mesma é o melhor remédio. 🌸",
  "Celebre cada pequena vitória. Elas importam! 🎉",
  "Seu bem-estar é prioridade, não luxo. 🌟",
  "Movimentar o corpo é um presente que você se dá. 🤸‍♀️",
  "A natureza cura. Inclua mais verde no seu prato e na sua vida. 🥗",
];

export const getDailyPhrase = (): string => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return motivationalPhrases[dayOfYear % motivationalPhrases.length];
};
