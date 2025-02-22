import { TouchableOpacity, View } from 'react-native';
import MyText from './MyText';

interface TabProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
}

export function Tab({ label, selected, onPress, className }: TabProps) {
  return (
    <TouchableOpacity onPress={onPress} className="mb-[0.3px]">
      <View className={`flex-row items-center rounded-full px-1 py-2 ${className || ''}`}>
        <MyText size="text-xl" color={selected ? 'text-default' : 'text-textLight'}>
          {label}
        </MyText>
      </View>
    </TouchableOpacity>
  );
}
