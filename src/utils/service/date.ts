// utils/service/date.ts
import { formatDistanceToNow } from 'date-fns';
import { enUS, ko } from 'date-fns/locale';
import * as Localization from 'expo-localization';

export const getTimeAgo = (date: string) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: Localization.locale.startsWith('ko') ? ko : enUS,
  }).replace('약', '');
};
