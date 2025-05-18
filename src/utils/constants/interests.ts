// ---------- 1) Category IDs ----------
export const INTEREST_CATEGORY_IDS = [
  'culture',
  'sports',
  'arts',
  'food',
  'technology',
  'travel',
  'fashion',
  'health',
] as const;

export type InterestCategoryID = (typeof INTEREST_CATEGORY_IDS)[number];

// ---------- 2) Category-Interest Mapping (with inline comments) ----------
export const CATEGORY_INTERESTS: Record<InterestCategoryID, string[]> = {
  culture: [
    'kpop', // K-POP
    'reading', // 독서
    'movie', // 영화
    'oneday', // 원데이클래스
    'experience', // 체험카페
    'festival', // 페스티벌
    'fireworks', // 불꽃놀이
    'musical', // 뮤지컬
    'theater', // 연극
    'escape_room', // 방탈출
    'amusement_park', // 놀이공원
    'coin_karaoke', // 코인노래방
    'exhibition_viewing', // 전시회 관람
    'fortune_tarot', // 사주/타로
    'netflix', // 넷플릭스
    'drama_binge_watching', // 드라마 정주행
    'animation', // 애니메이션
    'webtoons', // 웹툰
    'chatting', // 수다 떨기
    'zoning_out', // 멍 때리기
  ],
  sports: [
    'game', // 게임
    'basketball', // 농구
    'hiking', // 등산
    'running', // 러닝
    'bowling', // 볼링
    'sports', // 스포츠 경기 관람
    'baseball', // 야구
    'soccer', // 축구
    'tennis', // 테니스
    'fitness', // 헬스
    'league_of_legends', // LOL
    'volleyball', // 발리볼
    'futsal', // 풋살
    'fishing', // 낚시
    'skiing', // 스키
    'surfing', // 서핑
    'boxing', // 복싱
    'snowboarding', // 스노보드
    'shooting', // 사격
    'jiu_jitsu', // 주짓수
    'swimming', // 수영
    'golf', // 골프
    'pilates', // 필라테스
    'home_training', // 홈트레이닝
    'climbing', // 클라이밍
    'billiards', // 당구
    'yoga', // 요가
    'squash', // 스쿼시
    'skateboarding', // 스케이트보드
    'ballet', // 발레
    'sports_general', // 스포츠 활동
  ],
  arts: [
    'listening_to_music', // 음악 감상
    'singing', // 노래
    'hiphop', // 힙합
    'edm', // EDM
    'dance', // 춤
    'crafts', // 공예
    'instrument', // 악기 연주
    'writing', // 글쓰기
    'drawing', // 그림 그리기
    'knitting', // 뜨개질
    'photography', // 사진 찍기
    'interior_design', // 인테리어
  ],
  food: [
    'restaurant', // 맛집 투어
    'cafe_tour', // 카페 투어
    'alcohol', // 알코올 러버
    'coffee', // 카페인 러버
    'baking', // 베이킹
    'cooking', // 요리
    'bbq', // 바비큐
    'meat_restaurant', // 고기 맛집
    'vegetarian',
  ],
  technology: [
    'programming', // 코딩
    'robotics', // 로보틱스
    'studying', // 공부
    'miracle_morning', // 미라클 모닝
    'getting_certificates', // 자격증 따기
    'studying_foreign_language', // 외국어 공부
    'investment', // 재테크
    'career_development', // 커리어 개발
    'stock_investing', // 주식 투자
    'volunteering', // 봉사활동
    'technology_general', // 기술 러버
  ],
  travel: [
    'travel_general', // 여행 러버
    'backpacking', // 배낭 여행
    'hanriver', // 한강
    'sightseeing', // 관광
    'driving', // 드라이브
    'picnic', // 피크닉
    'camping', // 캠핑
  ],
  fashion: [
    'fashion_general', // 패션 러버
    'shopping', // 쇼핑
    'beauty', // 뷰티
    'nail_art', // 네일아트
  ],
  health: [
    'walking', // 산책
    'meditation', // 명상
    'nutrition', // 영양
    'cleaning', // 청소
    'wellness', // 웰니스
    'plant_caring', // 반려식물 가꾸기
  ],
};

