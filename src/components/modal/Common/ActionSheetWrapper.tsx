import React, { useEffect, useRef, useState } from 'react';
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
  // 내부 상태: 모달이 렌더링되어야 하는지 여부.
  const [isMounted, setIsMounted] = useState(visible);
  const slideAnim = useRef(new Animated.Value(visible ? 0 : 500)).current;
  const { t } = useTranslation();

  useEffect(() => {
    if (visible) {
      // visible이 true이면 모달을 렌더링하도록 상태 설정.
      setIsMounted(true);
      // 모달이 열릴 때 초기값을 500으로 설정하고 슬라이드 인 애니메이션 실행.
      slideAnim.setValue(500);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 100,
        stiffness: 200,
        overshootClamping: true,
      }).start();
    } else {
      // visible이 false이면 슬라이드 아웃 애니메이션 실행 후 모달 unmount.
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (onAfterClose) {
          onAfterClose();
        }
        setIsMounted(false);
      });
    }
  }, [visible, slideAnim, onAfterClose]);

  if (!isMounted) {
    return null;
  }

  return (
    // Modal의 visible prop은 항상 true로 전달하여 내부 상태가 관리되도록 함.
    <Modal visible={true} transparent animationType="none" onRequestClose={onClose}>
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
