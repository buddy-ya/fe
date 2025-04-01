import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import SearchIcon from '@assets/icons/match/search.svg';
import { BottomModalWrapper } from './Common';

interface CommonModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function MatchRequestModal({ visible, onConfirm, onClose }: CommonModalProps) {
  const { t } = useTranslation('match');

  const title = t('match.requestModal.title');
  const description = t('match.requestModal.description', { point: 1 });
  const cancelText = t('match.requestModal.cancelText');
  const confirmText = t('match.requestModal.confirmText');

  return (
    <BottomModalWrapper
      visible={visible}
      onClose={onClose}
      title={title}
      description={description}
      cancelText={cancelText}
      confirmText={confirmText}
      onConfirm={onConfirm}
      confirmType="point"
      point="1"
    >
      <View className="mt-5 h-[140px] flex-row items-center justify-center rounded-[12px] bg-mainBackground">
        <SearchIcon width={60} height={60} />
      </View>
    </BottomModalWrapper>
  );
}
