import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text } from 'react-native';
import MyText from './MyText';

interface ToastProps {
  visible: boolean;
  icon: JSX.Element | string;
  text: string;
  onClose: () => void;
}

export function Toast({ visible, icon, text, onClose }: ToastProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const DURATION = 1200;
  const ANIMATION_DURATION = 300;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            onClose();
          }
        });
      }, DURATION);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, onClose]);

  if (!visible) return null;

  return (
    <Animated.View
      className="bg-toastBackground absolute bottom-20 left-10 right-10 flex-row items-center rounded-[12px] px-5 py-4"
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          },
        ],
      }}
    >
      <MyText>{icon}</MyText>
      <MyText size="text-[14px]" className="ml-4 font-bold text-white">
        {text}
      </MyText>
    </Animated.View>
  );
}
