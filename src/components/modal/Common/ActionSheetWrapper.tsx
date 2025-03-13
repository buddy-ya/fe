import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, TouchableOpacity, View, Animated } from 'react-native';
import MyText from '@/components/common/MyText';

export interface OptionItem {
  id: number | string;
  label: string;
  icon?: JSX.Element;
  onPress: () => void | Promise<void>;
}

interface ActionSheetWrapperProps {
  visible: boolean;
  onClose: () => void;
  options: OptionItem[];
}

export function ActionSheetWrapper({ visible, onClose, options }: ActionSheetWrapperProps) {
  // Animated value for sliding effect
  const slideAnim = useRef(new Animated.Value(100)).current;
  const { t } = useTranslation();

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(500);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 100, // 마찰, 클수록 진동 감소
        stiffness: 200, // 강도, 클수록 빠른 반응
        overshootClamping: true, // 약간의 오버슈팅(넘침) 방지
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={onClose}>
        <View className="absolute bottom-8 left-5 right-5">
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <View className="rounded-[12px] bg-white">
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option.id}
                  className={`p-[16px] ${index !== 0 ? 'border-t' : ''} border-modalBorderBottom`}
                  onPress={async () => {
                    await option.onPress();
                    onClose();
                  }}
                >
                  <View className="flex-row items-center justify-center">
                    {option.icon && <View className="mr-[8px]">{option.icon}</View>}
                    <MyText className="text-center font-medium">{option.label}</MyText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View className="mt-4 rounded-[12px] bg-white">
              <TouchableOpacity className="p-[15px]" onPress={onClose}>
                <MyText className="text-center font-medium">{t('common:modal.cancel')}</MyText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
