import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";

interface Language {
  en: string;
  ko: string;
}

interface MultiSelectListProps {
  options: Language[];
  selectedValues: Language[];
  onToggleSelect: (value: Language) => void;
  maxSelect: number;
  className?: string;
}

export default function MultiSelectItem({
  options,
  selectedValues,
  onToggleSelect,
  maxSelect,
  className,
}: MultiSelectListProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith("ko") ? "ko" : "en";

  const isSelected = (option: Language) =>
    selectedValues.some((selected) => selected.en === option.en);

  return (
    <View className={`h-[400px] mt-4 ${className}`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.en}
            onPress={() => onToggleSelect(option)}
            disabled={!isSelected(option) && selectedValues.length >= maxSelect}
            className="flex-row items-center justify-between py-4 border-b border-borderSelect"
          >
            <Text className="text-base">{option[currentLang]}</Text>
            <View
              className={`
                w-6 h-6 items-center justify-center rounded-md
                ${
                  isSelected(option)
                    ? "bg-primary"
                    : "border border-borderCheckbox"
                }
              `}
            >
              {isSelected(option) && <Check size={16} color="white" />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
