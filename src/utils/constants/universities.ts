export const UNIVERSITY_IDS = [
  'sejong',
  'konkuk',
  'seoulnational',
  'yonsei',
  'korea',
  'sogang',
  'hanyang',
  'chungang',
  'kookmin',
  'sungkyunkwan',
  'hankukufs',
  'catholic',
  'ewha',
  'seoulcity',
  'seoultech',
  'dongguk',
  'hongik',
  'karts',
  'kyunghee',
  'sookmyung',
] as const;

export type UniversityID = (typeof UNIVERSITY_IDS)[number];

export const UNIVERSITY_EMAIL_DOMAINS: Record<UniversityID, string> = {
  sejong: 'sejong.ac.kr',
  konkuk: 'konkuk.ac.kr',
  seoulnational: 'snu.ac.kr',
  yonsei: 'yonsei.ac.kr',
  korea: 'korea.ac.kr',
  sogang: 'sogang.ac.kr',
  hanyang: 'hanyang.ac.kr',
  chungang: 'cau.ac.kr',
  kookmin: 'kookmin.ac.kr',
  sungkyunkwan: 'skku.ac.kr',
  hankukufs: 'hufs.ac.kr',
  catholic: 'catholic.ac.kr',
  ewha: 'ewha.ac.kr',
  seoulcity: 'uos.ac.kr',
  seoultech: 'seoultech.ac.kr',
  dongguk: 'dongguk.ac.kr',
  hongik: 'hongik.ac.kr',
  karts: 'karts.ac.kr',
  kyunghee: 'khu.ac.kr',
  sookmyung: 'sookmyung.ac.kr',
};

export const UNIVERSITIES = UNIVERSITY_IDS.map((id) => ({
  id,
  emailDomain: UNIVERSITY_EMAIL_DOMAINS[id],
}));
