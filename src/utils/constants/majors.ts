// constants/majors.ts
export const MAJOR_IDS = [
  'language_school',
  'humanities',
  'social_sciences',
  'business',
  'education',
  'natural_sciences',
  'it',
  'engineering',
  'arts',
  'sports',
  'nursing',
  'pharmacy',
  'veterinary',
  'medicine',
  'law',
  'psychology',
  'architecture',
  'communication',
  'music',
  'design',
] as const;

export type MajorID = (typeof MAJOR_IDS)[number];

export const MAJOR_ICONS: Record<string, string> = {
  language_school: '🏫',
  humanities: '📚',
  social_sciences: '🌏',
  business: '💼',
  education: '👨‍🏫',
  natural_sciences: '🔬',
  it: '💻',
  engineering: '⚙️',
  communication: '📢',
  arts: '🎨',
  sports: '⚽',
  music: '🎼',
  design: '🖌️',
  nursing: '👨‍⚕️',
  law: '⚖️',
  psychology: '🧠',
  architecture: '🏛️',
  pharmacy: '💊',
  veterinary: '🐾',
  medicine: '🏥',
};

// 화면에서 사용할 데이터 구조
export const MAJORS = MAJOR_IDS.map((id) => ({
  id,
  icon: MAJOR_ICONS[id],
}));
