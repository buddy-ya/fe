import { useTranslation } from 'react-i18next';
import { Modal, TouchableOpacity, View } from 'react-native';
import { useUserStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import MyText from '@/components/common/MyText';

interface CommonModalProps {
  visible: boolean;
  onClose: () => void;
  size?: 'default' | 'sm';
  position?: 'bottom' | 'center';
}

export function StudentCertificationModal({
  visible,
  onClose,
  size = 'default',
  position = 'bottom',
}: CommonModalProps) {
  const { t } = useTranslation('certification');
  const navigation = useNavigation<any>();
  const isKorean = useUserStore((state) => state.isKorean);
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
  const onConfirm = isKorean
    ? () => navigation.navigate('EmailVerification')
    : () => navigation.navigate('StudentIdVerification');

  const getPositionStyle = () => {
    if (position === 'center') {
      return 'top-1/2 -translate-y-1/2';
    }
    return 'bottom-8';
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return 'min-h-[140px]';
      default:
        return 'min-h-[180px]';
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={onClose}>
        <View className={`absolute left-5 right-5 rounded-[20px] bg-white ${getPositionStyle()}`}>
          <View className="px-5 py-6">
            <View className={getSizeStyle()}>
              <MyText size="text-2xl" className="font-semibold">
                {title}
              </MyText>
              <MyText size="text-[14px] mt-5" color="text-textDescription">
                {description}
              </MyText>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                className="mr-3 flex-1 rounded-[12px] bg-[#DFDFDF] py-[16px]"
                onPress={onClose}
              >
                <MyText size="text-[16px]" className="text-center font-semibold text-white">
                  {cancelText}
                </MyText>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-[12px] bg-primary py-[16px]"
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              >
                <MyText size="text-[16px]" className="text-center font-semibold text-white">
                  {confirmText}
                </MyText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
