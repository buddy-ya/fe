import React from 'react';
import { View } from 'react-native';
import SearchIcon from '@assets/icons/match/search.svg';
import MyText from '@/components/common/MyText';
import { BottomModalWrapper } from './Common';

interface CommonModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function MatchRequestModal({ visible, onConfirm, onClose }: CommonModalProps) {
  const title = '버디를 찾아볼까요?';
  const description =
    '매칭이 완료되기까지 n일의 시간이 소요될 수 있으며,\n매칭에 0 포인트가 사용됩니다.';
  const cancelText = '닫기';
  const confirmText = '확인하기';

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
      <View className="mt-5 h-[140px] flex-row items-center justify-center rounded-[12px] bg-mainBackground">
        <SearchIcon width={60} height={60} />
      </View>
    </BottomModalWrapper>
  );
}
