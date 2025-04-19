import { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Skeleton = () => {
  const [fadeAnim] = useState(new Animated.Value(0.3)); // 애니메이션 초기값 설정

  useEffect(() => {
    // 무한 반복 애니메이션
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    // TODO: android, ios 분기  필요
    <SafeAreaView>
      <View style={styles.container}>
        {/* 카드 리스트 스켈레톤 */}
        {[...Array(9)].map((_, index) => (
          <View key={index} style={styles.card}>
            <Animated.View style={[styles.cardImage, { opacity: fadeAnim }]} />
            <View style={styles.cardTextContainer}>
              <Animated.View style={[styles.line, { opacity: fadeAnim }]} />
              <Animated.View style={[styles.shortLine, { opacity: fadeAnim }]} />
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginTop: 8,
  },
  line: {
    height: 20,
    width: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  shortLine: {
    height: 20,
    width: 150,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardImage: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  cardTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
});

export default Skeleton;
