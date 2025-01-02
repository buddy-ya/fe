import React, { ReactNode } from 'react';
import { View } from 'react-native';

interface InnerLayoutProps {
  children: ReactNode;
  className?: string;
}
export default function InnerLayout({ children, className }: InnerLayoutProps) {
  return <View className={`flex-1 px-5 ${className}`}>{children}</View>;
}
