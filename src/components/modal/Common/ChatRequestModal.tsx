import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { API, ChatRequestRepository } from '@/api';
import { useToastStore } from '@/store';
import { getCountryFlag } from '@/utils';
import MyText from '@/components/common/MyText';
import { BottomModalWrapper } from './BottomModalWrapper';

interface CommonModalProps {
  visible: boolean;
  onClose: () => void;
  data: any;
}

export function ChatRequestModal({ visible, data, onClose }: CommonModalProps) {
  const { t } = useTranslation('feed');
  const name = data?.name;
  const university = data?.university;
  const country = data?.country;
  const isProfileImageUpload = data?.isProfileImageUpload;
  const profileImageUrl = data?.profileImageUrl;

  const title = t('chatRequestModal.title');
  const description = t('chatRequestModal.description');
  const confirmText = t('chatRequestModal.confirm');
  const cancelText = t('chatRequestModal.cancel');

  const { showToast } = useToastStore();

  const onConfirm = async () => {
    const userId = data?.userId;
    try {
      await ChatRequestRepository.create({ receiverId: userId });
    } catch (error: any) {
      const errorCode = error.response?.data?.code;
      const errorMapping: Record<number, { emoji: string; translationKey: string }> = {
        4000: { emoji: '🗑️', translationKey: 'feed:error.deletedFeed' },
        4006: { emoji: '🗑️', translationKey: 'feed:error.deletedComment' },
        5004: { emoji: '📩', translationKey: 'feed:error.alreadyExistChatRequest' },
        5005: { emoji: '💬', translationKey: 'feed:error.alreadyExistChatroom' },
      };
      const errorInfo = errorMapping[errorCode];

      if (errorInfo) {
        showToast(<Text>{errorInfo.emoji}</Text>, t(errorInfo.translationKey), 2000);
      }
    }
  };

  return (
    <BottomModalWrapper
      visible={visible}
      onClose={onClose}
      title={title}
      description={description}
      cancelText={cancelText}
      confirmText={confirmText}
      onConfirm={onConfirm}
    >
      <View className="mt-5 rounded-[12px] bg-mainBackground py-4">
        <View className="items-center">
          <Image className="h-[48px] w-[48px] rounded-[12px]" source={{ uri: profileImageUrl }} />
          <MyText size="text-[12px]" className="mt-3 font-semibold leading-[1]">
            {t(`universities:universities.${university}`)}
          </MyText>
          <View className="flex-row items-center">
            <MyText size="text-[12px]" className="leading-norma1 mr-1">
              {name}
            </MyText>
            <MyText size="">{getCountryFlag(country)}</MyText>
          </View>
          <MyText
            size="text-sm"
            className={`mt-3 rounded-full px-2 py-0 ${
              isProfileImageUpload ? 'bg-[#E8F8F4] text-primary' : 'bg-black/10 text-textProfile'
            }`}
          >
            {isProfileImageUpload ? 'Photo verified' : 'Photo unverified'}
          </MyText>
        </View>
      </View>
    </BottomModalWrapper>
  );
}
