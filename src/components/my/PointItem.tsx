import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { MyText } from '@/components';
import { PointDTO } from '@/types/PointDTO';
import dayjs from 'dayjs';

type PointItemProps = {
  point: PointDTO;
};
export function PointItem({ point }: PointItemProps) {
  const { t } = useTranslation('mypage');
  const { pointType, pointChangeType, pointChange, createdDate } = point;

  const changeKey = pointChangeType === 'mission' ? 'earn' : (pointChangeType as string);
  const earnTypes: Array<'earn' | 'mission'> = ['earn', 'mission'];
  const isEarn = earnTypes.includes(pointChangeType as any);

  const sign = isEarn ? '+' : '-';
  const textColor = isEarn ? 'text-green-600' : '';

  const typeLabel = t(`point.pointType.${pointType}`, pointType);
  const changeTypeLabel = t(`point.pointChangeType.${changeKey}`, changeKey);
  const dateStr = dayjs(createdDate).format('YYYY-MM-DD HH:mm');

  return (
    <View className="justify-between border-b border-[#E8E9EB] bg-white p-4">
      <View className="flex-row items-center justify-between">
        <MyText size="text-base" className="mb-1 font-semibold">
          {typeLabel}
        </MyText>
        <MyText size="text-base" className={`mb-1 font-semibold ${textColor}`}>
          {sign}
          {Math.abs(pointChange)}
        </MyText>
      </View>
      <View className="mt-1 flex-row items-center justify-between">
        <MyText size="text-sm" className="text-gray-500">
          {dateStr}
        </MyText>
        <MyText size="text-sm" className="text-gray-500">
          {changeTypeLabel}
        </MyText>
      </View>
    </View>
  );
}
