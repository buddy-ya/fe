import React from 'react';
import { useTranslation } from 'react-i18next';
import { useModalStore } from '@/store';
import { Ban, LogOut, Siren, UserRoundX } from 'lucide-react-native';
import { ActionSheetWrapper, OptionItem } from '../Common';

interface ChatOptionModalProps {
  visible: boolean;
  onClose: () => void;
  roomId: number;
  buddyId: number;
  roomType: 'CHAT_REQUEST' | 'MATCHING';
  onExit: () => void;
}

export function ChatOptionModal({
  visible,
  onClose,
  roomId,
  buddyId,
  roomType = 'MATCHING',
  onExit,
}: ChatOptionModalProps) {
  const { t } = useTranslation('feed');
  const handleModalOpen = useModalStore((state) => state.handleOpen);

  const handleReportOption = () => {
    onClose();
    setTimeout(() => {
      handleModalOpen('report', {
        type: 'CHATROOM',
        reportedId: roomId,
        reportedUserId: buddyId,
        onReportSuccess: onExit,
      });
    }, 200);
  };

  const handleNoResponseOption = () => {
    onClose();
    setTimeout(() => {
      handleModalOpen('noResponse', {
        reportedId: roomId,
        reportedUserId: buddyId,
        onReportSuccess: onExit,
      });
    }, 200);
  };

  const handleBlockOption = () => {
    onClose();
    setTimeout(() => {
      handleModalOpen('block', {
        buddyId: buddyId,
        roomId: roomId,
        onBlockSuccess: onExit,
      });
    }, 200);
  };

  const handleExitOption = () => {
    onClose();
    setTimeout(() => {
      handleModalOpen('exit', {
        roomId: roomId,
        onExit: onExit,
      });
    }, 200);
  };

  const options: OptionItem[] = [
    {
      id: 1,
      label: t('modal.report'),
      icon: <Siren size={16} color="#282828" />,
      onPress: handleReportOption,
    },
    {
      id: 2,
      label: t('modal.block'),
      icon: <Ban size={16} color="#282828" />,
      onPress: handleBlockOption,
    },
    ...(roomType === 'MATCHING'
      ? [
          {
            id: 3,
            label: t('modal.noResponse', '응답없음'),
            icon: <UserRoundX size={16} color="#282828" />,
            onPress: handleNoResponseOption,
          },
        ]
      : []),
    {
      id: 4,
      label: t('modal.exit'),
      icon: <LogOut size={16} color="#282828" />,
      onPress: handleExitOption,
    },
  ];

  return <ActionSheetWrapper visible={visible} onClose={onClose} options={options} />;
}
