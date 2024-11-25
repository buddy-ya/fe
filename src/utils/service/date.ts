// utils/service/date.ts
import { formatDistanceToNow } from "date-fns";
import { ko, enUS } from "date-fns/locale";
import * as Localization from "expo-localization";

// const koLocaleCustom = {
//   ...ko,
//   formatDistance: (token: string, count: number, options?: any) => {
//     const formatted = ko.formatDistance(token, count, options);
//     return formatted?.replace('약 ', '');
//   },
// };

export const getTimeAgo = (date: string) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: Localization.locale.startsWith("ko") ? ko : enUS,
  }).replace("약", "");
};
