import { formatDistanceToNow } from 'date-fns';
import { enUS, ko } from 'date-fns/locale';
import * as Localization from 'expo-localization';

export const getTimeAgo = (date: string) => {
  const distance = formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: Localization.locale.startsWith('ko') ? ko : enUS,
  });

  return distance
    .replace('약', '')
    .replace('1분 미만 전', '방금 전')
    .replace('1분 미만 후', '방금 전');
};
