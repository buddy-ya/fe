export const INTEREST_CATEGORY_IDS = [
  "culture",
  "sports",
  "arts",
  "food",
] as const;

export type InterestCategoryID = (typeof INTEREST_CATEGORY_IDS)[number];

export const INTEREST_IDS = [
  // culture
  "kpop",
  "performance",
  "reading",
  "movie",
  "oneday",
  "experience",
  "cafe",
  // sports
  "game",
  "basketball",
  "hiking",
  "running",
  "bowling",
  "sports",
  "baseball",
  "soccer",
  "tennis",
  "fitness",
  // arts
  "singing",
  "dance",
  "crafts",
  "instrument",
  "photo",
  "acting",
  // food
  "restaurant",
  "beer",
  "baking",
  "cooking",
  "food_experience",
] as const;

export type InterestID = (typeof INTEREST_IDS)[number];

export const INTEREST_ICONS: Record<InterestID, string> = {
  // culture
  kpop: "🎤",
  performance: "🎭",
  reading: "📚",
  movie: "🎬",
  oneday: "🎨",
  experience: "🎯",
  cafe: "☕️",
  // sports
  game: "🎮",
  basketball: "🏀",
  hiking: "⛰️",
  running: "🏃",
  bowling: "🎳",
  sports: "📣",
  baseball: "⚾️",
  soccer: "⚽️",
  tennis: "🎾",
  fitness: "💪",
  // arts
  singing: "🎤",
  dance: "💃",
  crafts: "🎨",
  instrument: "🎸",
  photo: "📸",
  acting: "🎭",
  // food
  restaurant: "🍜",
  beer: "🍺",
  baking: "🥖",
  cooking: "👨‍🍳",
  food_experience: "🍱",
};

export const CATEGORY_INTERESTS: Record<InterestCategoryID, InterestID[]> = {
  culture: [
    "kpop",
    "performance",
    "reading",
    "movie",
    "oneday",
    "experience",
    "cafe",
  ],
  sports: [
    "game",
    "basketball",
    "hiking",
    "running",
    "bowling",
    "sports",
    "baseball",
    "soccer",
    "tennis",
    "fitness",
  ],
  arts: ["singing", "dance", "crafts", "instrument", "photo", "acting"],
  food: ["restaurant", "beer", "baking", "cooking", "food_experience"],
};

// 화면에서 사용할 데이터 구조
export const INTEREST_CATEGORIES = INTEREST_CATEGORY_IDS.map((categoryId) => ({
  id: categoryId,
  interests: CATEGORY_INTERESTS[categoryId].map((interestId) => ({
    id: interestId,
    icon: INTEREST_ICONS[interestId],
  })),
}));
