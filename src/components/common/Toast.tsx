import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import MyText from './MyText';

interface ToastProps {
  visible: boolean;
  icon: JSX.Element | string;
  text: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({ visible, icon, text, duration = 1200, onClose }: ToastProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
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
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, duration, onClose]);

  if (!visible) return null;

  return (
    <Animated.View
      className="absolute bottom-[100px] left-10 right-10 z-10 max-w-[80%] flex-row items-center rounded-[12px] bg-toastBackground px-5 py-4"
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
      <View className="max-w-[90%]">
        <MyText size="text-[14px]" className="ml-4 font-bold text-white">
          ㄹㄹㅁ젊젖ㅁ로ㅓㅓㄹㅈ멀저마ㅓㅘㄹㅈ머ㅏㅁㄹ저ㅘㅗ마ㅓㅈ로ㅓㅏㅈㄹ머ㅗㅗ머ㅏㅈ로ㅓㅏㄹㅁ저ㅏㅗㄹㅁ저ㅏㅓㅏㅗㅁㄹ조ㅓㅏㅁㄹ저ㅘㅓㅘ
        </MyText>
      </View>
    </Animated.View>
  );
}
