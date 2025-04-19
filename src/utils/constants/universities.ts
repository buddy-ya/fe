import CatholicIcon from '@assets/icons/universities/catholic.svg';
import ChungAngIcon from '@assets/icons/universities/chungang.svg';
import DonggukIcon from '@assets/icons/universities/dongguk.svg';
import EwhaIcon from '@assets/icons/universities/ewha.svg';
import HankukUFSIcon from '@assets/icons/universities/hankukufs.svg';
import HanyangIcon from '@assets/icons/universities/hanyang.svg';
import HongikIcon from '@assets/icons/universities/hongik.svg';
import KARTSIcon from '@assets/icons/universities/karts.svg';
import KonkukIcon from '@assets/icons/universities/konkuk.svg';
import KookminIcon from '@assets/icons/universities/kookmin.svg';
import KoreaIcon from '@assets/icons/universities/korea.svg';
import KyungHeeIcon from '@assets/icons/universities/kyunghee.svg';
import SejongIcon from '@assets/icons/universities/sejong.svg';
import SeoulCityIcon from '@assets/icons/universities/seoulcity.svg';
import SeoulNationalIcon from '@assets/icons/universities/seoulnational.svg';
import SeoulTechIcon from '@assets/icons/universities/seoultech.svg';
import SogangIcon from '@assets/icons/universities/sogang.svg';
import SookmyungIcon from '@assets/icons/universities/sookmyung.svg';
import SungkyunkwanIcon from '@assets/icons/universities/sungkyunkwan.svg';
import YonseiIcon from '@assets/icons/universities/yonsei.svg';

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
  seoulnational: SeoulNationalIcon,
  yonsei: YonseiIcon,
  korea: KoreaIcon,
  sogang: SogangIcon,
  hanyang: HanyangIcon,
  chungang: ChungAngIcon,
  kookmin: KookminIcon,
  sungkyunkwan: SungkyunkwanIcon,
  hankukufs: HankukUFSIcon,
  catholic: CatholicIcon,
  ewha: EwhaIcon,
  seoulcity: SeoulCityIcon,
  seoultech: SeoulTechIcon,
  dongguk: DonggukIcon,
  hongik: HongikIcon,
  karts: KARTSIcon,
  kyunghee: KyungHeeIcon,
  sookmyung: SookmyungIcon,
};

export const UNIVERSITIES = UNIVERSITY_IDS.map((id) => ({
  id,
  emailDomain: UNIVERSITY_EMAIL_DOMAINS[id],
  icon: UNIVERSITY_ICONS[id],
}));
