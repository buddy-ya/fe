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
      .replace(/^(\d+)\sminutes?\sago$/, '$1m ago')
      .replace(/^(\d+)\sminute\sago$/, '$1m ago')
      .replace(/^(\d+)\shours?\sago$/, '$1h ago')
      .replace(/^(\d+)\sdays?\sago$/, '$1d ago')
      .replace(/^(\d+)\sweeks?\sago$/, '$1w ago')
      .replace(/^(\d+)\smonths?\sago$/, '$1mo ago')
      .replace(/^(\d+)\syears?\sago$/, '$1y ago')
      .trim();
  }

  return distance;
};
