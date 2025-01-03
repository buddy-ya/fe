import React from 'react';
import { TextInput, View } from 'react-native';
import MyText from './MyText';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export default function OTPInput({ value, onChange, length = 6 }: OTPInputProps) {
  const handleChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= length) {
      onChange(numericValue);
    }
  };

  return (
    <View>
      <View className="flex-row">
        {[...Array(length)].map((_, index) => (
          <View
            key={index}
            className={`mr-2 h-[50px] w-[40px] items-center justify-center rounded-[10px] border border-border`}
          >
            <MyText size="text-[18px]">{value[index]}</MyText>
          </View>
        ))}
      </View>

      <TextInput
        value={value}
        onChangeText={handleChange}
        maxLength={length}
        keyboardType="number-pad"
        className="absolute h-full w-full opacity-0"
        autoFocus
      />
    </View>
  );
}
