import { Check } from 'lucide-react-native';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MyText from '../common/MyText';

export interface BaseOption {
  id: string;
  icon?: string;
}

interface MultiSelectItemProps<T extends { id: string; icon?: string }> {
  options: T[];
  selectedValues: T[];
  onSelect: (value: T) => void;
  maxSelect?: number;
  multiple?: boolean;
  nameSpace: string;
  className?: string;
}

function MultiSelectItem<T extends { id: string; icon?: string } = BaseOption>({
  options,
  selectedValues,
  onSelect,
  maxSelect = 1,
  multiple = false,
  nameSpace,
  className,
}: MultiSelectItemProps<T>) {
  const { t } = useTranslation(nameSpace);

  const isSelected = (option: T) => selectedValues.some((selected) => selected.id === option.id);

  const isDisabled = (option: T) =>
    !multiple ? false : !isSelected(option) && selectedValues.length >= maxSelect;

  return (
    <View className={`mb-8 mt-4 flex-1 ${className}`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => onSelect(option)}
            disabled={isDisabled(option)}
            className="flex-row items-center justify-between border-b border-borderSelect py-4"
          >
            <View className="flex-row items-center">
              {option.icon && <Text className="mr-3 text-base">{option.icon}</Text>}
              <MyText size="text-base">{t(`${nameSpace}.${option.id}`)}</MyText>
            </View>
            <View
              className={`h-6 w-6 items-center justify-center rounded-md ${
                isSelected(option) ? 'bg-primary' : 'border border-borderCheckbox'
              } `}
            >
              {isSelected(option) && <Check size={16} color="white" />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default memo(MultiSelectItem);
