import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
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

  const DismissButton = ({ onPress }: { onPress: () => void }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Text className="text-textDescription">{t('common.cancel')}</Text>
      </TouchableOpacity>
    );
  };

  const handleDismissButton = () => {
    onChangeText('');
    Keyboard.dismiss();
  };

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
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
          }}
          style={{ marginLeft: 7, flex: 1, paddingVertical: 10, fontSize: 15, lineHeight: 20 }}
        />
        <View>{isFocused && <DismissButton onPress={handleDismissButton} />}</View>
      </View>
    </TouchableWithoutFeedback>
  );
}
