import { ModalOption } from '@/screens/home/types';
import { ReactNode } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import MyText from '../MyText';

interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  options?: ModalOption[];
  children?: ReactNode;
}

export function BottomModal({
  visible,
  onClose,
  options = [],
  children,
}: BottomModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={onClose}>
        <View className="absolute bottom-8 left-5 right-5 rounded-[20px] bg-white py-0">
          {children ||
            options.map((option, index) => (
              <TouchableOpacity
                key={index}
                className={`py-6 ${index !== 0 && 'border-t'} border-modalBorderBottom`}
                onPress={() => {
                  onClose();
                  option.onPress();
                }}
              >
                <View className="flex-row items-center justify-center">
                  {option.icon && <View className="mr-2">{option.icon}</View>}
                  <MyText
                    size="text-[16px]"
                    className="text-center"
                    color={option.color || 'text-[#282828]'}
                  >
                    {option.label}
                  </MyText>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
