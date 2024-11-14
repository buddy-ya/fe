// constants/countries.ts
export const COUNTRIES = [
  // East Asia
  { id: "cn", name: "China", ko: "중국", flag: "🇨🇳" },
  { id: "hk", name: "Hong Kong", ko: "홍콩", flag: "🇭🇰" },
  { id: "jp", name: "Japan", ko: "일본", flag: "🇯🇵" },
  { id: "mo", name: "Macau", ko: "마카오", flag: "🇲🇴" },
  { id: "mn", name: "Mongolia", ko: "몽골", flag: "🇲🇳" },
  { id: "tw", name: "Taiwan", ko: "대만", flag: "🇹🇼" },

  // Southeast Asia
  { id: "bn", name: "Brunei", ko: "브루나이", flag: "🇧🇳" },
  { id: "kh", name: "Cambodia", ko: "캄보디아", flag: "🇰🇭" },
  { id: "id", name: "Indonesia", ko: "인도네시아", flag: "🇮🇩" },
  { id: "la", name: "Laos", ko: "라오스", flag: "🇱🇦" },
  { id: "my", name: "Malaysia", ko: "말레이시아", flag: "🇲🇾" },
  { id: "mm", name: "Myanmar", ko: "미얀마", flag: "🇲🇲" },
  { id: "ph", name: "Philippines", ko: "필리핀", flag: "🇵🇭" },
  { id: "sg", name: "Singapore", ko: "싱가포르", flag: "🇸🇬" },
  { id: "th", name: "Thailand", ko: "태국", flag: "🇹🇭" },
  { id: "tl", name: "Timor-Leste", ko: "동티모르", flag: "🇹🇱" },
  { id: "vn", name: "Vietnam", ko: "베트남", flag: "🇻🇳" },

  // South Asia
  { id: "bd", name: "Bangladesh", ko: "방글라데시", flag: "🇧🇩" },
  { id: "bt", name: "Bhutan", ko: "부탄", flag: "🇧🇹" },
  { id: "in", name: "India", ko: "인도", flag: "🇮🇳" },
  { id: "mv", name: "Maldives", ko: "몰디브", flag: "🇲🇻" },
  { id: "np", name: "Nepal", ko: "네팔", flag: "🇳🇵" },
  { id: "pk", name: "Pakistan", ko: "파키스탄", flag: "🇵🇰" },
  { id: "lk", name: "Sri Lanka", ko: "스리랑카", flag: "🇱🇰" },

  // Central Asia
  { id: "kz", name: "Kazakhstan", ko: "카자흐스탄", flag: "🇰🇿" },
  { id: "kg", name: "Kyrgyzstan", ko: "키르기스스탄", flag: "🇰🇬" },
  { id: "tj", name: "Tajikistan", ko: "타지키스탄", flag: "🇹🇯" },
  { id: "tm", name: "Turkmenistan", ko: "투르크메니스탄", flag: "🇹🇲" },
  { id: "uz", name: "Uzbekistan", ko: "우즈베키스탄", flag: "🇺🇿" },

  // North America
  { id: "ca", name: "Canada", ko: "캐나다", flag: "🇨🇦" },
  { id: "mx", name: "Mexico", ko: "멕시코", flag: "🇲🇽" },
  { id: "us", name: "United States", ko: "미국", flag: "🇺🇸" },

  // Central America & Caribbean
  { id: "cr", name: "Costa Rica", ko: "코스타리카", flag: "🇨🇷" },
  { id: "cu", name: "Cuba", ko: "쿠바", flag: "🇨🇺" },
  { id: "do", name: "Dominican Republic", ko: "도미니카 공화국", flag: "🇩🇴" },
  { id: "sv", name: "El Salvador", ko: "엘살바도르", flag: "🇸🇻" },
  { id: "gt", name: "Guatemala", ko: "과테말라", flag: "🇬🇹" },
  { id: "pa", name: "Panama", ko: "파나마", flag: "🇵🇦" },

  // South America
  { id: "ar", name: "Argentina", ko: "아르헨티나", flag: "🇦🇷" },
  { id: "bo", name: "Bolivia", ko: "볼리비아", flag: "🇧🇴" },
  { id: "br", name: "Brazil", ko: "브라질", flag: "🇧🇷" },
  { id: "cl", name: "Chile", ko: "칠레", flag: "🇨🇱" },
  { id: "co", name: "Colombia", ko: "콜롬비아", flag: "🇨🇴" },
  { id: "ec", name: "Ecuador", ko: "에콰도르", flag: "🇪🇨" },
  { id: "py", name: "Paraguay", ko: "파라과이", flag: "🇵🇾" },
  { id: "pe", name: "Peru", ko: "페루", flag: "🇵🇪" },
  { id: "uy", name: "Uruguay", ko: "우루과이", flag: "🇺🇾" },
  { id: "ve", name: "Venezuela", ko: "베네수엘라", flag: "🇻🇪" },

  // Western Europe
  { id: "at", name: "Austria", ko: "오스트리아", flag: "🇦🇹" },
  { id: "be", name: "Belgium", ko: "벨기에", flag: "🇧🇪" },
  { id: "fr", name: "France", ko: "프랑스", flag: "🇫🇷" },
  { id: "de", name: "Germany", ko: "독일", flag: "🇩🇪" },
  { id: "gr", name: "Greece", ko: "그리스", flag: "🇬🇷" },
  { id: "ie", name: "Ireland", ko: "아일랜드", flag: "🇮🇪" },
  { id: "it", name: "Italy", ko: "이탈리아", flag: "🇮🇹" },
  { id: "lu", name: "Luxembourg", ko: "룩셈부르크", flag: "🇱🇺" },
  { id: "nl", name: "Netherlands", ko: "네덜란드", flag: "🇳🇱" },
  { id: "pt", name: "Portugal", ko: "포르투갈", flag: "🇵🇹" },
  { id: "es", name: "Spain", ko: "스페인", flag: "🇪🇸" },
  { id: "ch", name: "Switzerland", ko: "스위스", flag: "🇨🇭" },
  { id: "gb", name: "United Kingdom", ko: "영국", flag: "🇬🇧" },

  // Northern Europe
  { id: "dk", name: "Denmark", ko: "덴마크", flag: "🇩🇰" },
  { id: "ee", name: "Estonia", ko: "에스토니아", flag: "🇪🇪" },
  { id: "fi", name: "Finland", ko: "핀란드", flag: "🇫🇮" },
  { id: "is", name: "Iceland", ko: "아이슬란드", flag: "🇮🇸" },
  { id: "lv", name: "Latvia", ko: "라트비아", flag: "🇱🇻" },
  { id: "lt", name: "Lithuania", ko: "리투아니아", flag: "🇱🇹" },
  { id: "no", name: "Norway", ko: "노르웨이", flag: "🇳🇴" },
  { id: "se", name: "Sweden", ko: "스웨덴", flag: "🇸🇪" },

  // Eastern Europe
  { id: "by", name: "Belarus", ko: "벨라루스", flag: "🇧🇾" },
  { id: "bg", name: "Bulgaria", ko: "불가리아", flag: "🇧🇬" },
  { id: "hr", name: "Croatia", ko: "크로아티아", flag: "🇭🇷" },
  { id: "cz", name: "Czech Republic", ko: "체코", flag: "🇨🇿" },
  { id: "hu", name: "Hungary", ko: "헝가리", flag: "🇭🇺" },
  { id: "pl", name: "Poland", ko: "폴란드", flag: "🇵🇱" },
  { id: "ro", name: "Romania", ko: "루마니아", flag: "🇷🇴" },
  { id: "ru", name: "Russia", ko: "러시아", flag: "🇷🇺" },
  { id: "sk", name: "Slovakia", ko: "슬로바키아", flag: "🇸🇰" },
  { id: "si", name: "Slovenia", ko: "슬로베니아", flag: "🇸🇮" },
  { id: "ua", name: "Ukraine", ko: "우크라이나", flag: "🇺🇦" },

  // Oceania
  { id: "au", name: "Australia", ko: "오스트레일리아", flag: "🇦🇺" },
  { id: "fj", name: "Fiji", ko: "피지", flag: "🇫🇯" },
  { id: "nz", name: "New Zealand", ko: "뉴질랜드", flag: "🇳🇿" },

  // Middle East & North Africa
  { id: "eg", name: "Egypt", ko: "이집트", flag: "🇪🇬" },
  { id: "ir", name: "Iran", ko: "이란", flag: "🇮🇷" },
  { id: "iq", name: "Iraq", ko: "이라크", flag: "🇮🇶" },
  { id: "il", name: "Israel", ko: "이스라엘", flag: "🇮🇱" },
  { id: "jo", name: "Jordan", ko: "요르단", flag: "🇯🇴" },
  { id: "kw", name: "Kuwait", ko: "쿠웨이트", flag: "🇰🇼" },
  { id: "lb", name: "Lebanon", ko: "레바논", flag: "🇱🇧" },
  { id: "ma", name: "Morocco", ko: "모로코", flag: "🇲🇦" },
  { id: "om", name: "Oman", ko: "오만", flag: "🇴🇲" },
  { id: "qa", name: "Qatar", ko: "카타르", flag: "🇶🇦" },
  { id: "sa", name: "Saudi Arabia", ko: "사우디아라비아", flag: "🇸🇦" },
  { id: "tr", name: "Türkiye", ko: "튀르키예", flag: "🇹🇷" },
  { id: "ae", name: "United Arab Emirates", ko: "아랍에미리트", flag: "🇦🇪" },
].sort((a, b) => a.name.localeCompare(b.name));
