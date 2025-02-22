import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useUserStore } from '@/store';
import PendingCertificationIcon from '@assets/icons/shield.svg';
import DefaultCertificationIcon from '@assets/icons/student-id-card.svg';
import { useNavigation } from '@react-navigation/native';
import MyText from '@/components/common/MyText';
import { BottomModalWrapper } from './BottomModalWrapper';

interface CommonModalProps {
  visible: boolean;
  onClose: () => void;
}

export function StudentCertificationModal({ visible, onClose }: CommonModalProps) {
  const { t } = useTranslation('certification');
  const navigation = useNavigation<any>();
  const isStudentIdCardRequested = useUserStore((state) => state.isStudentIdCardRequested);

  const title = isStudentIdCardRequested ? t('banner.pending.title') : t('banner.default.title');
  const description = isStudentIdCardRequested
    ? t('banner.pending.description')
    : t('banner.default.description');
  const confirmText = isStudentIdCardRequested
    ? t('banner.pending.confirm')
    : t('banner.default.confirm');
  const cancelText = isStudentIdCardRequested
    ? t('banner.pending.cancel')
    : t('banner.default.cancel');
  const Icon = isStudentIdCardRequested ? PendingCertificationIcon : DefaultCertificationIcon;

  const onConfirm = () => {
    navigation.navigate('Verification', { screen: 'VerificationSelect' });
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
      <View className="mt-5 h-[140px] flex-row items-center justify-center rounded-[12px] bg-mainBackground">
        <Icon />
      </View>
    </BottomModalWrapper>
  );
}
