export const CATEGORY_IDS = ["free", "meeting", "info"] as const;

export type CategoryID = (typeof CATEGORY_IDS)[number];

export const CATEGORY_ICONS: Record<CategoryID, string> = {
  free: "☁️",
  meeting: "🙌",
  info: "💡",
};

export const CATEGORY_LABELS: Record<CategoryID, string> = {
  free: "자유",
  meeting: "모임",
  info: "정보공유",
};

export const CATEGORIES = CATEGORY_IDS.map((id) => ({
  id,
  icon: CATEGORY_ICONS[id],
  label: CATEGORY_LABELS[id],
}));
