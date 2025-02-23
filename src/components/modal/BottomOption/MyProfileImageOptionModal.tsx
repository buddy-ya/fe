import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, UserRound } from 'lucide-react-native';
import { ActionSheetWrapper, OptionItem } from '../Common';

interface MyProfileImageOptionModalProps {
  visible: boolean;
  onProfileImageUpload: () => Promise<void>;
  onProfileImageDefault: () => Promise<void>;
  onClose: () => void;
}

export function MyProfileImageOptionModal({
  visible,
  onProfileImageUpload,
  onProfileImageDefault,
  onClose,
}: MyProfileImageOptionModalProps) {
  const { t } = useTranslation('mypage');

  const options: OptionItem[] = [
    {
      id: 1,
      label: t('profile.modal.image'),
      icon: <Image size={16} color="#282828" />,
      onPress: onProfileImageUpload,
    },
    {
      id: 2,
      label: t('profile.modal.default'),
      icon: <UserRound size={16} color="#282828" />,
      onPress: onProfileImageDefault,
    },
  ];

  return <ActionSheetWrapper visible={visible} onClose={onClose} options={options} />;
}
