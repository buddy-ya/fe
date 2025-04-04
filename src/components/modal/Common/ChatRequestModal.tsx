import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { API, ChatRequestRepository } from '@/api';
import { useModalStore, useToastStore, useUserStore } from '@/store';
import { getCountryFlag, logError } from '@/utils';
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
  const handleModalOpen = useModalStore((state) => state.handleOpen);
  const updateUser = useUserStore((state) => state.update);

  const onConfirm = async () => {
    const userId = data?.userId;
    try {
      const data = await ChatRequestRepository.create({ receiverId: userId });
      showToast(<Text>💬</Text>, t('chatRequestModal.success'));
    } catch (error: any) {}
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
      point="0"
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
