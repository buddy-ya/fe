import AjouIcon from '@assets/icons/universities/ajou.svg';
import BuddyyaIcon from '@assets/icons/universities/buddyya.svg';
import CatholicIcon from '@assets/icons/universities/catholic.svg';
import ChungAngIcon from '@assets/icons/universities/chungang.svg';
import DankookIcon from '@assets/icons/universities/dankook.svg';
import DongdukIcon from '@assets/icons/universities/dongduk.svg';
import DonggukIcon from '@assets/icons/universities/dongguk.svg';
import DuksungIcon from '@assets/icons/universities/duksung.svg';
import EwhaIcon from '@assets/icons/universities/ewha.svg';
import GachonIcon from '@assets/icons/universities/gachon.svg';
import HankukUFSIcon from '@assets/icons/universities/hankukufs.svg';
import HanyangIcon from '@assets/icons/universities/hanyang.svg';
import HongikIcon from '@assets/icons/universities/hongik.svg';
import InhaIcon from '@assets/icons/universities/inha.svg';
import KangseoIcon from '@assets/icons/universities/kangseo.svg';
import KARTSIcon from '@assets/icons/universities/karts.svg';
import KonkukIcon from '@assets/icons/universities/konkuk.svg';
import KookminIcon from '@assets/icons/universities/kookmin.svg';
import KoreaIcon from '@assets/icons/universities/korea.svg';
import KwangwoonIcon from '@assets/icons/universities/kwangwoon.svg';
import KyungHeeIcon from '@assets/icons/universities/kyunghee.svg';
import MyeongjiIcon from '@assets/icons/universities/myeongji.svg';
import SejongIcon from '@assets/icons/universities/sejong.svg';
import SeokyeongIcon from '@assets/icons/universities/seokyeong.svg';
import SeoulCityIcon from '@assets/icons/universities/seoulcity.svg';
import SeoulNationalIcon from '@assets/icons/universities/seoulnational.svg';
import SeoulTechIcon from '@assets/icons/universities/seoultech.svg';
import SeoulWomenIcon from '@assets/icons/universities/seoulwomen.svg';
import SogangIcon from '@assets/icons/universities/sogang.svg';
import SookmyungIcon from '@assets/icons/universities/sookmyung.svg';
import SoongsilIcon from '@assets/icons/universities/soongsil.svg';
import SungkyunkwanIcon from '@assets/icons/universities/sungkyunkwan.svg';
import SungshinIcon from '@assets/icons/universities/sungshin.svg';
import YonseiIcon from '@assets/icons/universities/yonsei.svg';

export const UNIVERSITY_IDS = [
  'all',
  'korea', // 고려대학교
  'gachon', // 가천대학교
  'hanyang', // 한양대학교
  'hanyang_erika', // 한양대학교 에리카
  'yonsei', // 연세대학교
  'chungang', // 중앙대학교
  'kyunghee', // 경희대학교
  'kyunghee_global', // 경희대학교 국제캠퍼스
  'sungkyunkwan', // 성균관대학교
  'hankukufs', // 한국외국어대학교
  'soongsil', // 숭실대학교
  'konkuk', // 건국대학교
  'sejong', // 세종대학교
  'dongguk', // 동국대학교
  'sogang', // 서강대학교
  'inha', // 인하대학교
  'ajou', // 아주대학교
  'myeongji_humanities', // 명지대학교 인문캠퍼스
  'kookmin', // 국민대학교
  'ewha', // 이화여자대학교
  'hongik', // 홍익대학교
  'seoulnational', // 서울대학교
  'seoulcity', // 서울시립대학교
  'catholic', // 가톨릭대학교
  'kwangwoon', // 광운대학교
  'seokyeong', // 서경대학교
  'dankook', // 단국대학교
  'seoultech', // 서울과학기술대학교
  'seoulwomen', // 서울여자대학교
  'kangseo', // 강서대학교
  'sungshin', // 성신여자대학교
  'duksung', // 덕성여자대학교
  'sookmyung', // 숙명여자대학교
  'karts', // 한국예술종합학교
  'dongduk', // 동덕여자대학교
] as const;

