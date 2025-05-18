import React from 'react';
import { View } from 'react-native';
import { MyText } from '../common';

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function Label({ children, className }: LabelProps) {
  return (
    <View className={`mb-4 mt-7 ${className}`}>
      <MyText size="text-base" className="font-semibold">
        {children}
      </MyText>
    </View>
  );
}
