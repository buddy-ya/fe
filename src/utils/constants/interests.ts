export const INTEREST_CATEGORY_IDS = [
  'culture',
  'sports',
  'arts',
  'food',
  'travel',
  'fashion',
  'technology',
  'health',
] as const;

export type InterestCategoryID = (typeof INTEREST_CATEGORY_IDS)[number];

export const INTEREST_IDS = [
  // culture
  'kpop',
  'performance',
  'reading',
  'movie',
  'oneday',
  'experience',
  'cafe',
  // sports
  'game',
  'basketball',
  'hiking',
  'running',
  'bowling',
  'sports',
  'baseball',
  'soccer',
  'tennis',
  'fitness',
  'league_of_legends', // 구체화: 리그 오브 레전드
  // arts
  'singing',
  'dance',
  'crafts',
  'instrument',
  'photo',
  // food
  'restaurant',
  'beer',
  'baking',
  'cooking',
  // travel
  'backpacking',
  'sightseeing',
  'adventure',
  // fashion
  'style',
  'shopping',
  'beauty',
  // technology
  'programming',
  'gadgets',
  'robotics',
  // health
  'meditation',
  'nutrition',
  'wellness',
] as const;

export type InterestID = (typeof INTEREST_IDS)[number];

export const INTEREST_ICONS: Record<string, string> = {
  // culture
  kpop: '🎤',
  performance: '🎭',
  reading: '📚',
  movie: '🎬',
  oneday: '🎨',
  experience: '🎯',
  cafe: '☕️',
  // sports
  game: '🎮',
  basketball: '🏀',
  hiking: '⛰️',
  running: '🏃',
  bowling: '🎳',
  sports: '📣',
  baseball: '⚾️',
  soccer: '⚽️',
  tennis: '🎾',
  fitness: '💪',
  league_of_legends: '⚔️',
  // arts
  singing: '🎤',
  dance: '💃',
  crafts: '🎨',
  instrument: '🎸',
  photo: '📸',
  // food
  restaurant: '🍜',
  beer: '🍺',
  baking: '🥖',
  cooking: '👨‍🍳',
  // travel
  backpacking: '🎒',
  sightseeing: '🗺️',
  adventure: '🏕️',
  // fashion
  style: '👗',
  shopping: '🛍️',
  beauty: '💄',
  // technology
  programming: '👨‍💻',
  gadgets: '📱',
  robotics: '🤖',
  // health
  meditation: '🧘',
  nutrition: '🥗',
  wellness: '💆',
};

export const CATEGORY_INTERESTS: Record<InterestCategoryID, InterestID[]> = {
  culture: ['kpop', 'performance', 'reading', 'movie', 'oneday', 'experience', 'cafe'],
  sports: [
    'game',
    'basketball',
    'hiking',
    'running',
    'bowling',
    'sports',
    'baseball',
    'soccer',
    'tennis',
    'fitness',
    'league_of_legends',
  ],
  arts: ['singing', 'dance', 'crafts', 'instrument', 'photo'],
  food: ['restaurant', 'beer', 'baking', 'cooking'],
  travel: ['backpacking', 'sightseeing', 'adventure'],
  fashion: ['style', 'shopping', 'beauty'],
  technology: ['programming', 'gadgets', 'robotics'],
  health: ['meditation', 'nutrition', 'wellness'],
};

export const INTEREST_CATEGORIES = INTEREST_CATEGORY_IDS.map((categoryId) => ({
  id: categoryId,
  interests: CATEGORY_INTERESTS[categoryId].map((interestId) => ({
    id: interestId,
    icon: INTEREST_ICONS[interestId],
  })),
}));