// ---------- 3) Interest icons ----------
export const INTEREST_ICONS: Record<string, string> = {
  // -------- [Culture] --------
  culture_general: '🎭',
  kpop: '🎤',
  performance: '🎭',
  reading: '📚',
  movie: '🎬',
  oneday: '🎨',
  experience: '🎯',
  cafe: '☕️',
  museum: '🏛️',
  hanriver: '🏝️',
  festival: '🎉',
  fireworks: '🎆',
  musical: '🎼',
  theater: '🎭',
  escape_room: '🗝️',
  amusement_park: '🎡',
  listening_to_music: '🎧',
  edm: '🎶',
  coin_karaoke: '🎤',
  exhibition_viewing: '🖼️',
  volunteering: '🤝',
  fortune_tarot: '🔮',
  netflix: '📺',
  drama_binge_watching: '📼',
  tv_entertainment: '📺',
  home_cafe: '🍵',
  chatting: '💬',
  zoning_out: '😶',

  // -------- [Sports] --------
  sports_general: '🏅',
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
  volleyball: '🏐',
  futsal: '🥅',
  fishing: '🎣',
  skiing: '🎿',
  surfing: '🏄', // (새로 추가)
  boxing: '🥊',
  snowboarding: '🏂',
  shooting: '🔫',
  jiu_jitsu: '🥋',
  swimming: '🏊',
  marathon: '🏃‍♂️',
  golf: '🏌️',
  pilates: '🧘‍♀️',
  home_training: '🏠',
  climbing: '🧗',
  billiards: '🎱',
  yoga: '🧘',
  squash: '🏓',
  skateboarding: '🛹',

  // -------- [Arts] --------
  arts_general: '🎨',
  singing: '🎤',
  hiphop: '🕶️',
  dance: '💃',
  crafts: '🪡',
  instrument: '🎸',
  photo: '📸',
  writing: '✍️',
  animation: '🎞️',
  drawing: '🎨',
  knitting: '🧶',
  photography: '📷',
  webtoons: '🖋️',
  interior_design: '🛋️',
  ballet: '🩰',

  // -------- [Food] --------
  food_general: '🍽️',
  restaurant: '🍜',
  alcohol: '🍻', // (새로 추가: 알코올 러버)
  coffee: '☕️', // (새로 추가: 카페인 러버)
  baking: '🥖',
  cooking: '👨‍🍳',
  bbq: '🥩',
  restaurant_tour: '🍽️',
  cafe_tour: '🍰', // (새로 추가: 카페 투어)
  meat_restaurant: '🍖',
  vegetarian: '🥦', // 채식 러버

  // -------- [Travel] --------
  travel_general: '✈️',
  backpacking: '🎒',
  sightseeing: '🗺️',
  adventure: '🏕️',
  driving: '🚗',
  picnic: '🧺',
  camping: '🏕️',

  // -------- [Fashion] --------
  fashion_general: '🧥',
  style: '👗',
  shopping: '🛍️',
  beauty: '💄',
  sneaker_collecting: '👟',
  makeup: '💄',
  nail_art: '💅',

  // -------- [Technology] --------
  technology_general: '💻',
  programming: '👨‍💻',
  gadgets: '📱',
  robotics: '🤖',
  studying: '📖',
  getting_certificates: '🎓',
  studying_foreign_language: '🗣️',
  investment: '💹',
  career_development: '💼',
  stock_investing: '📈',
  bitcoin: '₿',

  // -------- [Health] --------
  health_general: '💓',
  meditation: '🧘',
  nutrition: '🥗',
  wellness: '💆',
  environmental_protection: '🌿',
  plogging: '🚮',
  miracle_morning: '🌅',
  walking: '🚶',
  plant_caring: '🪴',
  cleaning: '🧼',
};

// ---------- 4) Final array generator ----------
export const INTEREST_CATEGORIES = INTEREST_CATEGORY_IDS.map((categoryId) => ({
  id: categoryId,
  interests: CATEGORY_INTERESTS[categoryId].map((interestId) => ({
    id: interestId,
    icon: INTEREST_ICONS[interestId],
  })),
}));

export type InterestID = (typeof CATEGORY_INTERESTS)[keyof typeof CATEGORY_INTERESTS][number];
