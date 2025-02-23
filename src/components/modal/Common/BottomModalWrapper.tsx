import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import MyText from '@/components/common/MyText';

interface BottomModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children?: React.ReactNode;
  cancelText: string;
  confirmText: string;
  onConfirm: () => void;
}

export function BottomModalWrapper({
  visible,
  onClose,
  title,
  description,
  children,
  cancelText,
  confirmText,
  onConfirm,
}: BottomModalWrapperProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={onClose}>
        <View className="absolute bottom-0 w-full rounded-[12px] bg-white">
          <View className="p-5">
            <View>
              <MyText size="text-[20px]" className="font-semibold">
                {title}
              </MyText>
              <MyText size="text-[14px] mt-4" color="text-textDescription">
                {description}
              </MyText>
            </View>
            {children}
            <View className="mb-2 mt-10 flex-row gap-2">
              <TouchableOpacity
                className="mr-3 flex-1 justify-center rounded-[12px] bg-[#E8E9EB] py-[12px]"
                onPress={onClose}
              >
                <MyText size="text-[16px]" className="text-center font-semibold text-white">
                  {cancelText}
                </MyText>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 justify-center rounded-[12px] bg-primary"
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
