import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import MyText from '@/components/common/MyText';

export interface OptionItem {
  id: number | string;
  label: string;
  icon?: JSX.Element;
  onPress: () => void;
}

interface ActionSheetWrapperProps {
  visible: boolean;
  onClose: () => void;
  options: OptionItem[];
}

export function ActionSheetWrapper({ visible, onClose, options }: ActionSheetWrapperProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={onClose}>
        <View className="absolute bottom-8 left-5 right-5">
          <View className="rounded-[12px] bg-white">
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                className={`p-[16px] ${index !== 0 ? 'border-t' : ''} border-modalBorderBottom`}
                onPress={() => {
                  option.onPress();
                  onClose();
                }}
              >
                <View className="flex-row items-center justify-center">
                  {option.icon && <View className="mr-[8px]">{option.icon}</View>}
                  <MyText className="text-center font-semibold">{option.label}</MyText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View className="mt-4 rounded-[12px] bg-white">
            <TouchableOpacity className="p-[15px]" onPress={onClose}>
              <MyText className="text-center font-semibold">닫기</MyText>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
