import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { RoomRepository } from '@/api';
import { InnerLayout, Layout, MyText, RoomList } from '@/components';
import { useBackButton } from '@/hooks';
import { ChatStackParamList, FeedStackParamList } from '@/navigation/navigationRef';
import { Room } from '@/types/RoomDTO';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSuspenseQuery } from '@tanstack/react-query';
import { UserRoundPlus } from 'lucide-react-native';
import Skeleton from '../Skeleton';

type RoomListNavigationProps = NativeStackScreenProps<
  ChatStackParamList & FeedStackParamList,
  'RoomList'
>;

export default function RoomListScreen({ navigation }: RoomListNavigationProps) {
  // TODO: 스크롤 등 했을때 다시 불러오는 로직 필요
  const { data } = useSuspenseQuery({
    queryKey: ['roomList'],
    queryFn: RoomRepository.getRoomList,
  });

  const { t } = useTranslation('chat');

  const handleGoToFeed = () => {
    navigation.navigate('FeedTab', { screen: 'FeedHome' } as any);
  };

  const handleGoToRequests = () => {
    navigation.navigate('ChatRequests');
  };

  const handlePressRoom = (room: Room) => {
    navigation.navigate('ChatRoom', { id: room.id });
  };

  return (
    <Layout
      isBackgroundWhite
      showHeader
      headerLeft={
        <View className="p-2">
          <MyText className="font-bold" size="text-[22px]" color="text-[#282828]">
            {t('roomList.title')}
          </MyText>
        </View>
      }
      headerRight={
        <TouchableOpacity
          className="p-2"
          onPress={handleGoToRequests}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <UserRoundPlus strokeWidth={2} size={24} color={'#797979'} />
        </TouchableOpacity>
      }
    >
      <InnerLayout>
        <View className="flex-1">
          <View className="flex h-[77px] flex-row items-center justify-between rounded-xl bg-primary px-6 py-4">
            <View className="flex h-full flex-1 flex-row items-center">
              <MyText className="text-white" size="text-lg">
                {t('roomList.banner.title')}
              </MyText>
            </View>
            <View className="mt-6 flex h-full flex-1 flex-row items-center justify-end">
              <TouchableOpacity onPress={handleGoToFeed}>
                <MyText className="text-white" size="text-sm">
                  {t('roomList.banner.description')}
                </MyText>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-1">
            <RoomList rooms={data} onPress={handlePressRoom} />
          </View>
        </View>
      </InnerLayout>
    </Layout>
  );
}

export const SuspendedRoomListScreen = (props: RoomListNavigationProps) => {
  useBackButton();
  return (
    <ErrorBoundary fallback={<></>}>
      <Suspense
        fallback={
          <Layout showHeader disableBottomSafeArea onBack={() => props.navigation.goBack()}>
            <InnerLayout>
              <Skeleton />
            </InnerLayout>
          </Layout>
        }
      >
        <RoomListScreen {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};
