import React from "react";
import { Modal, View, TouchableOpacity } from "react-native";
import MyText from "./MyText";

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  cancelText?: string;
  confirmText?: string;
}

export default function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  title,
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
        <View className="absolute bottom-8 left-5 right-5 bg-white rounded-[20px] py-0">
          <View className="py-5 px-5">
            <MyText className="text-center text-lg mb-5">{title}</MyText>
            <View className="flex-row">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-xl py-3 mr-2"
                onPress={onClose}
              >
                <MyText className="text-center">{cancelText}</MyText>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary rounded-xl py-3"
                onPress={() => {
                  onClose();
                  onConfirm();
                }}
              >
                <MyText className="text-center text-white">
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
