import React, { ReactNode } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import MyText from "./MyText";

interface ModalOption {
  label: string;
  onPress: () => void;
  color?: string;
}

interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  options: ModalOption[];
}

export default function BottomModal({
  visible,
  onClose,
  options,
}: BottomModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="absolute bottom-8 left-5 right-5 bg-white py-0 rounded-[20px]">
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              className={`py-6 ${
                index != 0 && "border-t"
              } border-modalBorderBottom`}
              onPress={() => {
                onClose();
                option.onPress();
              }}
            >
              <MyText
                size="text-[16px]"
                className="text-center"
                color={option.color ? option.color : "text-[#282828]"}
              >
                {option.label}
              </MyText>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
