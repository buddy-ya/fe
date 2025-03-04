import React from 'react';
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { MyText } from '@/components/common';

interface StandardModalProps {
  visible: boolean;
  title: string;
  description: string;
  cancelText: string;
  acceptText: string;
  onCancel: () => void;
  onAccept: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function StandardModal({
  visible,
  title,
  description,
  cancelText,
  acceptText,
  onCancel,
  onAccept,
  children,
  className,
}: StandardModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <TouchableWithoutFeedback onPress={onCancel}>
          <View className="absolute bottom-0 left-0 right-0 top-0" />
        </TouchableWithoutFeedback>
        <View className={`w-5/6 max-w-[350px] rounded-xl bg-white p-5 ${className}`}>
          <MyText size="text-[20px]" className="mb-2 font-semibold">
            {title}
          </MyText>
          <MyText color="text-textDescription" size="text-[14px]" className="">
            {description}
          </MyText>
          {children && <View className="mt-4">{children}</View>}
          <View className="mt-6 flex-row items-center justify-between gap-4">
            <TouchableOpacity
              onPress={onCancel}
              className="mr-2 flex-1 rounded-lg bg-[#DFDFDF] py-2"
            >
              <MyText size="text-lg" color="text-white" className="text-center font-semibold">
                {cancelText}
              </MyText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onAccept} className="flex-1 rounded-lg bg-primary py-2">
              <MyText size="text-lg" color="text-white" className="text-center font-semibold">
                {acceptText}
              </MyText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
