export const CATEGORY_IDS = ['free', 'recruitment', 'info'] as const;

export type CategoryID = (typeof CATEGORY_IDS)[number];

export const CATEGORY_ICONS: Record<CategoryID, string> = {
  free: '☁️',
  // popular: "🔥",
  recruitment: '🙌',
  info: '💡',
};

export const CATEGORY_LABELS: Record<CategoryID, string> = {
  free: '자유',
  // popular: "인기",
  recruitment: '모임',
  info: '정보공유',
};

export const CATEGORIES = CATEGORY_IDS.map((id) => ({
  id,
  icon: CATEGORY_ICONS[id],
  label: CATEGORY_LABELS[id],
}));
