import { Text, View } from 'react-native';

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>{message}</Text>
    </View>
  );
}
