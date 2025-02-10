import { ReactNode } from 'react';
import { View } from 'react-native';
import Button from '../Button';

interface FooterLayoutProps {
  icon: ReactNode;
  content: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function FooterLayout({
  icon,
  content,
  onPress,
  disabled = false,
  loading = false,
}: FooterLayoutProps) {
  return (
    <View className="w-full flex-row items-center justify-between rounded-t-3xl border-[0.3px] border-b-0 border-borderFooter bg-footerBackground px-4 py-4">
      <View className="mr-4 flex-1 flex-row items-center">
        {icon}
        {content}
      </View>
      <Button type="circle" onPress={onPress} disabled={disabled} loading={loading} />
    </View>
  );
}
