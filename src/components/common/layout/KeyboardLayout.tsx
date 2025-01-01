import React, { ReactNode } from 'react';

import { KeyboardAvoidingView, Platform, View } from 'react-native';

interface KeyboardLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
}

export default function KeyboardLayout({ children, footer }: KeyboardLayoutProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      className="flex-1"
    >
      <View className="flex-1">
        {children}
        {footer}
      </View>
    </KeyboardAvoidingView>
  );
}
