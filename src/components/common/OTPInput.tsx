import React from "react";
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MyText from "./MyText";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export default function OTPInput({
  value,
  onChange,
  length = 6,
}: OTPInputProps) {
  const handleChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
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
            className={`
              w-[40px] h-[50px] 
              border border-border rounded-[10px] 
              items-center justify-center
              mr-2
            `}
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
        className="absolute w-full h-full opacity-0"
        autoFocus
      />
    </View>
  );
}
