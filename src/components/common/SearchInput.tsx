import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
  Keyboard,
} from 'react-native';
import { Search } from 'lucide-react-native';

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
  const { t } = useTranslation('onboarding');

  const handleDismissButton = () => {
    onChangeText('');
    Keyboard.dismiss();
  };

  const DismissButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity onPress={onPress}>
      <Text className="text-textDescription">{t('common.cancel')}</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className={`mt-7 flex-row items-center justify-between rounded-xl border border-border px-4 ${className}`}
      >
        <Search size={20} color="gray" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          allowFontScaling={false}
          maxLength={30}
          multiline={false}
          numberOfLines={1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={Platform.select({
            ios: 'ml-[7px] flex-1 py-[12px] text-[15px] leading-[20px] text-text',
            android: 'ml-[7px] flex-1 py-[8px] text-[14px] leading-[18px] text-text',
          })}
        />
        <View>{isFocused && <DismissButton onPress={handleDismissButton} />}</View>
      </View>
    </TouchableWithoutFeedback>
  );
}
