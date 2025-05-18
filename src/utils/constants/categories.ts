export const CATEGORY_IDS = ['free', 'info', 'popular'] as const;

export type CategoryID = (typeof CATEGORY_IDS)[number];

export const CATEGORY_ICONS: Record<CategoryID, string> = {
  free: '☁️',
  popular: '🔥',
  // recruitment: '🙌',
  info: '💡',
};

export const CATEGORY_LABELS: Record<CategoryID, string> = {
  free: 'free',
  popular: 'popular',
  // recruitment: 'recruitment',
  info: 'info',
};

export const CATEGORIES = CATEGORY_IDS.map((id) => ({
  id,
  icon: CATEGORY_ICONS[id],
  label: CATEGORY_LABELS[id],
}));
