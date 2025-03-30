import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export function ThreeDotLoader() {
  // 각 점이 커졌다 작아지는 비율을 관리하는 Animated.Value
  const dot1Scale = useRef(new Animated.Value(1)).current;
  const dot2Scale = useRef(new Animated.Value(1)).current;
  const dot3Scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    animateDots();
  }, []);

  /**
   * 세 점의 애니메이션을 순차적으로 실행하고,
   * 모두 끝나면 재귀적으로 다시 실행하여 무한 반복
   */
  const animateDots = () => {
    Animated.stagger(150, [
      scaleAnimation(dot1Scale),
      scaleAnimation(dot2Scale),
      scaleAnimation(dot3Scale),
    ]).start(() => {
      animateDots();
    });
  };

  /**
   * 하나의 Animated.Value에 대해
   * (1) scale을 1.4까지 확대 -> (2) 다시 1로 축소
   * 두 애니메이션을 순차적으로 실행
   */
  const scaleAnimation = (animatedValue: Animated.Value) => {
    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.6, // 점이 커지는 비율 (기본값 1.4)
        duration: 350, // 커지는 데 걸리는 시간 (ms)
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1, // 다시 원래 크기로 축소
        duration: 350, // 축소하는 데 걸리는 시간 (ms)
        useNativeDriver: true,
      }),
    ]);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { transform: [{ scale: dot1Scale }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ scale: dot2Scale }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ scale: dot3Scale }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // 점을 가로로 일렬 배치
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    // 점의 크기(너비/높이)
    width: 11,
    height: 11,
    // 점을 원형으로 만들기 위해 borderRadius를 절반으로 지정
    borderRadius: 11,
    // 점 색상
    backgroundColor: '#ccc',
    // 점 사이 간격
    marginHorizontal: 8,
  },
});
