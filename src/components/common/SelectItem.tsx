import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";

interface SelectOption {
  id: string;
  icon?: string;
}

interface SelectItemProps {
  options: SelectOption[];
  selectedValues: SelectOption[];
  onSelect: (value: SelectOption) => void;
  maxSelect?: number;
  multiple?: boolean;
  nameSpace: string;
  className?: string;
}

export default function SelectItem({
  options,
  selectedValues,
  onSelect,
  maxSelect = 1,
  multiple = false,
  nameSpace,
  className,
}: SelectItemProps) {
  const { t } = useTranslation(nameSpace);

  const isSelected = (option: SelectOption) =>
    selectedValues.some((selected) => selected.id === option.id);

  const isDisabled = (option: SelectOption) =>
    !multiple
      ? false
      : !isSelected(option) && selectedValues.length >= maxSelect;

  return (
    <View className={`flex-1 mt-1 mb-5 ${className}`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => onSelect(option)}
            disabled={isDisabled(option)}
            className="flex-row items-center justify-between py-4 border-b border-borderSelect"
          >
            <View className="flex-row items-center">
              {option.icon && (
                <Text className="mr-3 text-base">{option.icon}</Text>
              )}
              <Text className="text-base">
                {t(`${nameSpace}.${option.id}`)}
              </Text>
            </View>
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
