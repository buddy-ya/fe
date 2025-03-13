import { formatDistanceToNow } from 'date-fns';
import { enUS, ko } from 'date-fns/locale';
import * as Localization from 'expo-localization';

export const getTimeAgo = (date: string) => {
  const isKorean = Localization.locale.startsWith('ko');

  let distance = formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: isKorean ? ko : enUS,
  });

  if (isKorean) {
    distance = distance
      .replace('약', '')
      .replace('1분 미만 전', '방금 전')
      .replace('1분 미만 후', '방금 전')
      .trim();
  } else {
    distance = distance
      .replace(/^about /, '')
      .replace(/^less than a minute ago$/, 'just now')
      .replace(/^(\d+)\sminutes?\sago$/, '$1m')
      .replace(/^(\d+)\sminute\sago$/, '$1m')
      .replace(/^(\d+)\shours?\sago$/, '$1h')
      .replace(/^(\d+)\sdays?\sago$/, '$1d')
      .replace(/^(\d+)\sweeks?\sago$/, '$1w')
      .replace(/^(\d+)\smonths?\sago$/, '$1mo')
      .replace(/^(\d+)\syears?\sago$/, '$1y')
      .trim();
  }

  return distance;
};
