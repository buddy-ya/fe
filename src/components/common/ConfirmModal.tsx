import { Modal, TouchableOpacity, View } from 'react-native';
import MyText from './MyText';

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  size?: 'default' | 'sm';
  position?: 'bottom' | 'center';
}

export default function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  title,
  description,
  cancelText = '아니요',
  confirmText = '네',
  size = 'default',
  position = 'bottom',
}: ConfirmModalProps) {
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
                  onClose();
                  onConfirm();
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
