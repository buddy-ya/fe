import React from 'react';
import { TouchableOpacity } from 'react-native';
import MyText from '../common/MyText';

interface SelectItemProps {
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
  item?: string;
  children?: React.ReactNode;
}

export default function SelectItem({
  selected,
  disabled,
  onPress,
  item,
  children,
}: SelectItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`mb-3 h-[52px] w-[262px] flex-row items-center rounded-xl border px-4 py-4 ${
        selected ? 'border-[1px] border-primary bg-chipActive' : 'border-border'
      } `}
    >
      <MyText size="text-base" color={selected ? 'text-active' : undefined}>
        {item}
      </MyText>
      {children}
    </TouchableOpacity>
  );
}
