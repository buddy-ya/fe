import React, { ReactNode } from "react";
import { View } from "react-native";
import Button from "@/components/common/Button";

interface FooterLayoutProps {
  icon: ReactNode;
  content: ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

export default function FooterLayout({
  icon,
  content,
  onPress,
  disabled = false,
}: FooterLayoutProps) {
  return (
    <View className="w-full flex-row items-center justify-between px-4 py-4 border-[0.3px] border-b-0 border-borderFooter bg-footerBackground rounded-t-3xl">
      <View className="flex-1 flex-row items-center mr-4">
        {icon}
        {content}
      </View>
      <Button type="circle" onPress={onPress} disabled={disabled} />
    </View>
  );
}
