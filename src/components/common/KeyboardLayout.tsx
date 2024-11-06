import React, { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

interface KeyboardLayoutProps {
  children: ReactNode;
  bottomButton?: ReactNode;
}

export default function KeyboardLayout({
  children,
  bottomButton,
}: KeyboardLayoutProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1">
        {children}
        {bottomButton && (
          <View className="absolute bottom-8 right-5">{bottomButton}</View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
