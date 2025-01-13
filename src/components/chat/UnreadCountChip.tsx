import { TouchableOpacity, View } from 'react-native';
import { MyText } from '../common';

interface ChipProps {
  icon?: string;
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
  readOnly?: boolean;
}

export function UnreadCountChip({ icon, label, selected, onPress, className, readOnly, }: ChipProps) {
  const Container = readOnly ? View : TouchableOpacity;

  return (
    <Container onPress={!readOnly ? onPress : undefined} className="mb-[0.3px]">
      <View
        className={`flex-row items-center rounded-full border px-4 py-0 ${selected ? 'border-primary bg-chipActive' : 'border-border'} ${className || ''}`}
      >
        {icon && <MyText className="mr-2">{icon}</MyText>}
        <MyText
          size="text-sm"
          color={readOnly ? undefined : selected ? 'text-active' : 'text-textDescription'}
          className={'leading-[1.0] text-white'}
        >
          {label}
        </MyText>
      </View>
    </Container>
  );
}
