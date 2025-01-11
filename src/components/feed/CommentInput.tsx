import { Send } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface CommentInputProps {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export const CommentInput = ({ value, onChange, onSubmit, isLoading }: CommentInputProps) => {
  const { t } = useTranslation('feed');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`flex-row items-center justify-between border-t-[0.3px] border-borderBottom bg-white px-4 py-[12px] ${isFocused ? '' : 'pb-8'
        }`}
    >
      <TextInput
        value={value}
        onChangeText={(text) => {
          onChange(text);
        }}
        placeholder={t('comment.placeholder')}
        className="w-[90%] rounded-[12px] bg-[#F1F1F1] max-h-[90px] min-h-[40px] px-[16px] py-2.5 text-[15px] leading-5 align-middle"
        multiline
        scrollEnabled={true}
        maxLength={500}
        onSubmitEditing={onSubmit}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <TouchableOpacity
        onPress={onSubmit}
        disabled={!value.trim() || isLoading}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Send strokeWidth={1.3} color={`#CBCBCB`} />
      </TouchableOpacity>
    </View>
  );
};
