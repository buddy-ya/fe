import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="mb-[20%] flex-1 items-center justify-center px-5">
      <Text className="font-semibold text-[24px] text-textDescription">{title}</Text>
      <Text className="mt-4 text-center text-lg text-textLight">{description}</Text>
    </View>
  );
}
