import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { ChatSocketRepository, RoomRepository } from '@/api';
import { InnerLayout, Layout, MyText, RoomList } from '@/components';
import { useBackButton } from '@/hooks';
import { ChatStackParamList, FeedStackParamList } from '@/navigation/navigationRef';
import { useChatRoomStore } from '@/store';
import { Room, RoomListResponse } from '@/types/RoomDTO';
import LogoIcon from '@assets/icons/logo.svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSuspenseQuery } from '@tanstack/react-query';
import { UserRoundPlus } from 'lucide-react-native';
import Skeleton from '../Skeleton';

type RoomListNavigationProps = NativeStackScreenProps<
  ChatStackParamList & FeedStackParamList,
  'RoomList'
>;

export default function RoomListScreen({ navigation }: RoomListNavigationProps) {
  const { data, refetch, isFetching } = useSuspenseQuery<RoomListResponse>({
    queryKey: ['roomList'],
    queryFn: RoomRepository.getRoomList,
    refetchOnMount: 'always',
    staleTime: 0,
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

  const handleRefresh = async () => {
    await refetch();
  };

  const { rooms, totalUnreadCount, hasChatRequest } = data;

  const setTotalUnreadCount = useChatRoomStore((state) => state.setTotalUnreadCount);

  useEffect(() => {
    setTotalUnreadCount(totalUnreadCount);
  }, [totalUnreadCount, setTotalUnreadCount]);

  return (
    <Layout
      showHeader
      isBackgroundWhite
      headerLeft={<LogoIcon />}
      headerRight={
        <TouchableOpacity
          className="relative p-1"
          onPress={handleGoToRequests}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <UserRoundPlus strokeWidth={1.3} size={24} color={'#797979'} />
          {hasChatRequest && (
            <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary"></View>
          )}
        </TouchableOpacity>
      }
    >
      <InnerLayout>
        <View className="flex-1">
          <TouchableOpacity onPress={handleGoToFeed} activeOpacity={0.7}>
            <View className="mt-4 flex h-[77px] flex-row items-center justify-between rounded-xl bg-primary px-6 py-4">
              <View className="flex h-full flex-1 flex-row items-center">
                <MyText className="text-white" size="text-lg">
                  {t('roomList.banner.title')}
                </MyText>
              </View>
              <View className="mt-6 flex h-full flex-1 flex-row items-center justify-end">
                <MyText className="text-white" size="text-sm">
                  {t('roomList.banner.description')}
                </MyText>
              </View>
            </View>
          </TouchableOpacity>
          <View className="flex-1">
            <RoomList
              rooms={rooms}
              onPress={handlePressRoom}
              refreshControl={{
                refreshing: isFetching,
                onRefresh: handleRefresh,
                tintColor: '#4AA366',
              }}
            />
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
