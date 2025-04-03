import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { Linking } from 'react-native';
import { ChatSocketRepository, RoomRepository } from '@/api';
import { InnerLayout, Layout, MyText, RoomList } from '@/components';
import { useBackButton } from '@/hooks';
import { ChatStackParamList, FeedStackParamList } from '@/navigation/navigationRef';
import { useChatRoomStore } from '@/store';
import { Room, RoomListResponse } from '@/types/RoomDTO';
import InqueryEn from '@assets/icons/inqueryEn.svg';
import InqueryKo from '@assets/icons/inqueryKo.svg';
import LogoIcon from '@assets/icons/logo.svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSuspenseQuery } from '@tanstack/react-query';
import { locale } from 'expo-localization';
import * as Localization from 'expo-localization';
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

  const openInstagramProfile = () => {
    const url = 'instagram://user?username=apple';
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL('https://www.instagram.com/apple');
      }
    });
  };

  const locale = Localization.locale;

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
      headerLeft={
        <MyText size="text-2xl" className="font-semibold">
          {t('roomList.title')}
        </MyText>
      }
      headerRight={
        <TouchableOpacity
          className="relative p-1"
          onPress={handleGoToRequests}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <UserRoundPlus strokeWidth={2} size={24} color={'#797979'} />
          {hasChatRequest && (
            <View className="absolute right-[8px] top-[5px] h-2 w-2 rounded-full bg-primary"></View>
          )}
        </TouchableOpacity>
      }
    >
      <InnerLayout>
        <View className="flex-1">
          <TouchableOpacity
            onPress={openInstagramProfile}
            activeOpacity={0.7}
            className="my-1 items-center"
          >
            {locale.startsWith('ko') ? <InqueryKo /> : <InqueryEn />}
          </TouchableOpacity>
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
