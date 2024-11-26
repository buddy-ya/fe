import React from "react";
import { Modal, View, TouchableOpacity } from "react-native";
import MyText from "./MyText";
import Heading from "../onboarding/Heading";

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
}

export default function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  title,
  description,
  cancelText = "아니요",
  confirmText = "네",
}: ConfirmModalProps) {
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
        <View className="absolute bottom-8 left-5 right-5 bg-white rounded-[20px]">
          <View className="py-5 px-5">
            <View className="min-h-[180px]">
              <MyText size="text-2xl" className="font-semibold mb-4">
                {title}
              </MyText>
              <MyText size="text-[14px]" color="text-textDescription">
                {description}
              </MyText>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                className="flex-1 bg-[#DFDFDF] rounded-[12px] py-[16px] mr-3"
                onPress={onClose}
              >
                <MyText
                  size="text-[16px]"
                  className="text-center font-semibold text-white"
                >
                  {cancelText}
                </MyText>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary rounded-xl py-[16px]"
                onPress={() => {
                  onClose();
                  onConfirm();
                }}
              >
                <MyText
                  size="text-[16px]"
                  className="text-center font-semibold text-white"
                >
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
