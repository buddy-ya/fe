import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { ChatSocketRepository } from '@/api';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import i18next from 'i18next';
import { Ban, LogOut, Siren } from 'lucide-react-native';
import { ActionSheetWrapper, OptionItem } from '../Common';

interface ChatOptionModalProps {
  visible: boolean;
  onClose: () => void;
  roomId: number;
}

export function ChatOptionModal({ visible, onClose, roomId }: ChatOptionModalProps) {
  const queryClient = useQueryClient();
  const navigation = useNavigation<any>();
  const { t } = useTranslation('feed');

  const showDeleteAlert = (onConfirm: () => void) => {
    Alert.alert(
      t('delete.title'),
      t('delete.description'),
      [
        { text: t('delete.cancel'), style: 'cancel' },
        { text: t('delete.confirm'), style: 'destructive', onPress: onConfirm },
      ],
      { cancelable: true }
    );
  };

  const handleRoomOut = async () => {
    try {
      // 예시로 roomId를 1로 사용합니다. 실제 사용 시 해당 채팅방 id를 전달하세요.
      await ChatSocketRepository.roomOut(roomId);
      // 채팅방 나가기 성공 후, 필요에 따라 네비게이션 또는 상태 업데이트를 진행합니다.
      console.log('채팅방 나가기 완료');
      onClose();
    } catch (error) {
      Alert.alert('채팅방 나가기 실패');
    }
  };

  const options: OptionItem[] = [
    {
      id: 1,
      label: i18next.t('feed:modal.report'),
      icon: <Siren size={16} color="#282828" />,
      onPress: () => console.log('report'),
    },
    {
      id: 2,
      label: i18next.t('feed:modal.block'),
      icon: <Ban size={16} color="#282828" />,
      onPress: () => console.log('block'),
    },
    {
      id: 3,
      label: i18next.t('feed:modal.exit'),
      icon: <LogOut size={16} color="#282828" />,
      onPress: () => {
        handleRoomOut();
        navigation.goBack();
      },
    },
  ];

  return <ActionSheetWrapper visible={visible} onClose={onClose} options={options} />;
}