export type UniversityID = (typeof UNIVERSITY_IDS)[number];

export const UNIVERSITY_EMAIL_DOMAINS: Record<UniversityID, string> = {
  all: '',
  korea: 'korea.ac.kr',
  gachon: 'gachon.ac.kr',
  hanyang: 'hanyang.ac.kr',
  yonsei: 'yonsei.ac.kr',
  chungang: 'cau.ac.kr',
  kyunghee: 'khu.ac.kr',
  sungkyunkwan: 'skku.ac.kr',
  hankukufs: 'hufs.ac.kr',
  soongsil: 'ssu.ac.kr',
  konkuk: 'konkuk.ac.kr',
  hanyang_erika: 'hanyang.ac.kr',
  sejong: 'sju.ac.kr',
  dongguk: 'dongguk.ac.kr',
  sogang: 'sogang.ac.kr',
  inha: 'inha.ac.kr',
  ajou: 'ajou.ac.kr',
  myeongji_humanities: 'mju.ac.kr',
  kookmin: 'kookmin.ac.kr',
  ewha: 'ewha.ac.kr',
  hongik: 'hongik.ac.kr',
  seoulnational: 'snu.ac.kr',
  seoulcity: 'uos.ac.kr',
  catholic: 'catholic.ac.kr',
  kwangwoon: 'kw.ac.kr',
  seokyeong: 'skuniv.ac.kr',
  kyunghee_global: 'khu.ac.kr',
  dankook: 'dankook.ac.kr',
  seoultech: 'seoultech.ac.kr',
  seoulwomen: 'swu.ac.kr',
  kangseo: 'kangseo.ac.kr',
  sungshin: 'sungshin.ac.kr',
  duksung: 'duksung.ac.kr',
  sookmyung: 'sookmyung.ac.kr',
  karts: 'karts.ac.kr',
  dongduk: 'dongduk.ac.kr',
};

export const UNIVERSITY_ICONS: Record<UniversityID, React.ComponentType> = {
  all: BuddyyaIcon,
  korea: KoreaIcon,
  gachon: GachonIcon,
  hanyang: HanyangIcon,
  yonsei: YonseiIcon,
  chungang: ChungAngIcon,
  kyunghee: KyungHeeIcon,
  sungkyunkwan: SungkyunkwanIcon,
  hankukufs: HankukUFSIcon,
  soongsil: SoongsilIcon,
  konkuk: KonkukIcon,
  hanyang_erika: HanyangIcon,
  sejong: SejongIcon,
  dongguk: DonggukIcon,
  sogang: SogangIcon,
  inha: InhaIcon,
  ajou: AjouIcon,
  myeongji_humanities: MyeongjiIcon,
  kookmin: KookminIcon,
  ewha: EwhaIcon,
  hongik: HongikIcon,
  seoulnational: SeoulNationalIcon,
  seoulcity: SeoulCityIcon,
  catholic: CatholicIcon,
  kwangwoon: KwangwoonIcon,
  seokyeong: SeokyeongIcon,
  kyunghee_global: KyungHeeIcon,
  dankook: DankookIcon,
  seoultech: SeoulTechIcon,
  seoulwomen: SeoulWomenIcon,
  kangseo: KangseoIcon,
  sungshin: SungshinIcon,
  duksung: DuksungIcon,
  sookmyung: SookmyungIcon,
  karts: KARTSIcon,
  dongduk: DongdukIcon,
};

export const UNIVERSITIES = UNIVERSITY_IDS.map((id) => ({
  id,
  emailDomain: UNIVERSITY_EMAIL_DOMAINS[id],
  icon: UNIVERSITY_ICONS[id],
}));
