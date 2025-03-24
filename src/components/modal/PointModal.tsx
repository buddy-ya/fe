import React, { useEffect } from 'react';
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { MyText } from '@/components';
import { Check } from 'lucide-react-native';

interface PointModalProps {
  visible: boolean;
  onClose: () => void;
  usedPoint: number;
  currentPoint: number;
  autoHideDuration?: number;
}

export function PointModal({
  visible,
  onClose,
  usedPoint,
  currentPoint,
  autoHideDuration = 1500,
}: PointModalProps) {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (visible) {
      timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, autoHideDuration, onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.4)]"
      >
        <TouchableWithoutFeedback>
          <View className="w-80 rounded-2xl bg-white p-8">
            <View className="mb-4 items-center">
              <Check size={28} color="black" />
            </View>
            <MyText size="text-lg" color="text-black" className="mb-2 text-center font-semibold">
              {usedPoint}밋이 차감되었어요!
            </MyText>
            <MyText size="text-base" color="text-[#777777]" className="text-center">
              보유 밋 {currentPoint}밋
            </MyText>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}
