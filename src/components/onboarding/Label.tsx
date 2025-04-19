import React from 'react';
import { View } from 'react-native';
import { MyText } from '../common';

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function Label({ children, className }: LabelProps) {
  return (
    <View className={`mb-3 mt-11 ${className}`}>
      <MyText size="text-base" className="font-semibold">
        {children}
      </MyText>
    </View>
  );
}
