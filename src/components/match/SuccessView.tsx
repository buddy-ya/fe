import React from 'react';
import { View, Text } from 'react-native';
import { useMatchStore } from '@/store/useMatchStore';

export default function SuccessView() {
  const updateMatchStatus = useMatchStore((state) => state.updateMatchStatus);
  return (
    <View>
      <Text>SuccessView</Text>
    </View>
  );
}
