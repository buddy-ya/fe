// constants/countries.ts
export const COUNTRIES = [
  // East Asia
  { id: "cn", en: "China", ko: "중국", flag: "🇨🇳" },
  { id: "hk", en: "Hong Kong", ko: "홍콩", flag: "🇭🇰" },
  { id: "jp", en: "Japan", ko: "일본", flag: "🇯🇵" },
  { id: "mo", en: "Macau", ko: "마카오", flag: "🇲🇴" },
  { id: "mn", en: "Mongolia", ko: "몽골", flag: "🇲🇳" },
  { id: "tw", en: "Taiwan", ko: "대만", flag: "🇹🇼" },

  // Southeast Asia
  { id: "bn", en: "Brunei", ko: "브루나이", flag: "🇧🇳" },
  { id: "kh", en: "Cambodia", ko: "캄보디아", flag: "🇰🇭" },
  { id: "id", en: "Indonesia", ko: "인도네시아", flag: "🇮🇩" },
  { id: "la", en: "Laos", ko: "라오스", flag: "🇱🇦" },
  { id: "my", en: "Malaysia", ko: "말레이시아", flag: "🇲🇾" },
  { id: "mm", en: "Myanmar", ko: "미얀마", flag: "🇲🇲" },
  { id: "ph", en: "Philippines", ko: "필리핀", flag: "🇵🇭" },
  { id: "sg", en: "Singapore", ko: "싱가포르", flag: "🇸🇬" },
  { id: "th", en: "Thailand", ko: "태국", flag: "🇹🇭" },
  { id: "tl", en: "Timor-Leste", ko: "동티모르", flag: "🇹🇱" },
  { id: "vn", en: "Vietnam", ko: "베트남", flag: "🇻🇳" },

  // South Asia
  { id: "bd", en: "Bangladesh", ko: "방글라데시", flag: "🇧🇩" },
  { id: "bt", en: "Bhutan", ko: "부탄", flag: "🇧🇹" },
  { id: "in", en: "India", ko: "인도", flag: "🇮🇳" },
  { id: "mv", en: "Maldives", ko: "몰디브", flag: "🇲🇻" },
  { id: "np", en: "Nepal", ko: "네팔", flag: "🇳🇵" },
  { id: "pk", en: "Pakistan", ko: "파키스탄", flag: "🇵🇰" },
  { id: "lk", en: "Sri Lanka", ko: "스리랑카", flag: "🇱🇰" },

  // Central Asia
  { id: "kz", en: "Kazakhstan", ko: "카자흐스탄", flag: "🇰🇿" },
  { id: "kg", en: "Kyrgyzstan", ko: "키르기스스탄", flag: "🇰🇬" },
  { id: "tj", en: "Tajikistan", ko: "타지키스탄", flag: "🇹🇯" },
  { id: "tm", en: "Turkmenistan", ko: "투르크메니스탄", flag: "🇹🇲" },
  { id: "uz", en: "Uzbekistan", ko: "우즈베키스탄", flag: "🇺🇿" },

  // North America
  { id: "ca", en: "Canada", ko: "캐나다", flag: "🇨🇦" },
  { id: "mx", en: "Mexico", ko: "멕시코", flag: "🇲🇽" },
  { id: "us", en: "United States", ko: "미국", flag: "🇺🇸" },

  // Central America & Caribbean
  { id: "cr", en: "Costa Rica", ko: "코스타리카", flag: "🇨🇷" },
  { id: "cu", en: "Cuba", ko: "쿠바", flag: "🇨🇺" },
  { id: "do", en: "Dominican Republic", ko: "도미니카 공화국", flag: "🇩🇴" },
  { id: "sv", en: "El Salvador", ko: "엘살바도르", flag: "🇸🇻" },
  { id: "gt", en: "Guatemala", ko: "과테말라", flag: "🇬🇹" },
  { id: "pa", en: "Panama", ko: "파나마", flag: "🇵🇦" },

  // South America
  { id: "ar", en: "Argentina", ko: "아르헨티나", flag: "🇦🇷" },
  { id: "bo", en: "Bolivia", ko: "볼리비아", flag: "🇧🇴" },
  { id: "br", en: "Brazil", ko: "브라질", flag: "🇧🇷" },
  { id: "cl", en: "Chile", ko: "칠레", flag: "🇨🇱" },
  { id: "co", en: "Colombia", ko: "콜롬비아", flag: "🇨🇴" },
  { id: "ec", en: "Ecuador", ko: "에콰도르", flag: "🇪🇨" },
  { id: "py", en: "Paraguay", ko: "파라과이", flag: "🇵🇾" },
  { id: "pe", en: "Peru", ko: "페루", flag: "🇵🇪" },
  { id: "uy", en: "Uruguay", ko: "우루과이", flag: "🇺🇾" },
  { id: "ve", en: "Venezuela", ko: "베네수엘라", flag: "🇻🇪" },

  // Western Europe
  { id: "at", en: "Austria", ko: "오스트리아", flag: "🇦🇹" },
  { id: "be", en: "Belgium", ko: "벨기에", flag: "🇧🇪" },
  { id: "fr", en: "France", ko: "프랑스", flag: "🇫🇷" },
  { id: "de", en: "Germany", ko: "독일", flag: "🇩🇪" },
  { id: "gr", en: "Greece", ko: "그리스", flag: "🇬🇷" },
  { id: "ie", en: "Ireland", ko: "아일랜드", flag: "🇮🇪" },
  { id: "it", en: "Italy", ko: "이탈리아", flag: "🇮🇹" },
  { id: "lu", en: "Luxembourg", ko: "룩셈부르크", flag: "🇱🇺" },
  { id: "nl", en: "Netherlands", ko: "네덜란드", flag: "🇳🇱" },
  { id: "pt", en: "Portugal", ko: "포르투갈", flag: "🇵🇹" },
  { id: "es", en: "Spain", ko: "스페인", flag: "🇪🇸" },
  { id: "ch", en: "Switzerland", ko: "스위스", flag: "🇨🇭" },
  { id: "gb", en: "United Kingdom", ko: "영국", flag: "🇬🇧" },

  // Northern Europe
  { id: "dk", en: "Denmark", ko: "덴마크", flag: "🇩🇰" },
  { id: "ee", en: "Estonia", ko: "에스토니아", flag: "🇪🇪" },
  { id: "fi", en: "Finland", ko: "핀란드", flag: "🇫🇮" },
  { id: "is", en: "Iceland", ko: "아이슬란드", flag: "🇮🇸" },
  { id: "lv", en: "Latvia", ko: "라트비아", flag: "🇱🇻" },
  { id: "lt", en: "Lithuania", ko: "리투아니아", flag: "🇱🇹" },
  { id: "no", en: "Norway", ko: "노르웨이", flag: "🇳🇴" },
  { id: "se", en: "Sweden", ko: "스웨덴", flag: "🇸🇪" },

  // Eastern Europe
  { id: "by", en: "Belarus", ko: "벨라루스", flag: "🇧🇾" },
  { id: "bg", en: "Bulgaria", ko: "불가리아", flag: "🇧🇬" },
  { id: "hr", en: "Croatia", ko: "크로아티아", flag: "🇭🇷" },
  { id: "cz", en: "Czech Republic", ko: "체코", flag: "🇨🇿" },
  { id: "hu", en: "Hungary", ko: "헝가리", flag: "🇭🇺" },
  { id: "pl", en: "Poland", ko: "폴란드", flag: "🇵🇱" },
  { id: "ro", en: "Romania", ko: "루마니아", flag: "🇷🇴" },
  { id: "ru", en: "Russia", ko: "러시아", flag: "🇷🇺" },
  { id: "sk", en: "Slovakia", ko: "슬로바키아", flag: "🇸🇰" },
  { id: "si", en: "Slovenia", ko: "슬로베니아", flag: "🇸🇮" },
  { id: "ua", en: "Ukraine", ko: "우크라이나", flag: "🇺🇦" },

  // Oceania
  { id: "au", en: "Australia", ko: "오스트레일리아", flag: "🇦🇺" },
  { id: "fj", en: "Fiji", ko: "피지", flag: "🇫🇯" },
  { id: "nz", en: "New Zealand", ko: "뉴질랜드", flag: "🇳🇿" },

  // Middle East & North Africa
  { id: "eg", en: "Egypt", ko: "이집트", flag: "🇪🇬" },
  { id: "ir", en: "Iran", ko: "이란", flag: "🇮🇷" },
  { id: "iq", en: "Iraq", ko: "이라크", flag: "🇮🇶" },
  { id: "il", en: "Israel", ko: "이스라엘", flag: "🇮🇱" },
  { id: "jo", en: "Jordan", ko: "요르단", flag: "🇯🇴" },
  { id: "kw", en: "Kuwait", ko: "쿠웨이트", flag: "🇰🇼" },
  { id: "lb", en: "Lebanon", ko: "레바논", flag: "🇱🇧" },
  { id: "ma", en: "Morocco", ko: "모로코", flag: "🇲🇦" },
  { id: "om", en: "Oman", ko: "오만", flag: "🇴🇲" },
  { id: "qa", en: "Qatar", ko: "카타르", flag: "🇶🇦" },
  { id: "sa", en: "Saudi Arabia", ko: "사우디아라비아", flag: "🇸🇦" },
  { id: "tr", en: "Türkiye", ko: "튀르키예", flag: "🇹🇷" },
  { id: "ae", en: "United Arab Emirates", ko: "아랍에미리트", flag: "🇦🇪" },
].sort((a, b) => a.en.localeCompare(b.en));
