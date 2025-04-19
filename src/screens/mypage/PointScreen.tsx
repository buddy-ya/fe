import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, FlatList } from 'react-native';
import { InnerLayout, Layout, MyText } from '@/components';
import { useUserStore } from '@/store';
import { PointDTO, PointsResponseDTO } from '@/types/PointDTO';
import PointIcon from '@assets/icons/bigPoint.svg';
import PointRepository from '@/api/PointRepository';
import { PointItem } from '@/components/my/PointItem';

export default function PointScreen({ navigation }: any) {
  const { t } = useTranslation('mypage');

  const [pointsData, setPointsData] = useState<PointsResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUser = useUserStore((state) => state.update);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const data = await PointRepository.get();
        setPointsData(data);
        updateUser({ point: data.currentPoint });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

  return (
    <Layout
      showHeader
      onBack={() => navigation.goBack()}
      headerCenter={
        <MyText size="text-lg" className="font-semibold">
          {t('point.point')}
        </MyText>
      }
    >
      <InnerLayout>
        <View className="mt-4 items-center rounded-xl p-8">
          <View className="">
            <PointIcon width={70} height={70} />
          </View>
          <View className="mt-4 flex-row items-center justify-center rounded-full p-3">
            <MyText size="text-lg" color="text-black" className="font-semibold">
              {t('point.currentPoint')}
            </MyText>
            <MyText size="text-lg" color="text-primary" className="ml-3 font-semibold">
              {pointsData?.currentPoint}
            </MyText>
          </View>
        </View>

        <View className="mt-4">
          <FlatList
            data={pointsData?.points}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PointItem point={item} />}
            showsVerticalScrollIndicator={false}
            className="rounded-xl"
            contentContainerStyle={{ paddingBottom: 200 }}
          />
        </View>
      </InnerLayout>
    </Layout>
  );
}
