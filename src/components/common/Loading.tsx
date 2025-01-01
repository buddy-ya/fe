import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import MyText from './MyText';

interface LoadingProps {
  size?: 'small' | 'large';
  text?: string;
}

export default function Loading({ size = 'large', text }: LoadingProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color="#00A176" />
      {text && (
        <MyText color="text-textDescription" className="mt-2">
          {text}
        </MyText>
      )}
    </View>
  );
}
