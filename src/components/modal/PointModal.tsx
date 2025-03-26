import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { MyText } from '@/components';
import { Check } from 'lucide-react-native';

interface PointModalProps {
  visible: boolean;
  onClose: () => void;
  usedPoint: number;
  currentPoint: number;
  autoHideDuration?: number;
  action: 'INCREASE' | 'DECREASE';
}

export function PointModal({
  visible,
  onClose,
  usedPoint,
  currentPoint,
  autoHideDuration = 2500,
  action,
}: PointModalProps) {
  const { t } = useTranslation('common');

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

  const formattedPoint = Math.abs(usedPoint);
  const message =
    action === 'DECREASE'
      ? t('modal.point.decrease', { point: formattedPoint })
      : t('modal.point.increase', { point: formattedPoint });

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
              {message}
            </MyText>
            <View className="flex-row items-center justify-center">
              <MyText size="text-base" color="text-textDescription" className="text-center">
                {t('modal.point.balance')}
              </MyText>
              <MyText
                size="text-base"
                color="text-textDescription"
                className="ml-3 mt-1 text-center"
              >
                {currentPoint}
              </MyText>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}
