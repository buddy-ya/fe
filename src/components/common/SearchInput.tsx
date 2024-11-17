import React, { useState } from "react";
import {
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
} from "react-native";
import { Search, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChangeText,
  placeholder,
  className,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { t } = useTranslation("onboarding");

  const DismissButton = ({ onPress }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Text className=" text-textDescription">{t("common.cancel")}</Text>
      </TouchableOpacity>
    );
  };

  const handleDismissButton = () => {
    onChangeText("");
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className={`flex-row justify-between items-center mt-6 px-4 py-3 border border-border rounded-xl ${className}`}
      >
        <Search size={20} color="gray" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          className="flex-1 ml-2"
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
          }}
        />
        <View>
          {isFocused && <DismissButton onPress={handleDismissButton} />}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
