import React, { useEffect, useRef } from 'react';
import { Modal, TouchableOpacity, View, Animated } from 'react-native';
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
  // 초기값 300: 모달 콘텐츠가 화면 아래쪽에서 시작
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      // visible 상태가 true가 될 때마다 초기 위치를 재설정
      slideAnim.setValue(400);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 100,
        stiffness: 200,
        overshootClamping: true, // 약간의 오버슈팅(넘침) 방지
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }] }}
          className="absolute bottom-0 w-full"
        >
          <View className="rounded-[12px] bg-white">
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
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
