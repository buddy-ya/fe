import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { SendHorizonal } from 'lucide-react-native';

export function PlaneAnimation() {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 30, // 시작점에서 오른쪽으로 300까지 이동
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),

      Animated.timing(opacity, {
        toValue: 0, // 서서히 사라짐
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      translateX.setValue(0);
      translateY.setValue(0);
      opacity.setValue(1);
      startAnimation();
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.iconWrapper, { transform: [{ translateX }, { translateY }], opacity }]}
      >
        <SendHorizonal size={18} color="black" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // 원하는 크기와 배경으로 조절 (예시)
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
