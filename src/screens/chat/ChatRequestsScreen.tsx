import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { ChatRepository, RoomRepository } from '@/api';
import { InnerLayout, Layout, MyText } from '@/components';
import { ChatStackParamList } from '@/navigation/navigationRef';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react-native';
import ChatSkeleton from '@/components/chat/ChatSkeleton';
import RequestList from '@/components/chat/RequestList';

type ChatRequestsNavigationProps = NativeStackScreenProps<ChatStackParamList, 'ChatRequests'>;

export default function ChatRequestsScreen({ navigation }: ChatRequestsNavigationProps) {
  const { t } = useTranslation('chat');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleProfilePress = (senderId: number) => {
    navigation.navigate('Profile', { id: senderId });
  };

  const handleAccept = async (receiverId: number) => {
    const data = await RoomRepository.create({ buddyId: receiverId });
    navigation.navigate('ChatRoom', { id: data.id });
  };

  const handleDecline = async (chatRequestId: number) => {
    await ChatRepository.decline({ chatRequestId });
  };

  const { data: requests } = useSuspenseQuery({
    queryKey: ['requests'],
    queryFn: ChatRepository.getRequestList,
  });

  return (
    <Layout
      isBackgroundWhite
      showHeader
      headerLeft={
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={handleBack}
        >
          <ChevronLeft size={30} color={'#797979'} strokeWidth={2} />
        </TouchableOpacity>
      }
      headerCenter={
        <MyText size="text-lg" className="font-bold" color="text-[#282828]">
          {t('requests.title')}
        </MyText>
      }
    >
      <InnerLayout>
        <View className="flex-1">
          <View className="flex h-[30px] flex-row items-center justify-between rounded-lg bg-[#DFDFDF]">
            <View className="flex h-full flex-1 flex-row items-center justify-center">
              <MyText size="text-sm" color="text-[#636363]">
                {t('requests.banner.description')}
              </MyText>
            </View>
          </View>
          <View className="flex-1">
            <RequestList
              requests={requests}
              onProfilePress={handleProfilePress}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          </View>
        </View>
      </InnerLayout>
    </Layout>
  );
}

export const SuspendedRequestsScreen = (props: ChatRequestsNavigationProps) => {
  return (
    <ErrorBoundary fallback={<></>}>
      <Suspense
        fallback={
          <Layout showHeader disableBottomSafeArea onBack={() => props.navigation.goBack()}>
            <InnerLayout>
              <ChatSkeleton />
            </InnerLayout>
          </Layout>
        }
      >
        <ChatRequestsScreen {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};
