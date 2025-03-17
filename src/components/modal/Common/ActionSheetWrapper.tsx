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
  onAfterClose?: () => void;
}

export function ActionSheetWrapper({
  visible,
  onClose,
  options,
  onAfterClose,
}: ActionSheetWrapperProps) {
  const slideAnim = useRef(new Animated.Value(visible ? 0 : 500)).current;
  const { t } = useTranslation();

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(500);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 100,
        stiffness: 200,
        overshootClamping: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        if (onAfterClose) {
          onAfterClose();
        }
      });
    }
  }, [visible, slideAnim, onAfterClose]);

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
