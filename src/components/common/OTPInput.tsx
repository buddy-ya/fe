import React from "react";
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

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
    <View className="relative">
      <View className="w-[80%] flex-row justify-between px-2">
        {[...Array(length)].map((_, index) => (
          <View
            key={index}
            className={`
              w-[38px] h-[50px] 
              border rounded-lg 
              items-center justify-center
              mr-3
              ${value[index] ? "border-primary" : "border-gray-600"}
            `}
          >
            <Text
              className={`text-lg ${
                value[index] || "font-extralight color-gray-500"
              }`}
            >
              {value[index] || index + 1}
            </Text>
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
