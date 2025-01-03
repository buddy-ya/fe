import React from 'react';
import { Text, View } from 'react-native';

export default function EmptyState({ message }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>{message}</Text>
    </View>
  );
}
