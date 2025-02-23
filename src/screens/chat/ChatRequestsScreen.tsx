import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, View } from 'react-native';
import { ChatRequestRepository } from '@/api';
import { InnerLayout, Layout, MyText } from '@/components';
import { ChatStackParamList } from '@/navigation/navigationRef';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react-native';
import ChatSkeleton from '@/components/chat/ChatSkeleton';
import RequestList from '@/components/chat/RequestList';

type ChatRequestsNavigationProps = NativeStackScreenProps<ChatStackParamList, 'ChatRequests'>;

export function ChatRequestsScreen({ navigation }: ChatRequestsNavigationProps) {
  const { t } = useTranslation('chat');
  const queryClient = useQueryClient();

  const handleProfilePress = (senderId: number) => {
    navigation.navigate('Profile', { id: senderId });
  };

  const handleAccept = async (senderId: number, chatRequestId: number) => {
    try {
      await ChatRequestRepository.accept({ senderId, chatRequestId });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    } catch (error) {
      console.error(error);
      Alert.alert(t('requests.error.acceptTitle'), t('requests.error.acceptDescription'));
    }
  };

  const handleDecline = async (chatRequestId: number) => {
    try {
      await ChatRequestRepository.decline({ chatRequestId });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    } catch (error) {
      console.error(error);
      Alert.alert(t('requests.error.declineTitle'), t('requests.error.declineDescription'));
    }
  };

  const { data: requests } = useSuspenseQuery({
    queryKey: ['requests'],
    queryFn: ChatRequestRepository.getRequestList,
  });

  return (
    <Layout
      isBackgroundWhite
      showHeader
      onBack={() => navigation.goBack()}
      headerCenter={
        <MyText size="text-lg" className="font-semibold">
          {t('requests.title')}
        </MyText>
      }
    >
      <InnerLayout>
        <View className="flex-1">
          <View className="mt-2 flex h-[30px] flex-row items-center justify-between rounded-lg bg-[#DFDFDF]">
            <View className="flex h-full flex-1 flex-row items-center justify-center">
              <MyText color="text-[#636363]">{t('requests.banner.description')}</MyText>
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
