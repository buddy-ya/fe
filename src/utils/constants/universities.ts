import KonkukIcon from '@assets/icons/universities/konkuk.svg';
import SejongIcon from '@assets/icons/universities/sejong.svg';

const PlaceholderIcon = () => null;

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
  sejong: 'sju.ac.kr',
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

export const UNIVERSITY_ICONS: Record<UniversityID, React.ComponentType> = {
  sejong: SejongIcon,
  konkuk: KonkukIcon,
  seoulnational: PlaceholderIcon,
  yonsei: PlaceholderIcon,
  korea: PlaceholderIcon,
  sogang: PlaceholderIcon,
  hanyang: PlaceholderIcon,
  chungang: PlaceholderIcon,
  kookmin: PlaceholderIcon,
  sungkyunkwan: PlaceholderIcon,
  hankukufs: PlaceholderIcon,
  catholic: PlaceholderIcon,
  ewha: PlaceholderIcon,
  seoulcity: PlaceholderIcon,
  seoultech: PlaceholderIcon,
  dongguk: PlaceholderIcon,
  hongik: PlaceholderIcon,
  karts: PlaceholderIcon,
  kyunghee: PlaceholderIcon,
  sookmyung: PlaceholderIcon,
};

// 최종적으로 각 대학의 id, emailDomain, icon을 포함한 배열 생성
export const UNIVERSITIES = UNIVERSITY_IDS.map((id) => ({
  id,
  emailDomain: UNIVERSITY_EMAIL_DOMAINS[id],
  icon: UNIVERSITY_ICONS[id],
}));
